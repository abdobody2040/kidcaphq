
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Gamepad2, Palette, Truck, Briefcase, Zap, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const { games } = useAppStore(); // Use games from store instead of static import
  const [filter, setFilter] = useState<string>('All');
  
  // Fix: Explicitly cast Array.from result to string[] to resolve type inference issue
  const categories: string[] = ['All', ...Array.from(new Set(games.map(g => g.category))) as string[]];

  const filteredGames = filter === 'All' 
    ? games 
    : games.filter(g => g.category === filter);

  return (
    <div className="pb-20">
      <div className="text-center mb-12">
         <h2 className="text-4xl font-black text-gray-800 mb-2">Arcade</h2>
         <p className="text-gray-500 font-bold">Choose a business to launch!</p>
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
                        : 'bg-white text-gray-500 border-2 border-gray-100 hover:bg-gray-50'}
                `}
              >
                  {cat}
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Special Custom Games at the top if 'All' or matching category */}
         {filter === 'All' || filter === 'Retail & Food' ? (
             <>
                 <GameCard 
                    title="Lemonade Tycoon"
                    description="The classic starter business. Manage inventory and weather."
                    icon={<Briefcase size={40} className="text-yellow-600" />}
                    color="bg-yellow-50"
                    borderColor="border-yellow-200"
                    onClick={() => onSelectGame('lemonade')}
                    isSpecial
                 />
                 <GameCard 
                    title="Pizza Rush"
                    description="Deliver pizzas on time in this fast-paced action game."
                    icon={<Truck size={40} className="text-red-600" />}
                    color="bg-red-50"
                    borderColor="border-red-200"
                    onClick={() => onSelectGame('pizza')}
                    isSpecial
                 />
             </>
         ) : null}

         {filter === 'All' || filter === 'Creative & Events' ? (
             <GameCard 
                title="Brand Builder"
                description="Design logos and company identities."
                icon={<Palette size={40} className="text-pink-600" />}
                color="bg-pink-50"
                borderColor="border-pink-200"
                onClick={() => onSelectGame('brand')}
                isSpecial
             />
         ) : null}

         {/* Generated Games */}
         {filteredGames.map(game => {
             const Icon = CATEGORY_ICONS[game.category] || Briefcase;
             return (
                <GameCard 
                    key={game.business_id}
                    title={game.name}
                    description={game.description}
                    icon={<Icon size={40} className="text-blue-600" />}
                    color="bg-white"
                    borderColor="border-gray-100"
                    onClick={() => onSelectGame(game.business_id)}
                />
             );
         })}
      </div>
    </div>
  );
};

const GameCard = ({ title, description, icon, color, borderColor, onClick, isSpecial }: any) => (
    <motion.button 
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`w-full p-6 rounded-3xl border-4 text-left shadow-sm transition-all flex flex-col h-full relative overflow-hidden group
            ${color} ${borderColor}
            ${isSpecial ? 'shadow-md' : 'hover:border-blue-200'}
        `}
    >
        {isSpecial && (
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-bl-xl">
                PRO
            </div>
        )}
        <div className="mb-4 p-4 rounded-2xl bg-white/60 w-fit backdrop-blur-sm border border-black/5">
            {icon}
        </div>
        <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6">{description}</p>
        
        <div className="mt-auto pt-4 border-t border-black/5 w-full flex justify-between items-center text-gray-400 font-black text-xs uppercase tracking-widest">
            <span>Play Now</span>
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Briefcase size={16} />
            </div>
        </div>
    </motion.button>
);

export default GameMenu;
