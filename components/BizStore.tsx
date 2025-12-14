
import React, { useState } from 'react';
import { useAppStore, SHOP_ITEMS } from '../store';
import { ShoppingBag, Coins, Check, Zap, Shirt } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BizStore: React.FC = () => {
  const { user, buyItem } = useAppStore();
  const [filter, setFilter] = useState<'AVATAR' | 'CONSUMABLE' | 'POWERUP'>('AVATAR');
  const { t } = useTranslation();

  if (!user) return null;

  const filteredItems = SHOP_ITEMS.filter(item => {
      if (filter === 'AVATAR') return item.type === 'AVATAR';
      return item.type === 'CONSUMABLE' || item.type === 'POWERUP';
  });

  // Safety check: ensure bizCoins is treated as a number
  const safeCoins = typeof user.bizCoins === 'number' ? user.bizCoins : 0;

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
           <div>
              <h2 className="text-3xl font-black mb-1">{t('store.title')}</h2>
              <p className="font-bold opacity-90">{t('store.subtitle')}</p>
           </div>
           <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/30">
              <Coins size={32} className="text-yellow-300" />
              <span className="text-3xl font-black">{safeCoins}</span>
           </div>
        </div>
        <div className="absolute right-0 bottom-0 text-9xl opacity-10 rotate-12 -mr-10 -mb-10">🛍️</div>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-1">
          <button 
             onClick={() => setFilter('AVATAR')}
             className={`px-6 py-2 rounded-full font-bold transition-all border-2 whitespace-nowrap
                ${filter === 'AVATAR' ? 'bg-kid-primary text-yellow-900 border-yellow-500' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700'}
             `}
          >
              <span className="flex items-center gap-2"><Shirt size={18} /> {t('store.filter_apparel')}</span>
          </button>
          <button 
             onClick={() => setFilter('CONSUMABLE')}
             className={`px-6 py-2 rounded-full font-bold transition-all border-2 whitespace-nowrap
                ${filter === 'CONSUMABLE' ? 'bg-kid-primary text-yellow-900 border-yellow-500' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700'}
             `}
          >
              <span className="flex items-center gap-2"><Zap size={18} /> {t('store.filter_boosters')}</span>
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isOwned = user.inventory.includes(item.id) && item.type !== 'CONSUMABLE' && item.type !== 'POWERUP';
          const canAfford = safeCoins >= item.cost;
          
          return (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 flex flex-col items-center text-center shadow-sm transition-colors relative overflow-hidden
                ${isOwned ? 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900' : 'border-gray-100 dark:border-gray-700 hover:border-kid-accent'}
              `}
            >
              <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-5xl mb-4 border-2 border-dashed border-gray-200 dark:border-gray-600">
                {item.icon}
              </div>
              
              <h3 className="text-xl font-black text-gray-800 dark:text-white mb-1">{item.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-6 flex-1">{item.description}</p>

              {isOwned ? (
                 <button disabled className="w-full py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-bold flex items-center justify-center gap-2 cursor-default">
                    <Check size={20} /> {t('store.owned')}
                 </button>
              ) : (
                 <button 
                    onClick={() => buyItem(item)}
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 btn-juicy shadow-[0_4px_0_0_rgba(0,0,0,0.1)]
                      ${canAfford 
                        ? 'bg-kid-primary text-yellow-900 shadow-[0_4px_0_0_rgba(202,138,4,1)] hover:bg-yellow-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'}
                    `}
                 >
                    <Coins size={18} /> {item.cost}
                 </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BizStore;
