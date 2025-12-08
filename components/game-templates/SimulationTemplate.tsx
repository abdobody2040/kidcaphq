
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { BusinessSimulation, VisualConfig } from '../../types';
import { Play, TrendingUp, ShoppingCart, CheckCircle, Users, BarChart3, Star, RotateCcw, AlertTriangle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

const SimulationTemplate: React.FC<Props> = ({ config, onExit }) => {
  const { user, completeGame, getSkillModifiers } = useAppStore();
  
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
      config.variables?.player_inputs.forEach(input => initial[input] = 50);
      setSliderValues(initial);
  }, [config]);

  const startDay = () => {
      setPhase('SIMULATION');
      setProgress(0);
      
      const modifiers = getSkillModifiers();
      
      // Event Logic
      const r = Math.random();
      let eventEffect = 1.0;
      let eventName = null;
      if (r > 0.8) {
          eventEffect = 1.5;
          eventName = config.event_triggers.positive.event_name;
      } else if (r < 0.2) {
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
            <div className="max-w-4xl mx-auto">
                {phase === 'STRATEGY' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Controls */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100">
                            <h3 className="font-black text-xl mb-6 flex items-center gap-2" style={{ color: visual.colors.primary }}>
                                <TrendingUp /> Strategy
                            </h3>
                            <div className="space-y-6">
                                {config.variables?.player_inputs.map(input => (
                                    <div key={input}>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{input.replace(/_/g, ' ')}</label>
                                        <input 
                                            type="range" 
                                            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                                            style={{ backgroundColor: '#e5e7eb', accentColor: visual.colors.primary }}
                                            value={sliderValues[input] || 50}
                                            onChange={(e) => setSliderValues({...sliderValues, [input]: parseInt(e.target.value)})}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shop */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100">
                            <h3 className="font-black text-xl mb-6 flex items-center gap-2" style={{ color: visual.colors.secondary }}>
                                <ShoppingCart /> Upgrades
                            </h3>
                            <div className="space-y-3">
                                {config.upgrade_tree.map(u => (
                                    <div key={u.id} className="flex justify-between items-center p-3 border rounded-xl">
                                        <div>
                                            <div className="font-bold text-gray-800">{u.name}</div>
                                            <div className="text-xs text-gray-400">{u.effect}</div>
                                        </div>
                                        <button 
                                            onClick={() => buyUpgrade(u)}
                                            disabled={upgrades.includes(u.id) || funds < u.cost}
                                            className={`px-3 py-1 rounded-lg font-bold text-sm ${upgrades.includes(u.id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {upgrades.includes(u.id) ? 'Owned' : `$${u.cost}`}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'SIMULATION' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                        <h2 className="text-3xl font-black text-gray-300">Simulating...</h2>
                        <div className="w-full max-w-md h-6 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div className="h-full" style={{ backgroundColor: visual.colors.primary, width: `${progress}%` }} />
                        </div>
                        {eventLog && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                                <AlertTriangle size={18} /> {eventLog}
                            </motion.div>
                        )}
                    </div>
                )}

                {phase === 'RESULT' && (
                    <div className="text-center py-10 space-y-6">
                        <h2 className="text-5xl font-black" style={{ color: dayStats.profit >= 0 ? '#16a34a' : '#dc2626' }}>
                            {dayStats.profit >= 0 ? '+' : ''}${dayStats.profit}
                        </h2>
                        <div className="flex justify-center gap-8">
                            <div className="text-center">
                                <div className="text-xs font-bold text-gray-400 uppercase">Revenue</div>
                                <div className="text-xl font-bold text-gray-800">${dayStats.revenue}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-gray-400 uppercase">Expenses</div>
                                <div className="text-xl font-bold text-gray-800">${dayStats.expenses}</div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-8">
                            <button onClick={onExit} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200">Save & Exit</button>
                            <button 
                                onClick={() => { setDay(d => d+1); setPhase('STRATEGY'); }}
                                className="px-8 py-3 rounded-xl font-black text-white shadow-lg btn-juicy"
                                style={{ backgroundColor: visual.colors.primary }}
                            >
                                Next Day
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Action Button (Strategy Phase) */}
        {phase === 'STRATEGY' && (
            <div className="p-4 bg-white border-t flex justify-center">
                <button 
                    onClick={startDay}
                    className="w-full max-w-md py-4 rounded-2xl font-black text-xl shadow-lg btn-juicy text-white flex items-center justify-center gap-3"
                    style={{ backgroundColor: visual.colors.primary }}
                >
                    <Play fill="currentColor" /> Start Day {day}
                </button>
            </div>
        )}
    </div>
  );
};

export default SimulationTemplate;
