
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { getLemonadeFeedback } from '../services/geminiService';
import { motion } from 'framer-motion';
import { ShoppingCart, Sun, CloudRain, DollarSign, TrendingUp, RefreshCcw, Zap } from 'lucide-react';
import GameTutorialModal from './common/GameTutorialModal';

type GamePhase = 'PREP' | 'SIMULATION' | 'RESULT';

const LemonadeStand: React.FC = () => {
  const { lemonadeState, updateLemonadeState, getSkillModifiers } = useAppStore();
  const [phase, setPhase] = useState<GamePhase>('PREP');
  const [weather, setWeather] = useState<string>('Sunny');
  const [simProgress, setSimProgress] = useState(0);
  const [dayResult, setDayResult] = useState({ sold: 0, profit: 0, revenue: 0, cost: 0, feedback: '', skillBonus: 0 });
  const [showTutorial, setShowTutorial] = useState(true);

  // Get active skills
  const modifiers = getSkillModifiers();

  // Base Prices
  const BASE_COST_LEMON = 2.50; // for 5
  const BASE_COST_SUGAR = 2.00; // for 10
  const BASE_COST_CUP = 2.00; // for 20

  // Effective Prices (Applying Efficiency Skills)
  const costLemon = BASE_COST_LEMON * modifiers.costMultiplier;
  const costSugar = BASE_COST_SUGAR * modifiers.costMultiplier;
  const costCup = BASE_COST_CUP * modifiers.costMultiplier;

  // Forecast
  const generateWeather = () => {
    const r = Math.random();
    if (r > 0.7) return 'Rainy';
    if (r > 0.4) return 'Cloudy';
    return 'Sunny';
  };

  useEffect(() => {
    setWeather(generateWeather());
  }, [lemonadeState.day]);

  const handleBuy = (item: 'lemons' | 'sugar' | 'cups', amount: number, cost: number) => {
    if (lemonadeState.funds >= cost) {
      updateLemonadeState({
        funds: lemonadeState.funds - cost,
        inventory: {
          ...lemonadeState.inventory,
          [item]: lemonadeState.inventory[item] + amount
        }
      });
    }
  };

  const startDay = async () => {
    setPhase('SIMULATION');
    setSimProgress(0);

    // Simulation Logic
    const demandBase = weather === 'Sunny' ? 30 : weather === 'Cloudy' ? 15 : 5;
    const priceFactor = Math.max(0.1, 2.0 - lemonadeState.recipe.pricePerCup); // Higher price = lower demand
    
    // Apply Charisma Skill to Demand (optional, or just Price)
    const potentialCustomers = Math.floor(demandBase * (1 + priceFactor));
    
    // Max sales limited by inventory
    const maxSalesByLemons = lemonadeState.inventory.lemons * 5; // 1 lemon = 5 cups
    const maxSalesBySugar = lemonadeState.inventory.sugar;
    const maxSalesByCups = lemonadeState.inventory.cups;

    const actualSales = Math.min(potentialCustomers, maxSalesByLemons, maxSalesBySugar, maxSalesByCups);

    const baseRevenue = actualSales * lemonadeState.recipe.pricePerCup;
    
    // Apply Charisma Multiplier to Revenue
    const totalRevenue = baseRevenue * modifiers.priceMultiplier;
    const skillBonus = totalRevenue - baseRevenue;

    const profit = totalRevenue; // Simple daily cash flow

    // Consume Inventory
    const lemonsUsed = Math.ceil(actualSales / 5);
    
    // Get AI Feedback
    const aiFeedback = await getLemonadeFeedback(weather, lemonadeState.recipe.pricePerCup, lemonadeState.recipe.sugarPerCup, actualSales);

    // Animation timer
    const interval = setInterval(() => {
      setSimProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDayResult({
            sold: actualSales,
            revenue: totalRevenue,
            cost: 0,
            profit,
            feedback: aiFeedback,
            skillBonus
          });
          
          updateLemonadeState({
            funds: lemonadeState.funds + totalRevenue,
            day: lemonadeState.day + 1,
            inventory: {
              lemons: lemonadeState.inventory.lemons - lemonsUsed,
              sugar: lemonadeState.inventory.sugar - actualSales,
              cups: lemonadeState.inventory.cups - actualSales
            },
            history: [...lemonadeState.history, {
                day: lemonadeState.day,
                weather,
                cupsSold: actualSales,
                profit,
                feedback: aiFeedback
            }]
          });
          
          setPhase('RESULT');
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 relative h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col">
      {showTutorial && (
          <GameTutorialModal 
            onStart={() => setShowTutorial(false)}
            title="Lemonade Tycoon"
            description="Run your own lemonade stand! Manage inventory, set prices, and react to the weather."
            icon="🍋"
            color="bg-yellow-500"
            instructions={[
                "Check the weather forecast.",
                "Buy Lemons, Sugar, and Cups.",
                "Set a price (Too high? No sales!)",
                "Start the day and make profit!"
            ]}
          />
      )}

      <div className="bg-kid-primary p-4 md:p-6 text-indigo-900 flex justify-between items-center shrink-0 z-10">
        <div>
           <h2 className="text-xl md:text-3xl font-black">Lemonade Tycoon</h2>
           <div className="text-xs md:text-sm font-bold opacity-80">Day {lemonadeState.day} • Forecast: {weather}</div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setShowTutorial(true)} className="bg-white/20 hover:bg-white/40 px-3 py-1 rounded-lg font-bold text-xs md:text-sm">Help</button>
            <div className="bg-white/30 px-3 py-1 md:px-4 md:py-2 rounded-xl backdrop-blur-sm font-black text-lg md:text-xl flex items-center gap-1 md:gap-2">
                <DollarSign size={16} className="md:w-5 md:h-5" />
                {lemonadeState.funds.toFixed(2)}
            </div>
        </div>
      </div>

      <div className="p-4 md:p-8 flex-1 overflow-y-auto">
        {phase === 'PREP' && (
          <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
            {/* Skills Indicator */}
            {(modifiers.costMultiplier < 1 || modifiers.priceMultiplier > 1) && (
                <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                    {modifiers.costMultiplier < 1 && (
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-black flex items-center gap-2">
                            <Zap size={12} /> Efficiency Discount Active
                        </div>
                    )}
                    {modifiers.priceMultiplier > 1 && (
                        <div className="bg-pink-100 text-pink-700 px-3 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-black flex items-center gap-2">
                            <Zap size={12} /> Charisma Boost Active
                        </div>
                    )}
                </div>
            )}

            {/* Inventory Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <InventoryCard 
                  icon="🍋" 
                  name="Lemons" 
                  count={lemonadeState.inventory.lemons} 
                  subtext="(1 lemon makes 5 cups)"
                  onBuy={() => handleBuy('lemons', 5, costLemon)}
                  price={`$${costLemon.toFixed(2)} for 5`}
                  originalPrice={modifiers.costMultiplier < 1 ? BASE_COST_LEMON : undefined}
                />
                <InventoryCard 
                  icon="🍚" 
                  name="Sugar" 
                  count={lemonadeState.inventory.sugar} 
                  subtext="(servings)"
                  onBuy={() => handleBuy('sugar', 10, costSugar)}
                  price={`$${costSugar.toFixed(2)} for 10`}
                  originalPrice={modifiers.costMultiplier < 1 ? BASE_COST_SUGAR : undefined}
                />
                <InventoryCard 
                  icon="🥤" 
                  name="Cups" 
                  count={lemonadeState.inventory.cups} 
                  subtext="(units)"
                  onBuy={() => handleBuy('cups', 20, costCup)}
                  price={`$${costCup.toFixed(2)} for 20`}
                  originalPrice={modifiers.costMultiplier < 1 ? BASE_COST_CUP : undefined}
                />
            </div>

            {/* Recipe / Pricing Section */}
            <div className="bg-gray-50 p-4 md:p-6 rounded-2xl border-2 border-gray-100">
               <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm md:text-base">
                 <TrendingUp size={20}/> Set Your Price
               </h3>
               <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-gray-800">${lemonadeState.recipe.pricePerCup.toFixed(2)}</span>
                  <input 
                    type="range" 
                    min="0.10" 
                    max="3.00" 
                    step="0.10"
                    value={lemonadeState.recipe.pricePerCup}
                    onChange={(e) => updateLemonadeState({ recipe: { ...lemonadeState.recipe, pricePerCup: parseFloat(e.target.value) } })}
                    className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-kid-accent"
                  />
               </div>
            </div>

            <button 
              onClick={startDay}
              className="w-full py-4 bg-kid-secondary hover:bg-green-600 text-white font-black text-xl md:text-2xl rounded-2xl shadow-[0_6px_0_0_rgba(21,128,61,1)] btn-juicy transition-all flex items-center justify-center gap-3 mb-8"
            >
              <Sun className="animate-spin-slow" /> Open for Business!
            </button>
          </div>
        )}

        {phase === 'SIMULATION' && (
           <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <h3 className="text-2xl font-bold text-gray-600 mb-8">Selling Lemonade...</h3>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-8 overflow-hidden mb-8 relative">
                 <div 
                    className="h-full bg-kid-primary transition-all duration-100"
                    style={{ width: `${simProgress}%` }}
                 />
                 <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-600 text-sm">
                    {simProgress}% Day Complete
                 </div>
              </div>
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl inline-block"
              >
                🍋
              </motion.div>
           </div>
        )}

        {phase === 'RESULT' && (
            <div className="text-center space-y-6 max-w-2xl mx-auto py-8">
                <h3 className="text-3xl font-black text-gray-800">Day Complete!</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="text-sm text-gray-500 font-bold">Cups Sold</div>
                        <div className="text-2xl md:text-3xl font-black text-blue-600">{dayResult.sold}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="text-sm text-gray-500 font-bold">Profit</div>
                        <div className="text-2xl md:text-3xl font-black text-green-600">+${dayResult.profit.toFixed(2)}</div>
                        {dayResult.skillBonus > 0 && (
                            <div className="text-xs font-bold text-green-500 mt-1 flex items-center justify-center gap-1">
                                <Zap size={10} /> +${dayResult.skillBonus.toFixed(2)} Skill Bonus
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 text-left flex gap-4">
                     <div className="text-4xl">🦉</div>
                     <div>
                        <div className="font-bold text-yellow-800 text-sm uppercase tracking-wide mb-1">CEO Ollie Says</div>
                        <p className="text-gray-800 font-medium italic text-sm md:text-base">"{dayResult.feedback}"</p>
                     </div>
                </div>

                <button 
                  onClick={() => setPhase('PREP')}
                  className="px-8 py-3 bg-kid-accent text-white font-black rounded-xl shadow-[0_4px_0_0_rgba(30,58,138,1)] btn-juicy flex items-center gap-2 mx-auto text-lg"
                >
                    <RefreshCcw size={20} /> Next Day
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const InventoryCard = ({ icon, name, count, subtext, onBuy, price, originalPrice }: any) => (
  <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 flex flex-col items-center text-center">
     <div className="text-3xl md:text-4xl mb-2">{icon}</div>
     <div className="font-bold text-gray-800 text-base md:text-lg">{name}</div>
     <div className="text-xl md:text-2xl font-black text-gray-900 my-1">{count}</div>
     <div className="text-[10px] md:text-xs text-gray-400 font-bold mb-4">{subtext}</div>
     <button 
        onClick={onBuy}
        className="w-full py-2 bg-white border-2 border-kid-secondary text-kid-secondary font-bold rounded-xl hover:bg-kid-secondary hover:text-white transition-colors relative text-sm"
     >
        Buy {price}
        {originalPrice && (
            <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full line-through opacity-80">
                ${originalPrice.toFixed(2)}
            </span>
        )}
     </button>
  </div>
);

export default LemonadeStand;
