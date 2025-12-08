

import React, { useState, useEffect, useRef } from 'react';
import { BusinessSimulation, VisualConfig } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap } from 'lucide-react';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

const RhythmTemplate: React.FC<Props> = ({ config, onExit }) => {
  const visual: VisualConfig = config.visual_config || { colors: { primary: '#3B82F6', background: '#EFF6FF' } as any } as any;
  
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lanes, setLanes] = useState<any[][]>([[], [], []]); // 3 Lanes
  const [feedback, setFeedback] = useState<string | null>(null);

  const gameLoopRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);

  // Constants
  const SPAWN_RATE = config.game_mechanics?.spawn_rate || 1500;
  const SPEED = 2; // px per frame
  const HIT_ZONE_Y = 400;
  const HIT_WINDOW = 50;

  useEffect(() => {
      const loop = (time: number) => {
          // Spawn Logic
          if (time - lastSpawnRef.current > SPAWN_RATE) {
              const laneIdx = Math.floor(Math.random() * 3);
              const entity = config.entities?.[0] || { emoji: '🎵' }; // Default
              setLanes(prev => {
                  const newLanes = [...prev];
                  newLanes[laneIdx].push({ ...entity, id: Math.random(), y: -50 });
                  return newLanes;
              });
              lastSpawnRef.current = time;
          }

          // Move Logic
          setLanes(prev => prev.map(lane => 
              lane.map(item => ({ ...item, y: item.y + SPEED }))
                  .filter(item => item.y < 600) // Remove off-screen
          ));

          gameLoopRef.current = requestAnimationFrame(loop);
      };
      gameLoopRef.current = requestAnimationFrame(loop);

      return () => {
          if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      };
  }, [SPAWN_RATE, config.entities]);

  const handleHit = (laneIdx: number) => {
      const lane = lanes[laneIdx];
      // Find item in hit zone
      const hitItemIndex = lane.findIndex(item => Math.abs(item.y - HIT_ZONE_Y) < HIT_WINDOW);

      if (hitItemIndex !== -1) {
          // HIT!
          const item = lane[hitItemIndex];
          const accuracy = Math.abs(item.y - HIT_ZONE_Y);
          let points = 10;
          let txt = "Good";
          
          if (accuracy < 10) { points = 50; txt = "PERFECT!"; }
          else if (accuracy < 30) { points = 25; txt = "Great!"; }

          setScore(s => s + points * (1 + Math.floor(combo/5) * 0.1));
          setCombo(c => c + 1);
          setFeedback(txt);
          setTimeout(() => setFeedback(null), 500);

          // Remove item
          setLanes(prev => {
              const newLanes = [...prev];
              newLanes[laneIdx].splice(hitItemIndex, 1);
              return newLanes;
          });
      } else {
          // MISS
          setCombo(0);
          setFeedback("MISS");
          setTimeout(() => setFeedback(null), 500);
      }
  };

  return (
    <div className="h-full flex flex-col items-center relative overflow-hidden" style={{ backgroundColor: visual.colors.background }}>
        
        {/* HUD */}
        <div className="absolute top-4 left-4 z-20">
            <div className="font-black text-4xl text-gray-800">{Math.floor(score)}</div>
            <div className="text-sm font-bold text-gray-400">Combo x{combo}</div>
        </div>
        <button onClick={onExit} className="absolute top-4 right-4 z-20 bg-white/50 px-4 py-2 rounded-lg font-bold">Exit</button>

        {/* Game Area */}
        <div className="relative w-full max-w-md h-full bg-white/50 border-x-4 border-gray-200 grid grid-cols-3">
            {/* Target Line */}
            <div 
                className="absolute w-full h-2 bg-gray-300 z-0" 
                style={{ top: HIT_ZONE_Y }}
            />
            <div 
                className="absolute w-full h-16 bg-blue-500/10 z-0 border-y-2 border-blue-500/30" 
                style={{ top: HIT_ZONE_Y - HIT_WINDOW / 2 }}
            />

            {/* Lanes */}
            {[0, 1, 2].map(laneIdx => (
                <div key={laneIdx} className="relative h-full border-r border-gray-100 last:border-r-0 flex justify-center">
                    {/* Items */}
                    {lanes[laneIdx].map((item: any) => (
                        <div 
                            key={item.id}
                            className="absolute text-4xl drop-shadow-md"
                            style={{ top: item.y }}
                        >
                            {item.emoji}
                        </div>
                    ))}

                    {/* Button */}
                    <button 
                        className="absolute bottom-10 w-20 h-20 rounded-full border-4 border-gray-300 active:bg-blue-200 active:border-blue-500 active:scale-95 transition-all flex items-center justify-center bg-white shadow-lg z-10"
                        onClick={() => handleHit(laneIdx)}
                    >
                        <Target className="text-gray-400" />
                    </button>
                </div>
            ))}
        </div>

        {/* Feedback Text */}
        <AnimatePresence>
            {feedback && (
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0, y: HIT_ZONE_Y }}
                    animate={{ scale: 1.5, opacity: 1, y: HIT_ZONE_Y - 50 }}
                    exit={{ opacity: 0 }}
                    className={`absolute z-30 font-black text-4xl uppercase tracking-widest drop-shadow-lg
                        ${feedback === 'MISS' ? 'text-red-500' : 'text-yellow-500'}
                    `}
                    style={{ top: 0 }} // Positioned via motion
                >
                    {feedback}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default RhythmTemplate;