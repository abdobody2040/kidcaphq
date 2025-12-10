
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { BusinessSimulation, VisualConfig } from '../../types';
import { motion } from 'framer-motion';
import { Zap, MousePointer2, LogOut } from 'lucide-react';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

const ClickerTemplate: React.FC<Props> = ({ config, onExit }) => {
  const { completeGame } = useAppStore();
  const [score, setScore] = useState(0);
  const [clickValue, setClickValue] = useState(config.game_mechanics?.click_value || 1);
  const [autoRate, setAutoRate] = useState(config.game_mechanics?.auto_click_rate || 0);
  const [upgrades, setUpgrades] = useState<string[]>([]);

  const handleExit = () => {
      // Award 1 coin per 10 points
      const coins = Math.floor(score / 10);
      const xp = Math.floor(score / 20);
      completeGame(coins, xp);
      onExit();
  };

  // Auto-clicker loop
  useEffect(() => {
      if (autoRate <= 0) return;
      const timer = setInterval(() => {
          setScore(s => s + autoRate);
      }, 1000);
      return () => clearInterval(timer);
  }, [autoRate]);

  const handleClick = () => {
      setScore(s => s + clickValue);
  };

  const buyUpgrade = (u: any) => {
      if (score >= u.cost) {
          setScore(s => s - u.cost);
          setUpgrades([...upgrades, u.id]);
          
          // Apply Modifiers
          if (u.modifier_target === 'click_value') setClickValue(v => v + (u.modifier_value || 0));
          if (u.modifier_target === 'auto_click_rate') setAutoRate(v => v + (u.modifier_value || 0));
      }
  };

  const visual: VisualConfig = config.visual_config || { 
      theme: 'dark', 
      colors: { primary: '#3B82F6', secondary: '#1E3A8A', accent: '#10B981', background: '#0F172A' },
      icon: '👆'
  };

  // Helper to safely render potential objects
  const safeRender = (content: any) => {
    if (typeof content === 'string' || typeof content === 'number') return content;
    return JSON.stringify(content);
  };

  // Safe array access
  const upgradeTree = Array.isArray(config.upgrade_tree) ? config.upgrade_tree : [];

  return (
    <div className="h-full flex flex-col text-white" style={{ backgroundColor: visual.colors.background }}>
        <div className="absolute top-4 right-4 z-20">
            <button onClick={handleExit} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
                <LogOut size={16} /> Save & Exit
            </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Main Click Area */}
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
                className="w-64 h-64 rounded-full flex items-center justify-center text-8xl shadow-[0_0_50px_rgba(255,255,255,0.2)] border-8 border-white/10 relative z-10"
                style={{ backgroundColor: visual.colors.secondary }}
            >
                {visual.icon || '👆'}
            </motion.button>

            <div className="mt-12 text-center">
                <h2 className="text-6xl font-black mb-2">{Math.floor(score)}</h2>
                <p className="text-white/50 font-bold uppercase tracking-widest text-sm">Lines of Code / Assets</p>
                <div className="flex justify-center gap-6 mt-4 text-sm font-bold text-white/70">
                    <span className="flex items-center gap-1"><MousePointer2 size={14}/> {clickValue} / click</span>
                    <span className="flex items-center gap-1"><Zap size={14}/> {autoRate} / sec</span>
                </div>
            </div>
        </div>

        {/* Upgrades Panel */}
        <div className="h-1/3 bg-white/5 border-t border-white/10 p-6 overflow-y-auto">
            <h3 className="font-bold text-white/80 mb-4 uppercase text-xs tracking-widest">Available Upgrades</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upgradeTree.length === 0 && <div className="text-white/30 text-sm">No upgrades configured.</div>}
                {upgradeTree.map(u => (
                    <button 
                        key={u.id}
                        disabled={score < u.cost}
                        onClick={() => buyUpgrade(u)}
                        className={`p-4 rounded-xl border border-white/10 text-left transition-all
                            ${score >= u.cost ? 'bg-white/10 hover:bg-white/20' : 'opacity-50 cursor-not-allowed'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold">{safeRender(u.name)}</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono">{u.cost}</span>
                        </div>
                        <div className="text-xs text-white/50">{safeRender(u.effect)}</div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ClickerTemplate;
