
import React from 'react';
import { useAppStore, MOCK_LEADERBOARD } from '../store';
import { Trophy, Medal, Crown, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard: React.FC = () => {
  const { user } = useAppStore();
  
  // Sort leaderboard desc
  const sorted = [...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-gray-800 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500 fill-current" size={40} />
            Top Entrepreneurs
        </h2>
        <p className="text-gray-500 font-bold mt-2 bg-gray-100 inline-block px-4 py-1 rounded-full text-sm">Weekly Reset: 3 Days</p>
      </div>

      <div className="space-y-4">
        {sorted.map((entry, index) => {
           const rank = index + 1;
           const isTop3 = rank <= 3;
           
           return (
             <motion.div 
               key={entry.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.1 }}
               className={`flex items-center p-4 rounded-3xl border-4 shadow-sm relative transition-transform hover:scale-[1.02]
                  ${entry.isCurrentUser 
                        ? 'bg-blue-50 border-blue-300 z-10' 
                        : isTop3 
                            ? 'bg-white border-yellow-200' 
                            : 'bg-white border-gray-100'}
               `}
             >
                <div className={`w-12 font-black text-2xl text-center mr-2 italic ${isTop3 ? 'text-yellow-500' : 'text-gray-300'}`}>
                   #{rank}
                </div>
                
                <div className={`w-14 h-14 rounded-full border-4 shadow-sm flex items-center justify-center text-3xl relative
                    ${isTop3 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100 bg-gray-50'}
                `}>
                    {entry.avatar}
                    {rank === 1 && <div className="absolute -top-4 -right-2 text-2xl drop-shadow-md"><Crown className="fill-yellow-400 text-yellow-600" size={32}/></div>}
                </div>

                <div className="flex-1 ml-4">
                   <h3 className={`font-black text-lg ${entry.isCurrentUser ? 'text-blue-700' : 'text-gray-700'}`}>
                      {entry.name} {entry.isCurrentUser && <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full ml-2 align-middle">YOU</span>}
                   </h3>
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level {Math.floor(entry.xp / 100) + 1} CEO</div>
                </div>

                <div className="text-right bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                   <div className="font-black text-gray-800 text-xl">{entry.xp} XP</div>
                </div>
             </motion.div>
           );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
