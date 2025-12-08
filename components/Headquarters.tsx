
import React from 'react';
import { useAppStore, HQ_LEVELS } from '../store';
import { Lock, CheckCircle, ArrowUpCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const THEMES: Record<string, string> = {
  'hq_garage': 'from-gray-700 to-gray-900',
  'hq_office': 'from-blue-500 to-cyan-400',
  'hq_highrise': 'from-indigo-600 to-purple-600',
  'hq_island': 'from-teal-400 to-emerald-600'
};

const Headquarters: React.FC = () => {
  const { user, upgradeHQ } = useAppStore();

  if (!user) return null;

  const currentLevelIndex = HQ_LEVELS.findIndex(h => h.id === user.hqLevel);
  const currentLevel = HQ_LEVELS[currentLevelIndex];
  
  // Dynamic Background based on level
  const bgGradient = THEMES[currentLevel.id] || 'from-gray-200 to-gray-400';

  return (
    <div className="pb-20 space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-gray-800 mb-2">My Headquarters</h2>
        <p className="text-gray-500 font-bold">Upgrade your office to show off your success!</p>
      </div>

      {/* Main Visual */}
      <motion.div 
        layout
        className={`rounded-3xl p-10 shadow-2xl border-4 border-white relative overflow-hidden text-center bg-gradient-to-br ${bgGradient}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
         {/* Particle Effects for Island Level */}
         {currentLevel.id === 'hq_island' && (
             <>
                <motion.div 
                    animate={{ y: [-10, -20, -10], x: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute top-10 left-10 text-white opacity-50"
                >☁️</motion.div>
                <motion.div 
                    animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                    className="absolute top-20 right-20 text-white opacity-50"
                >☁️</motion.div>
             </>
         )}

         <motion.div 
            key={currentLevel.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
            transition={{ 
                scale: { duration: 0.5 },
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }}
            className="text-9xl mb-6 relative z-10 drop-shadow-2xl filter"
         >
            {currentLevel.icon}
         </motion.div>
         
         {/* Shine effect overlay */}
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
         
         <div className="relative z-10">
             <motion.h3 
                key={currentLevel.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-black text-white drop-shadow-md mb-2"
             >
                 {currentLevel.name}
             </motion.h3>
             <p className="text-white/90 font-bold text-lg max-w-md mx-auto">{currentLevel.description}</p>
         </div>
      </motion.div>

      {/* Upgrade Path */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {HQ_LEVELS.map((level, index) => {
             const isUnlocked = index <= currentLevelIndex;
             const isNext = index === currentLevelIndex + 1;
             const canAfford = isNext && user.bizCoins >= level.cost;

             return (
                 <motion.div 
                    key={level.id}
                    whileHover={isNext ? { scale: 1.05 } : {}}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center transition-all relative overflow-hidden
                        ${isUnlocked ? 'bg-green-50 border-green-200 opacity-80' : 'bg-white border-gray-100'}
                        ${isNext ? 'ring-4 ring-yellow-300 border-yellow-500 shadow-xl z-10 opacity-100' : ''}
                    `}
                 >
                     {isNext && (
                         <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-bl-lg">
                             NEXT
                         </div>
                     )}

                     <div className="text-4xl mb-3 filter drop-shadow-sm">{level.icon}</div>
                     <div className="font-bold text-gray-800 mb-1">{level.name}</div>
                     
                     {isUnlocked ? (
                         <div className="mt-auto pt-4 text-green-600 font-bold flex items-center gap-2">
                             <CheckCircle size={18} /> Owned
                         </div>
                     ) : isNext ? (
                         <button 
                            onClick={() => upgradeHQ(level.id)}
                            disabled={!canAfford}
                            className={`mt-auto w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                ${canAfford 
                                    ? 'bg-kid-primary text-yellow-900 hover:bg-yellow-400 btn-juicy shadow-md' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                            `}
                         >
                            {canAfford ? <ArrowUpCircle size={18} /> : <Lock size={18} />}
                            ${level.cost.toLocaleString()}
                         </button>
                     ) : (
                         <div className="mt-auto pt-4 text-gray-400 font-bold flex items-center gap-2">
                             <Lock size={18} /> Locked
                         </div>
                     )}
                 </motion.div>
             );
          })}
      </div>
    </div>
  );
};

export default Headquarters;
