
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useAppStore } from '../store';
import { RotateCcw } from 'lucide-react';
import GameTutorialModal from './common/GameTutorialModal';
import { useEnergy } from '../hooks/useEnergy';
import InvestorPitchModal from './InvestorPitchModal';

interface PizzaDeliveryProps {
  onBack: () => void;
}

const GRID_SIZE = 10;

class MainScene extends Phaser.Scene {
  declare add: Phaser.GameObjects.GameObjectFactory;
  declare input: Phaser.Input.InputPlugin;
  declare time: Phaser.Time.Clock;
  declare registry: Phaser.Data.DataManager;
  declare scene: Phaser.Scenes.ScenePlugin;
  declare sys: Phaser.Scenes.Systems;

  private player!: Phaser.GameObjects.Rectangle;
  private house!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerPos = { x: 0, y: 0 };
  private housePos = { x: 0, y: 0 };
  private moveTimer = 0;
  private gameTimerEvent!: Phaser.Time.TimerEvent;
  
  // Game State
  private scoreValue = 0;
  private timeValue = 30;
  private cellSize = 50; // Default, updated in create

  constructor() {
    super('MainScene');
  }

  preload() {
    // No assets to preload
  }

  create() {
    // Determine cell size based on actual canvas width
    const { width } = this.sys.game.canvas;
    this.cellSize = width / GRID_SIZE;

    // Reset internal state
    this.scoreValue = 0;
    this.timeValue = 30;

    // Draw Grid
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xe5e7eb, 1);
    
    for (let i = 0; i <= GRID_SIZE; i++) {
      graphics.moveTo(i * this.cellSize, 0);
      graphics.lineTo(i * this.cellSize, GRID_SIZE * this.cellSize);
      graphics.moveTo(0, i * this.cellSize);
      graphics.lineTo(GRID_SIZE * this.cellSize, i * this.cellSize);
    }
    graphics.strokePath();

    // Player (Scooter) - Blue Square
    this.playerPos = { x: 0, y: 0 };
    this.player = this.add.rectangle(
      this.cellSize / 2, 
      this.cellSize / 2, 
      this.cellSize - 10, 
      this.cellSize - 10, 
      0x2563eb
    );

    // House (Destination) - Red Square
    this.spawnHouse();

    // Input
    if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Timer
    this.gameTimerEvent = this.time.addEvent({
        delay: 1000,
        callback: this.onSecond,
        callbackScope: this,
        loop: true
    });
  }

  spawnHouse() {
    // Random pos different from player
    let x, y;
    do {
        x = Phaser.Math.Between(0, GRID_SIZE - 1);
        y = Phaser.Math.Between(0, GRID_SIZE - 1);
    } while (x === this.playerPos.x && y === this.playerPos.y);

    this.housePos = { x, y };
    
    if (this.house) this.house.destroy();
    this.house = this.add.rectangle(
        x * this.cellSize + this.cellSize / 2,
        y * this.cellSize + this.cellSize / 2,
        this.cellSize - 10,
        this.cellSize - 10,
        0xef4444
    );
  }

  onSecond() {
    if (this.timeValue > 0) {
        this.timeValue -= 1;
        
        // Notify React
        const onTimeUpdate = this.registry.get('onTimeUpdate');
        if (onTimeUpdate) onTimeUpdate(this.timeValue);
    } else {
        this.gameTimerEvent.remove();
        this.scene.pause();
        
        // Notify React
        const onGameOver = this.registry.get('onGameOver');
        if (onGameOver) onGameOver(this.scoreValue);
    }
  }

  update(time: number, delta: number) {
    if (this.timeValue <= 0) return;

    this.moveTimer -= delta;
    if (this.moveTimer > 0) return;

    let moved = false;
    
    // Simple discrete movement
    if (this.cursors.left.isDown && this.playerPos.x > 0) {
        this.playerPos.x--;
        moved = true;
    } else if (this.cursors.right.isDown && this.playerPos.x < GRID_SIZE - 1) {
        this.playerPos.x++;
        moved = true;
    } else if (this.cursors.up.isDown && this.playerPos.y > 0) {
        this.playerPos.y--;
        moved = true;
    } else if (this.cursors.down.isDown && this.playerPos.y < GRID_SIZE - 1) {
        this.playerPos.y++;
        moved = true;
    }

    if (moved) {
        this.player.x = this.playerPos.x * this.cellSize + this.cellSize / 2;
        this.player.y = this.playerPos.y * this.cellSize + this.cellSize / 2;
        this.moveTimer = 150; // Delay between moves (ms)

        // Check Collision
        if (this.playerPos.x === this.housePos.x && this.playerPos.y === this.housePos.y) {
            // Delivered!
            this.scoreValue += 10;
            this.timeValue += 5; // Bonus time
            
            // Notify React
            const onScoreUpdate = this.registry.get('onScoreUpdate');
            const onTimeUpdate = this.registry.get('onTimeUpdate');
            if (onScoreUpdate) onScoreUpdate(this.scoreValue);
            if (onTimeUpdate) onTimeUpdate(this.timeValue);
            
            this.spawnHouse();
        }
    }
  }
}

