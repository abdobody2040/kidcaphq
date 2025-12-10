
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, HelpCircle, CheckCircle2 } from 'lucide-react';

interface GameTutorialModalProps {
  onStart: () => void;
  title: string;
  description: string;
  instructions: string[];
  icon?: string;
  color?: string;
}

const GameTutorialModal: React.FC<GameTutorialModalProps> = ({ 
  onStart, 
  title, 
  description, 
  instructions, 
  icon = "🎮", 
  color = "bg-blue-600" 
}) => {
  // Safe Render helper
  const safeStr = (val: any) => {
      if (typeof val === 'string') return val;
      if (typeof val === 'number') return String(val);
      return '';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className={`${color} p-6 text-white text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.2) 2px, transparent 0)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10">
                <div className="text-6xl mb-4 drop-shadow-md animate-bounce">{safeStr(icon)}</div>
                <h2 className="text-3xl font-black uppercase tracking-tight">{safeStr(title)}</h2>
            </div>
        </div>

        <div className="p-8">
            {/* Description */}
            <div className="text-center mb-8">
                <p className="text-gray-600 font-medium text-lg leading-relaxed">{safeStr(description)}</p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HelpCircle size={14} /> How to Play
                </h3>
                <ul className="space-y-3">
                    {instructions.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700 font-bold text-sm">
                            <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                            {safeStr(step)}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action */}
            <button 
                onClick={onStart}
                className={`w-full py-4 rounded-xl font-black text-white text-xl shadow-lg btn-juicy flex items-center justify-center gap-3 transition-all hover:brightness-110 ${color}`}
            >
                <Play fill="currentColor" /> Start Game
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameTutorialModal;
