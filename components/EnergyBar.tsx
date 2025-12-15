
import React from 'react';
import { useEnergy } from '../hooks/useEnergy';
import { Heart, Infinity as InfinityIcon, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EnergyBar: React.FC = () => {
  const { energy, maxEnergy, isUnlimited, timeToNextRefill } = useEnergy();

  if (isUnlimited) {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full shadow-lg border border-purple-400/50 backdrop-blur-md">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
            <InfinityIcon size={18} strokeWidth={3} />
        </motion.div>
        <span className="text-xs font-black uppercase tracking-wider">Unlimited</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end pointer-events-none select-none">
      <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-xl relative z-10 transition-colors duration-200">
        <div className="mr-1">
            <Zap size={14} className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
        </div>
        {[...Array(maxEnergy)].map((_, i) => {
          const isFilled = i < energy;
          const isNext = i === energy; // The heart currently refilling
          
          return (
            <motion.div
              key={i}
              initial={false}
              animate={isFilled ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0.4 }}
              className="relative"
            >
              <Heart 
                size={20} 
                fill={isFilled ? "#EF4444" : "none"} 
                className={`${isFilled ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "text-slate-300 dark:text-slate-600"}`} 
                strokeWidth={isFilled ? 0 : 2.5}
              />
              {/* Pulse animation for the next recharging heart */}
              {!isFilled && isNext && (
                  <motion.div 
                    className="absolute inset-0 bg-red-500 rounded-full blur-sm"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Timer Tooltip */}
      <AnimatePresence>
        {energy < maxEnergy && (
            <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-md mt-1 backdrop-blur-sm border border-white/10"
            >
                <Clock size={10} /> +1 in {timeToNextRefill}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnergyBar;
