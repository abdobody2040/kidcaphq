
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { BusinessSimulation, VisualConfig } from '../../types';
import { Play, TrendingUp, ShoppingCart, CheckCircle, AlertTriangle, Zap, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

const SimulationTemplate: React.FC<Props> = ({ config, onExit }) => {
  const { completeGame, getSkillModifiers } = useAppStore();
  
  const [day, setDay] = useState(1);
  const [funds, setFunds] = useState(100);
  const [phase, setPhase] = useState<'STRATEGY' | 'SIMULATION' | 'RESULT'>('STRATEGY');
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [upgrades, setUpgrades] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [dayStats, setDayStats] = useState<any>({});
  const [eventLog, setEventLog] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
      const initial: any = {};
      config.variables?.player_inputs?.forEach(input => {
          initial[String(input)] = 50;
      });
      setSliderValues(initial);
  }, [config]);

  const handleExit = () => {
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
      
      // Calculate Revenue/Cost based on "Game Balance"
      const customerBase = 20 * (1 + upgrades.length * 0.2);
      const customers = Math.floor(customerBase * eventMult * (avgInput / 100 + 0.5));
      
      const revenue = Math.floor(customers * 5 * mods.priceMultiplier);
      const expenses = Math.floor((customers * 2 + 10) * mods.costMultiplier);
      const profit = revenue - expenses;

      setDayStats({ revenue, expenses, profit, customers });
      setFunds(f => f + profit);
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
            <div className="font-bold text-gray-600">Day {day}</div>
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
