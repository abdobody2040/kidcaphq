
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Gamepad2, Palette, Truck, Briefcase, Zap, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface GameMenuProps {
  onSelectGame: (gameId: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  'Retail & Food': Briefcase,
  'Services & E-Commerce': Truck,
  'Production & Manufacturing': Zap,
  'Creative & Events': Palette,
  'Digital & Tech': Gamepad2,
  'Social Impact': Heart,
};

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  const { games } = useAppStore();
  const [filter, setFilter] = useState<string>('All');
  const { t } = useTranslation();
  
  // Safety check: ensure games is an array
  const safeGames = Array.isArray(games) ? games : [];
  
  const categories: string[] = ['All', ...Array.from(new Set(safeGames.map(g => g.category || 'Other'))) as string[]];

  // Helper to translate categories
  const getCategoryLabel = (cat: string) => {
      if (cat === 'All') return t('arcade.cat_all');
      if (cat === 'Retail & Food') return t('arcade.cat_retail');
      if (cat === 'Services & E-Commerce') return t('arcade.cat_service');
      if (cat === 'Production & Manufacturing') return t('arcade.cat_production');
      if (cat === 'Creative & Events') return t('arcade.cat_creative');
      if (cat === 'Digital & Tech') return t('arcade.cat_tech');
      if (cat === 'Social Impact') return t('arcade.cat_social');
      return cat;
  };

  // Filter out the generic Lemonade Stand since we use the custom one
  const filteredGames = (filter === 'All' ? safeGames : safeGames.filter(g => g.category === filter))
    .filter(g => g.business_id !== 'BIZ_01_LEMONADE');

  return (
    <div className="pb-20">
      <div className="text-center mb-12">
         <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-2">{t('arcade.title')}</h2>
         <p className="text-gray-500 dark:text-gray-400 font-bold">{t('arcade.subtitle')}</p>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
          {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors
                    ${filter === cat 
                        ? 'bg-kid-primary text-yellow-900 border-2 border-yellow-500' 
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
                `}
              >
                  {getCategoryLabel(cat)}
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Special Custom Game: Lemonade Tycoon */}
         {(filter === 'All' || filter === 'Retail & Food') && (
             <GameCard 
                title="Lemonade Tycoon"
                description="The classic starter business. Manage inventory and weather."
                icon={<Briefcase size={40} className="text-yellow-600" />}
                backgroundColor="#FEFCE8"
                borderColor="#FEF08A"
                onClick={() => onSelectGame('lemonade')}
                isSpecial
                badge="CLASSIC"
                playText={t('arcade.play_now')}
             />
         )}

         {/* Special Custom Game: Brand Builder */}
         {(filter === 'All' || filter === 'Creative & Events') && (
             <GameCard 
                title="Brand Builder"
                description="Design logos and company identities."
                icon={<Palette size={40} className="text-pink-600" />}
                backgroundColor="#FDF2F8"
                borderColor="#FBCFE8"
                onClick={() => onSelectGame('brand')}
                isSpecial
                badge="CREATIVE"
                playText={t('arcade.play_now')}
             />
         )}

         {/* Generated Games */}
         {filteredGames.map(game => {
             const Icon = CATEGORY_ICONS[game.category] || Briefcase;
             const visual = game.visual_config || { 
                 theme: 'light', 
                 colors: { background: '#FFFFFF', primary: '#E5E7EB', secondary: '#E5E7EB', accent: '#E5E7EB' },
                 icon: undefined 
             };
             
             return (
                <GameCard 
                    key={game.business_id}
                    title={game.name}
                    description={game.description}
                    icon={<span className="text-4xl">{visual.icon || <Icon size={40} />}</span>}
                    backgroundColor={visual.colors?.background}
                    borderColor={`${visual.colors?.primary || '#E5E7EB'}40`}
                    onClick={() => onSelectGame(game.business_id)}
                    playText={t('arcade.play_now')}
                />
             );
         })}
      </div>
    </div>
  );
};

const GameCard = ({ title, description, icon, backgroundColor, borderColor, onClick, isSpecial, badge, playText }: any) => {
    return (
        <motion.button 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            // Use !bg-gray-800 to override inline styles in dark mode
            className={`w-full p-6 rounded-3xl border-4 text-left shadow-sm transition-all flex flex-col h-full relative overflow-hidden group
                dark:!bg-gray-800 dark:!border-gray-700
            `}
            style={{ 
                backgroundColor: backgroundColor || '#FFFFFF', 
                borderColor: borderColor || '#E5E7EB'
            }}
        >
            {isSpecial && (
                <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-bl-xl rtl:rounded-bl-none rtl:rounded-br-xl z-10">
                    {badge || 'PRO'}
                </div>
            )}
            <div className="mb-4 p-4 rounded-2xl bg-white/60 dark:bg-black/20 w-fit backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2 group-hover:opacity-80 transition-opacity">
                {typeof title === 'string' ? title : 'Unknown Game'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-bold text-sm leading-relaxed mb-6 opacity-80">
                {typeof description === 'string' ? description : 'Description unavailable'}
            </p>
            
            <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 w-full flex justify-between items-center text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-widest">
                <span>{playText}</span>
                <div className="bg-white/50 dark:bg-black/20 p-2 rounded-full group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:scale-110 transition-all shadow-sm text-gray-700 dark:text-gray-200">
                    <Gamepad2 size={16} />
                </div>
            </div>
        </motion.button>
    );
};

export default GameMenu;
