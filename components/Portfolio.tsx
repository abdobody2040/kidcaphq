
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Briefcase, Clock, DollarSign, UserCheck, TrendingUp, Lock, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Portfolio: React.FC = () => {
  const { user, hireManager, collectIdleIncome, collectAllIdleIncome, games } = useAppStore();
  const [now, setNow] = useState(new Date());

  // Update timer every second for real-time pending income
  useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const calculatePending = (lastCollectedStr: string, level: number) => {
      const last = new Date(lastCollectedStr);
      const diffMs = now.getTime() - last.getTime();
      const diffMinutes = Math.min(1440, diffMs / (1000 * 60));
      const hourlyRate = 10 * level;
      // Per minute earning: Rate / 60
      return Math.floor((hourlyRate / 60) * diffMinutes);
  };

  const getProgress = (lastCollectedStr: string, level: number) => {
      const last = new Date(lastCollectedStr);
      const diffMs = now.getTime() - last.getTime();
      
      const hourlyRate = 10 * level;
      const msForOneCoin = (3600000 / hourlyRate); // Time to earn 1 coin
      
      const progress = (diffMs % msForOneCoin) / msForOneCoin;
      return Math.min(100, progress * 100);
  };

  // Calculate Total Pending across all owned businesses
  const totalPending = user.portfolio.reduce((sum, item) => {
      return sum + calculatePending(item.lastCollected, item.managerLevel);
  }, 0);

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-gray-800 mb-2">My Portfolio</h2>
        <p className="text-gray-500 font-bold">Earn money even while you sleep!</p>
      </div>

      {/* GLOBAL COLLECT BUTTON */}
      <AnimatePresence>
          {totalPending >= 1 && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-10 flex justify-center"
              >
                  <button 
                    onClick={collectAllIdleIncome}
                    className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-[0_6px_0_0_rgba(21,128,61,1)] btn-juicy flex items-center gap-3 animate-pulse"
                  >
                      <Wallet size={32} />
                      Collect All: ${totalPending}
                  </button>
              </motion.div>
          )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(biz => {
              const portfolioItem = user.portfolio.find(p => p.businessId === biz.business_id);
              const isOwned = !!portfolioItem;
              
              const pending = isOwned ? calculatePending(portfolioItem.lastCollected, portfolioItem.managerLevel) : 0;
              const progress = isOwned ? getProgress(portfolioItem.lastCollected, portfolioItem.managerLevel) : 0;

              return (
                  <motion.div 
                    key={biz.business_id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-3xl p-6 border-4 shadow-sm flex flex-col relative overflow-hidden transition-all
                        ${isOwned ? 'border-blue-100 hover:border-blue-300' : 'border-gray-100 opacity-80'}
                    `}
                  >
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
                                  ${isOwned ? 'bg-blue-100' : 'bg-gray-100 grayscale'}
                              `}>
                                  💼
                              </div>
                              <div>
                                  <h3 className="font-black text-lg text-gray-800 leading-tight">{biz.name}</h3>
                                  <span className="text-xs font-bold text-gray-400 uppercase">{biz.category.split(' ')[0]}</span>
                              </div>
                          </div>
                          {isOwned ? (
                              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1">
                                  <TrendingUp size={12} /> Active
                              </div>
                          ) : (
                              <Lock size={20} className="text-gray-300" />
                          )}
                      </div>

                      <div className="flex-1 mb-6">
                          {isOwned ? (
                              <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                                  <div className="flex justify-between text-sm">
                                      <span className="text-gray-500 font-bold">Manager Lvl</span>
                                      <span className="text-gray-800 font-black">{portfolioItem.managerLevel}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                      <span className="text-gray-500 font-bold">Rate</span>
                                      <span className="text-green-600 font-black">${10 * portfolioItem.managerLevel}/hr</span>
                                  </div>
                                  
                                  {/* Progress Bar for next coin */}
                                  <div className="space-y-1">
                                      <div className="flex justify-between text-xs font-bold text-gray-400">
                                          <span>Earning...</span>
                                          <span>{Math.round(progress)}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-yellow-400 transition-all duration-1000 ease-linear"
                                            style={{ width: `${progress}%` }} 
                                          />
                                      </div>
                                  </div>
                              </div>
                          ) : (
                              <div className="h-full flex items-center justify-center text-center p-4">
                                  <p className="text-gray-400 text-sm font-bold">
                                      Hire a manager to automate this business and earn passive income.
                                  </p>
                              </div>
                          )}
                      </div>

                      {isOwned ? (
                          <button 
                             onClick={() => collectIdleIncome(biz.business_id)}
                             disabled={pending < 1}
                             className={`w-full py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all
                                ${pending >= 1 
                                    ? 'bg-green-500 text-white shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy hover:bg-green-600' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                             `}
                          >
                             {pending >= 1 ? (
                                 <><DollarSign size={20} /> Collect ${pending}</>
                             ) : (
                                 <><Clock size={18} /> Generating...</>
                             )}
                          </button>
                      ) : (
                          <button 
                             onClick={() => hireManager(biz.business_id)}
                             disabled={user.bizCoins < 500}
                             className={`w-full py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all
                                ${user.bizCoins >= 500 
                                    ? 'bg-kid-primary text-yellow-900 shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy hover:bg-yellow-400' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                             `}
                          >
                             <UserCheck size={20} /> Hire ($500)
                          </button>
                      )}
                  </motion.div>
              );
          })}
      </div>
    </div>
  );
};

export default Portfolio;
