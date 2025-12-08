
import React, { useState, useEffect } from 'react';
import { BusinessSimulation } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

const SortingTemplate: React.FC<Props> = ({ config, onExit }) => {
  const [score, setScore] = useState(0);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Simple game loop
  useEffect(() => {
      spawnItem();
  }, []);

  const spawnItem = () => {
      if (!config.entities) return;
      const items = config.entities.filter(e => e.type === 'item');
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setCurrentItem({ ...randomItem, key: Math.random() });
  };

  const handleSort = (direction: 'left' | 'right' | 'down') => {
      // Simplification: In a real implementation, we map entities to bins via config
      // For this demo: Index 0 = Left, Index 1 = Down, Index 2 = Right
      
      const items = config.entities?.filter(e => e.type === 'item') || [];
      const targetIndex = items.findIndex(i => i.id === currentItem.id);
      
      let correct = false;
      if (direction === 'left' && targetIndex === 0) correct = true;
      if (direction === 'down' && targetIndex === 1) correct = true;
      if (direction === 'right' && targetIndex === 2) correct = true;

      if (correct) {
          setScore(s => s + 10);
      } else {
          setScore(s => Math.max(0, s - 5));
      }
      spawnItem();
  };

  const visual = config.visual_config || { colors: { primary: '#22C55E', background: '#F0FDF4' } };
  const items = config.entities?.filter(e => e.type === 'item') || [];

  return (
    <div className="h-full flex flex-col items-center justify-center relative" style={{ backgroundColor: visual.colors.background }}>
        <div className="absolute top-4 left-4 font-black text-2xl" style={{ color: visual.colors.primary }}>Score: {score}</div>
        
        <div className="flex-1 flex items-center justify-center w-full max-w-lg relative">
            <AnimatePresence mode='wait'>
                {currentItem && (
                    <motion.div 
                        key={currentItem.key}
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="text-9xl cursor-grab active:cursor-grabbing"
                    >
                        {currentItem.emoji}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Bins */}
        <div className="w-full max-w-2xl grid grid-cols-3 gap-4 p-8">
            <button onClick={() => handleSort('left')} className="h-32 rounded-3xl bg-blue-100 border-4 border-blue-300 flex flex-col items-center justify-center hover:bg-blue-200 transition-colors">
                <span className="text-4xl mb-2">{items[0]?.emoji}</span>
                <span className="font-bold text-blue-800">{items[0]?.name}</span>
            </button>
            <button onClick={() => handleSort('down')} className="h-32 rounded-3xl bg-yellow-100 border-4 border-yellow-300 flex flex-col items-center justify-center hover:bg-yellow-200 transition-colors">
                <span className="text-4xl mb-2">{items[1]?.emoji}</span>
                <span className="font-bold text-yellow-800">{items[1]?.name}</span>
            </button>
            <button onClick={() => handleSort('right')} className="h-32 rounded-3xl bg-green-100 border-4 border-green-300 flex flex-col items-center justify-center hover:bg-green-200 transition-colors">
                <span className="text-4xl mb-2">{items[2]?.emoji}</span>
                <span className="font-bold text-green-800">{items[2]?.name}</span>
            </button>
        </div>
    </div>
  );
};

export default SortingTemplate;
