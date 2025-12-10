
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { BusinessSimulation, VisualConfig } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

const MatchingTemplate: React.FC<Props> = ({ config, onExit }) => {
  const { completeGame } = useAppStore();
  const visual: VisualConfig = config.visual_config || { colors: { primary: '#EC4899', background: '#FDF2F8' } as any } as any;
  const ingredients = config.entities?.filter(e => e.type === 'resource') || [];
  
  const [targetRecipe, setTargetRecipe] = useState<string[]>([]);
  const [currentBuild, setCurrentBuild] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

  useEffect(() => {
      generateOrder();
  }, []);

  const handleExit = () => {
      completeGame(score, Math.floor(score * 0.5));
      onExit();
  };

  const generateOrder = () => {
      // Pick 3 random ingredients
      const recipe = [];
      for(let i=0; i<3; i++) {
          const rand = ingredients[Math.floor(Math.random() * ingredients.length)];
          if (rand) recipe.push(rand.id);
      }
      setTargetRecipe(recipe);
      setCurrentBuild([]);
      setFeedback(null);
  };

  const handleSelect = (id: string) => {
      if (feedback) return;
      
      const newBuild = [...currentBuild, id];
      setCurrentBuild(newBuild);

      // Check if full
      if (newBuild.length === targetRecipe.length) {
          // Validate
          const isCorrect = newBuild.every((val, index) => val === targetRecipe[index]);
          if (isCorrect) {
              setScore(s => s + (config.scoring?.base_points || 10));
              setFeedback('CORRECT');
              setTimeout(generateOrder, 1000);
          } else {
              setFeedback('WRONG');
              setTimeout(() => {
                  setCurrentBuild([]);
                  setFeedback(null);
              }, 1000);
          }
      }
  };

  return (
    <div className="h-full flex flex-col items-center p-6" style={{ backgroundColor: visual.colors.background }}>
        
        <div className="w-full max-w-md flex justify-between items-center mb-8">
            <div className="font-black text-2xl" style={{ color: visual.colors.primary }}>Orders: {Math.floor(score/10)}</div>
            <button onClick={handleExit} className="text-gray-400 font-bold hover:text-gray-600">Save & Exit</button>
        </div>

        {/* Customer Order (Target) */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-gray-100 mb-12 w-full max-w-md text-center relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Current Order
            </div>
            <div className="flex justify-center gap-4 text-5xl min-h-[60px]">
                {targetRecipe.map((id, idx) => {
                    const item = ingredients.find(i => i.id === id);
                    return <div key={idx}>{item?.emoji}</div>;
                })}
            </div>
        </div>

        {/* Work Area (Current Build) */}
        <div className="flex-1 w-full max-w-md flex flex-col items-center">
            <div className="flex justify-center gap-4 text-6xl mb-8 min-h-[80px] p-4 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300 w-full">
                <AnimatePresence>
                    {currentBuild.map((id, idx) => {
                        const item = ingredients.find(i => i.id === id);
                        return (
                            <motion.div 
                                key={`${id}-${idx}`}
                                initial={{ scale: 0, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                            >
                                {item?.emoji}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
                {feedback && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-full shadow-2xl z-50
                            ${feedback === 'CORRECT' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                        `}
                    >
                        {feedback === 'CORRECT' ? <Check size={64} strokeWidth={4} /> : <X size={64} strokeWidth={4} />}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ingredient Palette */}
            <div className="grid grid-cols-3 gap-4 w-full">
                {ingredients.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className="bg-white p-4 rounded-2xl shadow-sm border-b-4 border-gray-200 hover:border-gray-300 active:border-t-4 active:border-b-0 transition-all flex flex-col items-center gap-2"
                    >
                        <span className="text-4xl">{item.emoji}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase">{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default MatchingTemplate;