const PizzaDelivery: React.FC<PizzaDeliveryProps> = ({ onBack }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const { completeGame } = useAppStore();
  const { consumeEnergy } = useEnergy();
  
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  const startGame = () => {
    // Energy Check
    if (!consumeEnergy()) {
        setShowPaywall(true);
        return;
    }

    setShowTutorial(false);
    if (!gameRef.current) return;

    // Responsive Size Calculation
    const gameSize = Math.min(window.innerWidth - 48, 500); // 48px cushion for padding

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: gameSize,
      height: gameSize,
      parent: gameRef.current,
      backgroundColor: '#ffffff',
      scene: MainScene,
      physics: {
          default: 'arcade',
          arcade: { debug: false }
      }
    };

    const game = new Phaser.Game(config);
    gameInstanceRef.current = game;

    // Bridge React state setters to Phaser via Registry
    game.registry.set('onScoreUpdate', setScore);
    game.registry.set('onTimeUpdate', setTimeLeft);
    game.registry.set('onGameOver', (finalScore: number) => {
        setGameOver(true);
        completeGame(finalScore, finalScore * 2); // XP reward
    });
  };

  // Clean up
  useEffect(() => {
    return () => {
        if (gameInstanceRef.current) {
            gameInstanceRef.current.destroy(true);
            gameInstanceRef.current = null;
        }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl p-4 md:p-8 border border-gray-200 shadow-xl relative h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] overflow-hidden">
        <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
        
        {showTutorial && (
            <GameTutorialModal 
                onStart={startGame}
                title="Pizza Rush"
                description="Deliver hot pizzas to hungry customers before they get cold!"
                icon="🍕"
                color="bg-red-500"
                instructions={[
                    "You are the Blue Scooter.",
                    "Use Arrow Keys to move.",
                    "Drive to the Red House to deliver.",
                    "Each delivery gives +5 seconds.",
                    "Don't run out of time!"
                ]}
            />
        )}

        {/* Header */}
        <div className="w-full max-w-[500px] flex items-center justify-between mb-4 shrink-0">
            <button onClick={onBack} className="text-gray-400 font-bold hover:text-gray-600">
                &larr; Exit
            </button>
            <h2 className="text-xl md:text-2xl font-black text-gray-800">Pizza Rush 🍕</h2>
            <div className={`px-3 py-1 rounded-full font-black ${timeLeft < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {timeLeft}s
            </div>
        </div>

        {/* Game Container */}
        <div className="relative flex-1 flex items-center justify-center w-full">
            <div ref={gameRef} className="rounded-xl overflow-hidden border-4 border-gray-800 shadow-2xl bg-gray-200" />
            
            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm z-20 rounded-xl">
                    <h3 className="text-4xl font-black text-yellow-400 mb-2">Time's Up!</h3>
                    <p className="text-xl font-bold mb-8">Pizzas Delivered: {score / 10}</p>
                    <div className="flex gap-4">
                        <button 
                            onClick={onBack}
                            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold"
                        >
                            Exit
                        </button>
                        <button 
                             onClick={() => {
                                 // Force reload to restart cleanly (simplest way for Phaser/React)
                                 setGameOver(false);
                                 setScore(0);
                                 setTimeLeft(30);
                                 if (gameInstanceRef.current) {
                                     gameInstanceRef.current.destroy(true);
                                 }
                                 startGame();
                             }} 
                             className="bg-kid-primary text-black px-6 py-3 rounded-xl font-black hover:bg-yellow-400 flex items-center gap-2"
                        >
                            <RotateCcw size={20} /> Play Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default PizzaDelivery;
