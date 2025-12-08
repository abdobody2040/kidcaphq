import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useAppStore } from '../store';
import { RotateCcw } from 'lucide-react';

interface PizzaDeliveryProps {
  onBack: () => void;
}

const GRID_SIZE = 10;
const CELL_SIZE = 50;

class MainScene extends Phaser.Scene {
  // Fix: Explicitly declare properties that TypeScript is failing to infer from Phaser.Scene
  declare add: Phaser.GameObjects.GameObjectFactory;
  declare input: Phaser.Input.InputPlugin;
  declare time: Phaser.Time.Clock;
  declare registry: Phaser.Data.DataManager;
  declare scene: Phaser.Scenes.ScenePlugin;

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

  constructor() {
    super('MainScene');
  }

  preload() {
    // No assets to preload
  }

  create() {
    // Reset internal state
    this.scoreValue = 0;
    this.timeValue = 30;

    // Draw Grid
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xe5e7eb, 1);
    
    for (let i = 0; i <= GRID_SIZE; i++) {
      graphics.moveTo(i * CELL_SIZE, 0);
      graphics.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      graphics.moveTo(0, i * CELL_SIZE);
      graphics.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
    }
    graphics.strokePath();

    // Player (Scooter) - Blue Square
    this.playerPos = { x: 0, y: 0 };
    this.player = this.add.rectangle(
      CELL_SIZE / 2, 
      CELL_SIZE / 2, 
      CELL_SIZE - 10, 
      CELL_SIZE - 10, 
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
        x * CELL_SIZE + CELL_SIZE / 2,
        y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE - 10,
        CELL_SIZE - 10,
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
        this.player.x = this.playerPos.x * CELL_SIZE + CELL_SIZE / 2;
        this.player.y = this.playerPos.y * CELL_SIZE + CELL_SIZE / 2;
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
  const { completeGame } = useAppStore();
  
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 500,
      height: 500,
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

    return () => {
        game.destroy(true);
        gameInstanceRef.current = null;
    };
  }, [completeGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-xl">
        
        {/* Header */}
        <div className="w-full max-w-[500px] flex items-center justify-between mb-6">
            <button onClick={onBack} className="text-gray-400 font-bold hover:text-gray-600">
                &larr; Exit
            </button>
            <h2 className="text-2xl font-black text-gray-800">Pizza Rush 🍕</h2>
            <div className={`px-4 py-1 rounded-full font-black ${timeLeft < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {timeLeft}s
            </div>
        </div>

        {/* Game Container */}
        <div className="relative">
            <div ref={gameRef} className="rounded-xl overflow-hidden border-4 border-gray-800 shadow-2xl" />
            
            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
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
                                 // Ideally we would restart scene but state management across boundary is tricky
                                 setGameOver(false);
                                 setScore(0);
                                 setTimeLeft(30);
                                 gameInstanceRef.current?.scene.start('MainScene');
                             }} 
                             className="bg-kid-primary text-black px-6 py-3 rounded-xl font-black hover:bg-yellow-400 flex items-center gap-2"
                        >
                            <RotateCcw size={20} /> Play Again
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-500 font-bold text-sm max-w-md">
            Use <span className="bg-white border px-1 rounded">Arrow Keys</span> to drive your scooter to the <span className="text-red-500">Red Houses</span> before time runs out!
        </div>
    </div>
  );
};

export default PizzaDelivery;