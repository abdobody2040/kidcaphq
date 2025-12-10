
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';
import { Coffee, ArrowLeft, RotateCcw, DollarSign, Cloud, Sun, CloudRain } from 'lucide-react';
import GameTutorialModal from './common/GameTutorialModal';

interface Props {
  onBack: () => void;
}

const CoffeeCart: React.FC<Props> = ({ onBack }) => {
  const { completeGame } = useAppStore();
  const [phase, setPhase] = useState<'PREP' | 'BREW' | 'RESULT'>('PREP');
  const [funds, setFunds] = useState(50);
  const [stock, setStock] = useState({ beans: 0, milk: 0, cups: 0 });
  const [recipe, setRecipe] = useState({ roast: 5, foam: 5, price: 3.5 });
  const [weather, setWeather] = useState('Sunny');
  const [showTutorial, setShowTutorial] = useState(true);
  
  // Brew Phase
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ sold: 0, revenue: 0, tips: 0 });

  useEffect(() => {
      const r = Math.random();
      setWeather(r > 0.6 ? 'Rainy' : r > 0.3 ? 'Cloudy' : 'Sunny');
  }, []);

  const buy = (item: 'beans' | 'milk' | 'cups', cost: number, amount: number) => {
      if (funds >= cost) {
          setFunds(f => f - cost);
          setStock(s => ({ ...s, [item]: s[item] + amount }));
      }
  };

  const startDay = () => {
      if (stock.cups === 0) return alert("You need cups!");
      setPhase('BREW');
      
      // Simulation
      let sold = 0;
      const demand = weather === 'Rainy' ? 40 : weather === 'Cloudy' ? 25 : 15; // Rainy = More coffee!
      const quality = (recipe.roast + recipe.foam) / 20; // 0.1 to 1.0
      const priceFactor = 5 / recipe.price; 
      
      const potential = Math.floor(demand * quality * priceFactor);
      sold = Math.min(potential, stock.cups, stock.beans, stock.milk);
      
      const revenue = sold * recipe.price;
      const tips = Math.floor(sold * quality); // Better quality = tips

      const interval = setInterval(() => {
          setProgress(p => {
              if (p >= 100) {
                  clearInterval(interval);
                  setStats({ sold, revenue, tips });
                  completeGame(revenue + tips, (revenue + tips) * 2);
                  setPhase('RESULT');
                  return 100;
              }
              return p + 2;
          });
      }, 50);
  };

  return (
    <div className="bg-[#3e2723] min-h-[600px] rounded-3xl overflow-hidden shadow-2xl text-[#d7ccc8] flex flex-col relative">
        {showTutorial && (
            <GameTutorialModal 
                onStart={() => setShowTutorial(false)}
                title="Coffee Cart"
                description="Become a barista! Brew the perfect cup and manage your stock."
                icon="☕"
                color="bg-[#5d4037]"
                instructions={[
                    "Buy Beans, Milk, and Cups.",
                    "Adjust your recipe: Roast & Foam.",
                    "Set your price.",
                    "Rainy days = More customers!"
                ]}
            />
        )}

        {/* Header */}
        <div className="p-6 flex justify-between items-center bg-[#281916]">
            <button onClick={onBack} className="text-[#a1887f] hover:text-white"><ArrowLeft /></button>
            <div className="text-2xl font-black">Coffee Cart ☕</div>
            <div className="flex items-center gap-2">
                <button onClick={() => setShowTutorial(true)} className="bg-[#5d4037] hover:bg-[#8d6e63] px-3 py-1 rounded text-xs font-bold">Help</button>
                <div className="bg-[#5d4037] px-4 py-1 rounded-full font-mono font-bold">${funds.toFixed(2)}</div>
            </div>
        </div>

        <div className="flex-1 p-8 flex flex-col items-center justify-center">
            {phase === 'PREP' && (
                <div className="w-full max-w-2xl space-y-8">
                    <div className="flex justify-between items-center bg-[#4e342e] p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                            {weather === 'Sunny' ? <Sun className="text-yellow-500" /> : weather === 'Rainy' ? <CloudRain className="text-blue-400"/> : <Cloud className="text-gray-400"/>}
                            <span className="font-bold">{weather} Forecast</span>
                        </div>
                        <div className="text-sm opacity-70">Tip: Rain boosts demand!</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#5d4037] p-4 rounded-xl text-center">
                            <div className="text-3xl mb-2">🫘</div>
                            <div className="font-bold mb-1">Beans: {stock.beans}</div>
                            <button onClick={() => buy('beans', 5, 10)} className="w-full bg-[#8d6e63] hover:bg-[#a1887f] py-1 rounded font-bold text-xs">Buy 10 ($5)</button>
                        </div>
                        <div className="bg-[#5d4037] p-4 rounded-xl text-center">
                            <div className="text-3xl mb-2">🥛</div>
                            <div className="font-bold mb-1">Milk: {stock.milk}</div>
                            <button onClick={() => buy('milk', 3, 10)} className="w-full bg-[#8d6e63] hover:bg-[#a1887f] py-1 rounded font-bold text-xs">Buy 10 ($3)</button>
                        </div>
                        <div className="bg-[#5d4037] p-4 rounded-xl text-center">
                            <div className="text-3xl mb-2">🥤</div>
                            <div className="font-bold mb-1">Cups: {stock.cups}</div>
                            <button onClick={() => buy('cups', 2, 20)} className="w-full bg-[#8d6e63] hover:bg-[#a1887f] py-1 rounded font-bold text-xs">Buy 20 ($2)</button>
                        </div>
                    </div>

                    <div className="bg-[#4e342e] p-6 rounded-2xl space-y-4">
                        <div>
                            <div className="flex justify-between mb-1 text-sm font-bold">Price: ${recipe.price}</div>
                            <input type="range" min="1" max="8" step="0.5" value={recipe.price} onChange={e => setRecipe({...recipe, price: parseFloat(e.target.value)})} className="w-full accent-[#d7ccc8]" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1 text-sm font-bold">Roast Strength: {recipe.roast}</div>
                            <input type="range" min="1" max="10" value={recipe.roast} onChange={e => setRecipe({...recipe, roast: parseInt(e.target.value)})} className="w-full accent-[#d7ccc8]" />
                        </div>
                    </div>

                    <button onClick={startDay} className="w-full py-4 bg-[#8d6e63] hover:bg-[#a1887f] text-white font-black text-xl rounded-2xl shadow-lg">Start Brewing</button>
                </div>
            )}

            {phase === 'BREW' && (
                <div className="text-center">
                    <div className="text-9xl mb-8 animate-bounce">☕</div>
                    <div className="w-64 h-4 bg-[#4e342e] rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-[#d7ccc8] transition-all duration-75" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="mt-4 font-bold text-xl">Serving Customers...</div>
                </div>
            )}

            {phase === 'RESULT' && (
                <div className="text-center space-y-6">
                    <h2 className="text-4xl font-black">Day Complete!</h2>
                    <div className="grid grid-cols-2 gap-4 text-left bg-[#4e342e] p-6 rounded-2xl">
                        <div>Sold:</div><div className="font-black text-right">{stats.sold} Cups</div>
                        <div>Revenue:</div><div className="font-black text-right text-green-400">${stats.revenue.toFixed(2)}</div>
                        <div>Tips:</div><div className="font-black text-right text-yellow-400">${stats.tips.toFixed(2)}</div>
                        <div className="pt-2 border-t border-[#5d4037]">Total:</div><div className="pt-2 border-t border-[#5d4037] font-black text-right text-xl">${(stats.revenue + stats.tips).toFixed(2)}</div>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-[#a1887f] hover:bg-[#4e342e]">Leave</button>
                        <button onClick={() => { setPhase('PREP'); setFunds(f => f + stats.revenue + stats.tips); }} className="px-6 py-3 rounded-xl bg-[#8d6e63] hover:bg-[#a1887f] font-black text-white">Next Day</button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default CoffeeCart;
