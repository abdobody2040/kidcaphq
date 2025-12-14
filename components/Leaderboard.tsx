
import React from 'react';
import { useAppStore, MOCK_LEADERBOARD } from '../store';
import { Trophy, Medal, Crown, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Leaderboard: React.FC = () => {
  const { user } = useAppStore();
  const { t } = useTranslation();
  
  // Sort leaderboard desc
  const sorted = [...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-gray-800 dark:text-white flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500 fill-current" size={40} />
            {t('leaderboard.title')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 bg-gray-100 dark:bg-gray-800 inline-block px-4 py-1 rounded-full text-sm">{t('leaderboard.weekly_reset')}</p>
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
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 z-10' 
                        : isTop3 
                            ? 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-700' 
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}
               `}
             >
                <div className={`w-12 font-black text-2xl text-center mr-2 rtl:mr-0 rtl:ml-2 italic ${isTop3 ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}>
                   #{rank}
                </div>
                
                <div className={`w-14 h-14 rounded-full border-4 shadow-sm flex items-center justify-center text-3xl relative
                    ${isTop3 ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800' : 'border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}
                `}>
                    {entry.avatar}
                    {rank === 1 && <div className="absolute -top-4 -right-2 rtl:-left-2 rtl:right-auto text-2xl drop-shadow-md"><Crown className="fill-yellow-400 text-yellow-600" size={32}/></div>}
                </div>

                <div className="flex-1 ml-4 rtl:ml-0 rtl:mr-4">
                   <h3 className={`font-black text-lg ${entry.isCurrentUser ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
                      {entry.name} {entry.isCurrentUser && <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full ml-2 rtl:ml-0 rtl:mr-2 align-middle">{t('leaderboard.you')}</span>}
                   </h3>
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('stats.level')} {Math.floor(entry.xp / 100) + 1} CEO</div>
                </div>

                <div className="text-right rtl:text-left bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-600">
                   <div className="font-black text-gray-800 dark:text-white text-xl">{entry.xp} XP</div>
                </div>
             </motion.div>
           );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
