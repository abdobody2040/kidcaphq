
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { BusinessSimulation, VisualConfig } from '../../types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

const GRID_SIZE = 10;

const DrivingTemplate: React.FC<Props> = ({ config, onExit }) => {
  const { completeGame } = useAppStore();
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.scoring?.time_limit || 30);
  const [gameOver, setGameOver] = useState(false);

  // Visuals
  const visual: VisualConfig = config.visual_config || { 
      theme: 'light', 
      colors: { primary: '#3B82F6', secondary: '#1E3A8A', accent: '#EF4444', background: '#F3F4F6' },
      icon: '🚗'
  };

  const playerSprite = config.entities?.find(e => e.type === 'resource')?.emoji || '🛵';
  const targetSprite = config.entities?.find(e => e.type === 'target')?.emoji || '🏠';

  const handleExit = () => {
      // Award points directly
      completeGame(score, Math.floor(score * 0.5));
      onExit();
  };

  // Timer
  useEffect(() => {
      if (gameOver) return;
      const timer = setInterval(() => {
          setTimeLeft(t => {
              if (t <= 1) {
                  setGameOver(true);
                  return 0;
              }
              return t - 1;
          });
      }, 1000);
      return () => clearInterval(timer);
  }, [gameOver]);

  // Spawn Target
  const spawnTarget = () => {
      let x, y;
      do {
          x = Math.floor(Math.random() * GRID_SIZE);
          y = Math.floor(Math.random() * GRID_SIZE);
      } while (x === playerPos.x && y === playerPos.y);
      setTargetPos({ x, y });
  };

  const move = (dx: number, dy: number) => {
      if (gameOver) return;
      setPlayerPos(curr => {
          const nx = Math.max(0, Math.min(GRID_SIZE - 1, curr.x + dx));
          const ny = Math.max(0, Math.min(GRID_SIZE - 1, curr.y + dy));
          
          if (nx === targetPos.x && ny === targetPos.y) {
              setScore(s => s + (config.scoring?.base_points || 10));
              setTimeLeft(t => t + 5); // Time Bonus
              setTimeout(spawnTarget, 0); 
          }
          return { x: nx, y: ny };
      });
  };

  // Keyboard Controls
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowUp') move(0, -1);
          if (e.key === 'ArrowDown') move(0, 1);
          if (e.key === 'ArrowLeft') move(-1, 0);
          if (e.key === 'ArrowRight') move(1, 0);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, targetPos, gameOver]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4" style={{ backgroundColor: visual.colors.background }}>
        
        {/* Header */}
        <div className="w-full max-w-md flex justify-between items-center mb-6">
            <div className="font-black text-2xl" style={{ color: visual.colors.primary }}>Score: {score}</div>
            <div className={`px-4 py-1 rounded-full font-black text-white ${timeLeft < 10 ? 'bg-red-500 animate-pulse' : 'bg-gray-800'}`}>
                {timeLeft}s
            </div>
        </div>

        {/* Grid Container */}
        <div className="relative bg-white rounded-xl shadow-xl overflow-hidden" style={{ width: 'min(90vw, 400px)', height: 'min(90vw, 400px)' }}>
            {/* Grid Lines */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{ 
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
                }}
            />

            {/* Target */}
            <div 
                className="absolute flex items-center justify-center text-3xl transition-all duration-300"
                style={{
                    width: `${100/GRID_SIZE}%`,
                    height: `${100/GRID_SIZE}%`,
                    left: `${targetPos.x * (100/GRID_SIZE)}%`,
                    top: `${targetPos.y * (100/GRID_SIZE)}%`
                }}
            >
                {targetSprite}
            </div>

            {/* Player */}
            <div 
                className="absolute flex items-center justify-center text-3xl transition-all duration-150"
                style={{
                    width: `${100/GRID_SIZE}%`,
                    height: `${100/GRID_SIZE}%`,
                    left: `${playerPos.x * (100/GRID_SIZE)}%`,
                    top: `${playerPos.y * (100/GRID_SIZE)}%`
                }}
            >
                {playerSprite}
            </div>

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm z-20">
                    <h3 className="text-3xl font-black mb-2 text-yellow-400">Time's Up!</h3>
                    <p className="text-xl font-bold mb-6">Final Score: {score}</p>
                    <div className="flex gap-4">
                        <button onClick={handleExit} className="bg-gray-700 px-4 py-2 rounded-lg font-bold">Collect Rewards</button>
                        <button 
                            onClick={() => {
                                // Claim partial rewards on retry? No, just reset
                                setScore(0);
                                setTimeLeft(config.scoring?.time_limit || 30);
                                setGameOver(false);
                                setPlayerPos({ x: 0, y: 0 });
                                spawnTarget();
                            }}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                        >
                            <RotateCcw size={18} /> Retry
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Mobile Controls */}
        <div className="mt-8 grid grid-cols-3 gap-2">
            <div />
            <button onClick={() => move(0, -1)} className="p-4 bg-gray-200 rounded-xl active:bg-gray-300"><ArrowUp /></button>
            <div />
            <button onClick={() => move(-1, 0)} className="p-4 bg-gray-200 rounded-xl active:bg-gray-300"><ArrowLeft /></button>
            <button onClick={() => move(0, 1)} className="p-4 bg-gray-200 rounded-xl active:bg-gray-300"><ArrowDown /></button>
            <button onClick={() => move(1, 0)} className="p-4 bg-gray-200 rounded-xl active:bg-gray-300"><ArrowRight /></button>
        </div>
    </div>
  );
};

export default DrivingTemplate;
