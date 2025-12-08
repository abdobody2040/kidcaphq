import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { Star, X } from 'lucide-react';

const LevelUpModal: React.FC = () => {
  const { showLevelUpModal, levelUpData, closeLevelUpModal } = useAppStore();

  if (!showLevelUpModal || !levelUpData) return null;

  return (
    <AnimatePresence>
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
            <motion.div 
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl"
            >
                {/* Background Rays */}
                <div className="absolute inset-0 bg-yellow-50 z-0" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute -top-20 -left-20 w-[150%] h-[150%] bg-[conic-gradient(from_90deg_at_50%_50%,#FFC800_0deg,transparent_60deg,transparent_300deg,#FFC800_360deg)] opacity-20 z-0 pointer-events-none"
                />

                <div className="relative z-10">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-kid-secondary font-black text-2xl uppercase tracking-widest mb-2"
                    >
                        Level Up!
                    </motion.div>

                    <div className="relative w-32 h-32 mx-auto mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                            className="w-full h-full bg-kid-primary rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-inner"
                        >
                            <span className="text-6xl font-black text-white drop-shadow-md">{levelUpData.level}</span>
                        </motion.div>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.2 }}
                            transition={{ delay: 0.6 }}
                            className="absolute -top-2 -right-2 bg-kid-accent text-white p-2 rounded-full border-2 border-white"
                        >
                            <Star size={24} fill="currentColor" />
                        </motion.div>
                    </div>

                    <h3 className="text-gray-800 font-bold text-lg mb-6">
                        You're now a Level {levelUpData.level} Entrepreneur!
                    </h3>

                    <button 
                        onClick={closeLevelUpModal}
                        className="w-full bg-kid-secondary hover:bg-green-600 text-white font-black py-3 rounded-2xl shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy"
                    >
                        Awesome!
                    </button>
                </div>
            </motion.div>
        </div>
    </AnimatePresence>
  );
};

export default LevelUpModal;