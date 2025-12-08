
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { ArrowLeft, Play, TrendingUp, AlertTriangle, Zap, ShoppingCart, CheckCircle, Users, BarChart3, Star, RotateCcw, Trash2, Save, HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  gameId: string;
  onExit: () => void;
}

interface DayStats {
    revenue: number;
    expenses: number;
    profit: number;
    customers: number;
    satisfaction: number;
}

const UniversalBusinessGame: React.FC<Props> = ({ gameId, onExit }) => {
  // Access store for live game data
  const { user, games, completeGame, getSkillModifiers } = useAppStore();
  const gameData = games.find(g => g.business_id === gameId);
  
  // State
  const [day, setDay] = useState(1);
  const [funds, setFunds] = useState(100);
  const [phase, setPhase] = useState<'STRATEGY' | 'SIMULATION' | 'RESULT'>('STRATEGY');
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [upgrades, setUpgrades] = useState<string[]>([]);
  
  // Animation/Transient State
  const [progress, setProgress] = useState(0);
  const [dayStats, setDayStats] = useState<DayStats>({ revenue: 0, expenses: 0, profit: 0, customers: 0, satisfaction: 0 });
  const [eventLog, setEventLog] = useState<string | null>(null);
  const [activeModifiers, setActiveModifiers] = useState<{xpMultiplier: number, costMultiplier: number, priceMultiplier: number} | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // --- SAVE / LOAD LOGIC ---
  useEffect(() => {
    if (!gameData || !user) return;

    // SCope save to USER ID
    const saveKey = `kidcap_save_${user.id}_${gameId}`;
    const savedString = localStorage.getItem(saveKey);

    if (savedString) {
        try {
            const saved = JSON.parse(savedString);
            setDay(saved.day || 1);
            setFunds(saved.funds || 100);
            setUpgrades(saved.upgrades || []);
            setSliderValues(saved.sliderValues || {});
            // Recalculate modifiers on load to ensure skills match current user state
            const mods = getSkillModifiers();
            setActiveModifiers(mods);
            console.log("Game Loaded:", saveKey);
        } catch (e) {
            console.error("Failed to load save:", e);
            initializeDefaults();
        }
    } else {
        initializeDefaults();
        // Show tutorial on first load (no save found)
        setShowTutorial(true);
        setTutorialStep(0);
    }
  }, [gameId, gameData, getSkillModifiers, user]);

  const initializeDefaults = () => {
      if (!gameData) return;
      const initialSliders: any = {};
      gameData.variables.player_inputs.forEach(input => {
          initialSliders[input] = 50;
      });
      setSliderValues(initialSliders);
      setDay(1);
      setFunds(100);
      setUpgrades([]);
      const mods = getSkillModifiers();
      setActiveModifiers(mods);
  };

  // Autosave when key state changes
  useEffect(() => {
      if (!gameData || !user) return;
      const saveKey = `kidcap_save_${user.id}_${gameId}`;
      const stateToSave = {
          day,
          funds,
          upgrades,
          sliderValues
      };
      
      localStorage.setItem(saveKey, JSON.stringify(stateToSave));
      
      // Trigger small save animation (debounced slightly in UI via simple logic)
      if (day > 1 || upgrades.length > 0) {
          setIsSaving(true);
          const timer = setTimeout(() => setIsSaving(false), 1000);
          return () => clearTimeout(timer);
      }
  }, [day, funds, upgrades, sliderValues, gameId, gameData, user]);

  const handleReset = () => {
      if (confirm("Are you sure you want to reset your business? You will lose all upgrades and money.")) {
          if (!user) return;
          const saveKey = `kidcap_save_${user.id}_${gameId}`;
          localStorage.removeItem(saveKey);
          initializeDefaults();
          setPhase('STRATEGY');
          setShowTutorial(true);
          setTutorialStep(0);
      }
  };

  if (!gameData) return <div>Game not found</div>;

  const startDay = () => {
      setPhase('SIMULATION');
      setProgress(0);
      setEventLog(null);
      
      // Refresh modifiers before day start
      const modifiers = getSkillModifiers();
      setActiveModifiers(modifiers);

      // Random Event
      const r = Math.random();
      let eventEffect = 1.0;
      let eventMsg = null;

      if (r > 0.8) {
          eventMsg = gameData.event_triggers.positive.event_name;
          eventEffect = 1.5;
      } else if (r < 0.2) {
          eventMsg = gameData.event_triggers.negative.event_name;
          eventEffect = 0.5;
      }
      setEventLog(eventMsg);

      // Simulation Animation
      let p = 0;
      const interval = setInterval(() => {
          p += 2;
          setProgress(p);
          if (p >= 100) {
              clearInterval(interval);
              finishDay(eventEffect, modifiers);
          }
      }, 50);
  };

  const finishDay = (eventMultiplier: number, modifiers: { priceMultiplier: number, costMultiplier: number }) => {
      // Calculate Stats
      const values = Object.values(sliderValues) as number[];
      // Fix potential division by zero
      const avgInput = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 50;
      const upgradeMultiplier = 1 + (upgrades.length * 0.5);
      
      // Basic Logic
      const qualityFactor = avgInput / 100;
      const satisfactionBase = 60 + (qualityFactor * 40); // 60-100 base
      const satisfaction = Math.min(100, Math.round(satisfactionBase * (eventMultiplier > 1 ? 1.1 : 1.0)));
      
      const baseCustomers = 20;
      const customers = Math.floor(baseCustomers * upgradeMultiplier * eventMultiplier * (satisfaction / 100));
      
      // Apply Skill Modifiers
      const revenuePerCustomer = (5 + (avgInput * 0.05)) * modifiers.priceMultiplier; 
      const expensePerCustomer = (2 + (avgInput * 0.04));
      
      const revenue = Math.floor(customers * revenuePerCustomer);
      const variableExpenses = Math.floor(customers * expensePerCustomer);
      const fixedExpenses = 10;
      const totalExpenses = Math.floor((variableExpenses + fixedExpenses) * modifiers.costMultiplier);
      
      const profit = revenue - totalExpenses;

      setDayStats({
          revenue,
          expenses: totalExpenses,
          profit,
          customers,
          satisfaction
      });

      setFunds(prev => prev + profit);
      setPhase('RESULT');
  };

  const buyUpgrade = (upgradeId: string, cost: number) => {
      if (funds >= cost && !upgrades.includes(upgradeId)) {
          setFunds(f => f - cost);
          setUpgrades([...upgrades, upgradeId]);
      }
  };

  const quitGame = () => {
      // We do NOT clear save here, allowing them to resume later.
      completeGame(Math.max(0, funds), Math.max(10, Math.floor(funds / 10))); // Convert funds to XP/Score
      onExit();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col relative">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center relative z-20">
            <div className="flex items-center gap-4">
                <button onClick={onExit} className="hover:bg-gray-800 p-2 rounded-full"><ArrowLeft /></button>
                <div>
                    <h2 className="text-xl font-black">{gameData.name}</h2>
                    <div className="text-sm text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                        Day {day}
                        <AnimatePresence>
                            {isSaving && (
                                <motion.span 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="text-green-400 text-xs flex items-center gap-1"
                                >
                                    <Save size={12} /> Saved
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => { setShowTutorial(true); setTutorialStep(0); }} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-xl text-gray-400 hover:text-white transition-colors" title="How to Play">
                    <HelpCircle size={20} />
                </button>
                <div className="bg-green-600 px-4 py-2 rounded-xl font-mono font-bold text-xl flex items-center gap-2 shadow-inner">
                    $ {funds}
                </div>
                <button onClick={handleReset} className="bg-gray-800 hover:bg-red-900 p-2 rounded-xl text-gray-400 hover:text-white transition-colors" title="Reset Business">
                    <Trash2 size={20} />
                </button>
            </div>
        </div>

        {/* TUTORIAL OVERLAY */}
        <AnimatePresence>
            {showTutorial && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                    >
                        <button onClick={() => setShowTutorial(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            X
                        </button>
                        
                        <div className="mb-6 flex justify-center">
                            {tutorialStep === 0 && <div className="p-4 bg-blue-100 rounded-full text-blue-600 text-4xl">🚀</div>}
                            {tutorialStep === 1 && <div className="p-4 bg-yellow-100 rounded-full text-yellow-600 text-4xl">🎚️</div>}
                            {tutorialStep === 2 && <div className="p-4 bg-green-100 rounded-full text-green-600 text-4xl">🛒</div>}
                        </div>

                        <div className="text-center min-h-[180px]">
                            <AnimatePresence mode='wait'>
                                {tutorialStep === 0 && (
                                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <h3 className="text-2xl font-black text-gray-800 mb-2">Welcome, CEO!</h3>
                                        <p className="text-gray-600 font-medium mb-4">{gameData.description}</p>
                                        <p className="text-sm text-gray-400 font-bold">Your goal is to maximize profit over time.</p>
                                    </motion.div>
                                )}
                                {tutorialStep === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <h3 className="text-2xl font-black text-gray-800 mb-2">Daily Strategy</h3>
                                        <p className="text-gray-600 font-medium mb-4">Before each day starts, adjust your strategy sliders.</p>
                                        <p className="text-sm text-gray-400 font-bold">Find the perfect balance to keep customers happy!</p>
                                    </motion.div>
                                )}
                                {tutorialStep === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <h3 className="text-2xl font-black text-gray-800 mb-2">Grow Your Biz</h3>
                                        <p className="text-gray-600 font-medium mb-4">Use your profits to buy Upgrades in the Shop.</p>
                                        <p className="text-sm text-gray-400 font-bold">Upgrades attract more customers and increase revenue.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i === tutorialStep ? 'bg-kid-primary' : 'bg-gray-200'}`} />
                                ))}
                            </div>
                            <button 
                                onClick={() => {
                                    if (tutorialStep < 2) setTutorialStep(s => s + 1);
                                    else setShowTutorial(false);
                                }}
                                className="bg-kid-primary text-yellow-900 px-6 py-2 rounded-xl font-black shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy flex items-center gap-2 hover:bg-yellow-400"
                            >
                                {tutorialStep === 2 ? "Let's Play!" : "Next"} <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
            
            {phase === 'STRATEGY' && (
                <div className="space-y-8 max-w-4xl mx-auto">
                    <div className="bg-blue-100 p-6 rounded-2xl border-l-8 border-blue-500 shadow-sm">
                        <h3 className="text-blue-800 font-bold uppercase text-sm mb-2">Objective</h3>
                        <p className="text-blue-900 font-medium text-lg">{gameData.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Inputs */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
                                <TrendingUp size={20} /> Daily Strategy
                            </h3>
                            <div className="space-y-6">
                                {gameData.variables.player_inputs.map(input => (
                                    <div key={input}>
                                        <div className="flex justify-between mb-2 font-bold text-gray-600 text-sm uppercase">
                                            {input.replace(/_/g, ' ')}
                                            <span>{sliderValues[input]}%</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            value={sliderValues[input] || 50}
                                            onChange={(e) => setSliderValues({...sliderValues, [input]: parseInt(e.target.value)})}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upgrades */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                             <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
                                <ShoppingCart size={20} /> Shop
                            </h3>
                            <div className="space-y-4">
                                {gameData.upgrade_tree.map(u => {
                                    const isOwned = upgrades.includes(u.id);
                                    const canAfford = funds >= u.cost;
                                    return (
                                        <div key={u.id} className={`p-4 rounded-xl border-2 flex justify-between items-center transition-all ${isOwned ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
                                            <div>
                                                <div className="font-bold text-gray-800">{u.name}</div>
                                                <div className="text-xs text-gray-500">{u.effect}</div>
                                            </div>
                                            {isOwned ? (
                                                <div className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={16}/> Owned</div>
                                            ) : (
                                                <button 
                                                    onClick={() => buyUpgrade(u.id, u.cost)}
                                                    disabled={!canAfford}
                                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${canAfford ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                                >
                                                    ${u.cost}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={startDay}
                        className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-xl flex items-center justify-center gap-3 hover:bg-yellow-400 transition-colors"
                    >
                        <Play fill="currentColor" /> Start Day {day}
                    </button>
                </div>
            )}

            {phase === 'SIMULATION' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
                    <h3 className="text-2xl font-bold text-gray-500">Simulating Market...</h3>
                    
                    <div className="w-full max-w-md bg-gray-200 h-6 rounded-full overflow-hidden border-2 border-gray-300">
                        <motion.div 
                            className="h-full bg-blue-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="h-20">
                        {eventLog && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-bold flex items-center gap-2 border-2 border-yellow-400 shadow-sm"
                            >
                                <AlertTriangle size={20} /> {eventLog}!
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {phase === 'RESULT' && (
                <div className="max-w-2xl mx-auto space-y-8 py-4">
                    <div className="text-center">
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Day {day} Report</div>
                        <h2 className={`text-6xl font-black mb-2 ${dayStats.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {dayStats.profit >= 0 ? '+' : '-'}${Math.abs(dayStats.profit)}
                        </h2>
                        <p className="text-gray-500 font-bold">Net Profit</p>
                        {activeModifiers && (
                            <div className="flex justify-center gap-3 mt-4">
                                {activeModifiers.priceMultiplier > 1 && <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Zap size={12}/> Charisma Boost</span>}
                                {activeModifiers.costMultiplier < 1 && <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Zap size={12}/> Efficiency Save</span>}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="bg-green-100 p-2 rounded-full text-green-600 mb-2"><TrendingUp size={20}/></div>
                            <div className="text-sm text-gray-400 font-bold uppercase">Revenue</div>
                            <div className="text-2xl font-black text-gray-800">${dayStats.revenue}</div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="bg-red-100 p-2 rounded-full text-red-600 mb-2"><BarChart3 size={20}/></div>
                            <div className="text-sm text-gray-400 font-bold uppercase">Expenses</div>
                            <div className="text-2xl font-black text-gray-800">${dayStats.expenses}</div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600 mb-2"><Users size={20}/></div>
                            <div className="text-sm text-gray-400 font-bold uppercase">Customers</div>
                            <div className="text-2xl font-black text-gray-800">{dayStats.customers}</div>
                        </div>
                    </div>

                    {/* Customer Satisfaction */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">Customer Satisfaction</h3>
                            <span className="font-black text-xl text-yellow-500">{dayStats.satisfaction}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-4">
                            <div 
                                className={`h-full ${dayStats.satisfaction > 70 ? 'bg-green-500' : dayStats.satisfaction > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${dayStats.satisfaction}%` }}
                            />
                        </div>
                        <div className="flex justify-center gap-1 text-yellow-400">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                    key={star} 
                                    fill={dayStats.satisfaction >= star * 20 ? "currentColor" : "none"} 
                                    className={dayStats.satisfaction >= star * 20 ? "" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <p className="text-center text-sm font-bold text-gray-400 mt-2">
                            {dayStats.satisfaction > 80 ? "Customers loved it!" : dayStats.satisfaction > 50 ? "Customers thought it was okay." : "Customers were unhappy."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={quitGame}
                            className="py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300 transition-all"
                        >
                            Save & Exit
                        </button>
                        <button 
                            onClick={() => { setDay(d => d+1); setPhase('STRATEGY'); }}
                            className="py-4 bg-kid-secondary text-white rounded-xl font-black shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                        >
                            <RotateCcw size={20} /> Next Day
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default UniversalBusinessGame;
