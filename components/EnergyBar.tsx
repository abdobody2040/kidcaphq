
import React from 'react';
import { useEnergy } from '../hooks/useEnergy';
import { Zap, Infinity as InfinityIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const EnergyBar: React.FC = () => {
  const { energy, maxEnergy, isUnlimited, timeToNextRefill } = useEnergy();

  if (isUnlimited) {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full shadow-md border-2 border-yellow-200">
        <div className="animate-pulse">
            <InfinityIcon size={20} strokeWidth={3} />
        </div>
        <span className="text-xs font-black uppercase tracking-wider">Energy</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <div className="flex gap-1 bg-gray-900/50 backdrop-blur-sm p-1.5 rounded-xl border border-gray-700 shadow-inner">
        {[...Array(maxEnergy)].map((_, i) => {
          const isFilled = i < energy;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={isFilled ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.4 }}
              className={`w-5 h-8 flex items-center justify-center`}
            >
              <Zap 
                size={20} 
                fill={isFilled ? "#FFC800" : "none"} 
                className={isFilled ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(255,200,0,0.8)]" : "text-gray-500"} 
                strokeWidth={isFilled ? 0 : 2}
              />
            </motion.div>
          );
        })}
      </div>
      {energy < maxEnergy && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 mt-1 bg-black/40 px-2 py-0.5 rounded-lg">
            <Clock size={10} /> +1 in {timeToNextRefill}
        </div>
      )}
    </div>
  );
};

export default EnergyBar;
