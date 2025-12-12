
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../../store';
import { BusinessSimulation, VisualConfig } from '../../types';
import { Play, TrendingUp, ShoppingCart, CheckCircle, AlertTriangle, Zap, RotateCcw, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

interface GameSaveData {
  day: number;
  funds: number;
  upgrades: string[];
  sliderValues: Record<string, number>;
  timestamp: number;
}

const SimulationTemplate: React.FC<Props> = ({ config, onExit }) => {
  const { user, completeGame, getSkillModifiers } = useAppStore();
  const gameId = config.business_id;
  
  const [day, setDay] = useState(1);
  const [funds, setFunds] = useState(100);
  const [phase, setPhase] = useState<'STRATEGY' | 'SIMULATION' | 'RESULT'>('STRATEGY');
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [upgrades, setUpgrades] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [dayStats, setDayStats] = useState<any>({});
  const [eventLog, setEventLog] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============================================================================
  // SAVE/LOAD SYSTEM
  // ============================================================================
  
  const getSaveKey = useCallback(() => {
    if (!user || !gameId) return null;
    return `kidcap_save_${user.id}_${gameId}`;
  }, [user, gameId]);

  const loadGameData = useCallback(() => {
    const saveKey = getSaveKey();
    if (!saveKey) return false;

    try {
      const savedString = localStorage.getItem(saveKey);
      if (!savedString) return false;

      const saved: GameSaveData = JSON.parse(savedString);
      
      // Basic validation
      if (typeof saved.day !== 'number' || typeof saved.funds !== 'number') return false;

      setDay(saved.day);
      setFunds(saved.funds);
      setUpgrades(saved.upgrades || []);
      
      // Restore sliders or fallback to defaults
      const initialSliders: Record<string, number> = {};
      config.variables?.player_inputs?.forEach(input => {
          const key = String(input);
          initialSliders[key] = typeof saved.sliderValues?.[key] === 'number' ? saved.sliderValues[key] : 50;
      });
      setSliderValues(initialSliders);
      
      return true;
    } catch (error) {
      console.error("Load failed:", error);
      return false;
    }
  }, [getSaveKey, config]);

  const saveGameData = useCallback(() => {
    const saveKey = getSaveKey();
    if (!saveKey) return;

    const stateToSave: GameSaveData = {
      day,
      funds,
      upgrades,
      sliderValues,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(saveKey, JSON.stringify(stateToSave));
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error("Save failed:", error);
    }
  }, [day, funds, upgrades, sliderValues, getSaveKey]);

  // INITIALIZE
  useEffect(() => {
      const loaded = loadGameData();
      if (!loaded) {
          // Initialize defaults if no save found
          const initial: any = {};
          config.variables?.player_inputs?.forEach(input => {
              initial[String(input)] = 50;
          });
          setSliderValues(initial);
      }
  }, [config, loadGameData]);

  // AUTO-SAVE on state change (Debounced)
  useEffect(() => {
      // Don't save initial render immediately
      if(day === 1 && funds === 100 && upgrades.length === 0) return;

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(saveGameData, 1000);

      return () => {
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      };
  }, [day, funds, upgrades, sliderValues, saveGameData]);

  const handleReset = () => {
      if(!window.confirm("Restart this business? You will lose all progress.")) return;
      
      const saveKey = getSaveKey();
      if(saveKey) localStorage.removeItem(saveKey);
      
      setDay(1);
      setFunds(100);
      setUpgrades([]);
      const initial: any = {};
      config.variables?.player_inputs?.forEach(input => {
          initial[String(input)] = 50;
      });
      setSliderValues(initial);
      setPhase('STRATEGY');
  };

  const handleExit = () => {
    saveGameData(); // Force save
    // Award 20% of final funds as XP, capped reasonably
    const xpReward = Math.min(200, Math.floor(funds * 0.2));
    completeGame(funds, xpReward);
    onExit();
  };

  const startDay = () => {
      setPhase('SIMULATION');
      setProgress(0);
      
      const modifiers = getSkillModifiers();
      
      // Event Logic
      const r = Math.random();
      let eventEffect = 1.0;
      let eventName = null;
      if (r > 0.8 && config.event_triggers?.positive) {
          eventEffect = 1.5;
          eventName = config.event_triggers.positive.event_name;
      } else if (r < 0.2 && config.event_triggers?.negative) {
          eventEffect = 0.6;
          eventName = config.event_triggers.negative.event_name;
      }
      setEventLog(eventName);

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

  const finishDay = (eventMult: number, mods: any) => {
      // Simplified Tycoon Logic based on config
      const values = Object.values(sliderValues) as number[];
      const avgInput = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 50;
      
      // Satisfaction Calculation
      // Base satisfaction 60-100 based on input quality
      const qualityFactor = avgInput / 100;
      const satisfactionBase = 60 + (qualityFactor * 40); 
      
      // Event Modifier: Positive boosts, Negative reduces
      // If eventMult > 1 (Positive), boost satisfaction by 10%
      // If eventMult < 1 (Negative), reduce satisfaction by 10%
      const eventSatMod = eventMult > 1 ? 1.1 : (eventMult < 1 ? 0.9 : 1.0);
      const satisfaction = Math.min(100, Math.round(satisfactionBase * eventSatMod));

      // Calculate Revenue/Cost based on "Game Balance"
      const customerBase = 20 * (1 + upgrades.length * 0.2);
      const customers = Math.floor(customerBase * eventMult * (satisfaction / 100));
      
      // Financials
      // Price Multiplier from Skills affects Revenue per customer
      const revenue = Math.floor(customers * 5 * mods.priceMultiplier);
      
      // Cost Multiplier from Skills affects Expenses
      const expenses = Math.floor((customers * 2 + 10) * mods.costMultiplier);
      
      const profit = revenue - expenses;

      setDayStats({ revenue, expenses, profit, customers, satisfaction });
      setFunds(f => Math.max(0, f + profit)); // Prevent negative balance
      setPhase('RESULT');
  };

  const buyUpgrade = (u: any) => {
      if (funds >= u.cost && !upgrades.includes(u.id)) {
          setFunds(f => f - u.cost);
          setUpgrades([...upgrades, u.id]);
      }
  };

  const visual: VisualConfig = config.visual_config || { 
      theme: 'light', 
      colors: { primary: '#FFC800', secondary: '#F59E0B', accent: '#10B981', background: '#FFF' } 
  };

  // Helper to safely render potential objects
  const safeRender = (content: any) => {
    if (typeof content === 'string' || typeof content === 'number') return content;
    return JSON.stringify(content);
  };

  // Safe access to upgrade tree
  const upgradeTree = Array.isArray(config.upgrade_tree) ? config.upgrade_tree : [];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: visual.colors.background }}>
        {/* HUD */}
        <div className="p-4 flex justify-between items-center shadow-sm bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <div className="font-bold text-gray-600 flex items-center gap-2">
                    Day {day}
                    <AnimatePresence>
                        {isSaving && (
                            <motion.span 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="text-green-500 text-xs flex items-center gap-1"
                            >
                                <Save size={12} />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
                <button 
                    onClick={handleReset}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Reset Business"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-black font-mono text-xl">
                ${funds}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {phase === 'STRATEGY' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* INPUTS */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                                <TrendingUp size={20} /> Strategy
                            </h3>
                            <div className="space-y-6">
                                {config.variables?.player_inputs?.map(input => {
                                    const inputKey = String(input);
                                    return (
                                        <div key={inputKey}>
                                            <div className="flex justify-between mb-2 font-bold text-gray-600 text-xs uppercase tracking-widest">
                                                {inputKey.replace(/_/g, ' ')}
                                                <span>{sliderValues[inputKey] || 50}%</span>
                                            </div>
                                            <input 
                                                type="range"
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                style={{ accentColor: visual.colors.primary }}
                                                value={sliderValues[inputKey] || 50}
                                                onChange={(e) => setSliderValues({
                                                    ...sliderValues, 
                                                    [inputKey]: parseInt(e.target.value)
                                                })}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* UPGRADES */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                                <ShoppingCart size={20} /> Shop
                            </h3>
                            <div className="space-y-3">
                                {upgradeTree.length === 0 && <div className="text-gray-400 text-sm">No upgrades available.</div>}
                                {upgradeTree.map(u => {
                                    const isOwned = upgrades.includes(u.id);
                                    return (
                                        <button 
                                            key={u.id}
                                            disabled={isOwned || funds < u.cost}
                                            onClick={() => buyUpgrade(u)}
                                            className={`w-full p-3 rounded-xl border-2 text-left flex justify-between items-center transition-all
                                                ${isOwned 
                                                    ? 'bg-green-50 border-green-200 opacity-70' 
                                                    : funds >= u.cost 
                                                        ? 'bg-white border-gray-100 hover:border-blue-300'
                                                        : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'}
                                            `}
                                        >
                                            <div>
                                                <div className="font-bold text-sm text-gray-800">{safeRender(u.name)}</div>
                                                <div className="text-xs text-gray-400">{safeRender(u.effect)}</div>
                                            </div>
                                            {isOwned ? (
                                                <CheckCircle size={16} className="text-green-500" />
                                            ) : (
                                                <span className="font-mono font-bold text-sm">${u.cost}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'SIMULATION' && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-black text-gray-400 animate-pulse mb-8">Simulating Day...</h3>
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-8">
                            <motion.div 
                                className="h-full bg-blue-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {eventLog && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-bold"
                            >
                                <AlertTriangle size={20} /> {eventLog}
                            </motion.div>
                        )}
                    </div>
                )}

                {phase === 'RESULT' && (
                    <div className="text-center py-10">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Results</h3>
                        <div className={`text-6xl font-black mb-2 ${dayStats.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {dayStats.profit >= 0 ? '+' : '-'}${Math.abs(dayStats.profit)}
                        </div>
                        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <div className="text-xs font-bold text-gray-400 uppercase">Customers</div>
                                <div className="text-xl font-black text-blue-600">{dayStats.customers}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <div className="text-xs font-bold text-gray-400 uppercase">Revenue</div>
                                <div className="text-xl font-black text-green-600">${dayStats.revenue}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <div className="text-xs font-bold text-gray-400 uppercase">Expenses</div>
                                <div className="text-xl font-black text-red-600">${dayStats.expenses}</div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-between">
            <button onClick={handleExit} className="font-bold text-gray-400 hover:text-gray-600 px-4">
                Save & Exit
            </button>
            {phase === 'STRATEGY' && (
                <button 
                    onClick={startDay}
                    className="bg-kid-primary text-yellow-900 px-8 py-3 rounded-xl font-black shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy hover:bg-yellow-400 flex items-center gap-2"
                >
                    <Play fill="currentColor" size={18} /> Start Day
                </button>
            )}
            {phase === 'RESULT' && (
                <button 
                    onClick={() => { setDay(d => d+1); setPhase('STRATEGY'); }}
                    className="bg-kid-secondary text-white px-8 py-3 rounded-xl font-black shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy hover:bg-green-600 flex items-center gap-2"
                >
                    <RotateCcw size={18} /> Next Day
                </button>
            )}
        </div>
    </div>
  );
};

export default SimulationTemplate;
