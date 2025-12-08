
import React, { useState, useEffect, useMemo } from 'react';
import { UniversalLessonUnit } from '../types';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Coins, Zap } from 'lucide-react';
import ModuleRecap from './ModuleRecap';

interface EngineProps {
  units: UniversalLessonUnit[];
  onExit: () => void;
}

type Phase = 'LEARN' | 'CHALLENGE' | 'FEEDBACK' | 'COMPLETE';

const UniversalLessonEngine: React.FC<EngineProps> = ({ units, onExit }) => {
  // Global Store Access
  const { user, completeLesson } = useAppStore();

  // Engine State
  const [currentIndex, setCurrentIndex] = useState(() => {
      // Resume Logic: Find the first uncompleted lesson in this batch
      if (!user) return 0;
      const firstUnfinished = units.findIndex(u => !user.completedLessonIds.includes(u.id));
      // If all are finished (replay mode), start at 0. If some unfinished, start there.
      return firstUnfinished === -1 ? 0 : firstUnfinished;
  });

  const [phase, setPhase] = useState<Phase>('LEARN');
  
  // Session Stats (Visual only now, since rewards are saved incrementally)
  const [sessionFunds, setSessionFunds] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  
  // Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Load current unit
  const unit = units[currentIndex];

  // Helper: Shuffle answers (Fisher-Yates)
  const shuffledOptions = useMemo(() => {
    if (!unit) return [];
    const opts = [unit.challenge_payload.correct_answer, ...unit.challenge_payload.distractors];
    return opts.sort(() => Math.random() - 0.5);
  }, [unit]);

  // Handler: Advance Phase
  const handleNextPhase = () => {
    if (phase === 'LEARN') {
      setPhase('CHALLENGE');
    } else if (phase === 'FEEDBACK') {
      // Save progress for the unit we just finished
      if (unit && !user?.completedLessonIds.includes(unit.id)) {
          completeLesson(unit.id, unit.game_rewards.base_xp, unit.game_rewards.currency_value);
      }

      // Check if there are more units
      if (currentIndex < units.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setPhase('LEARN');
        setSelectedAnswer(null);
      } else {
        setPhase('COMPLETE');
      }
    }
  };

  // Handler: Answer Selection
  const handleAnswerSubmit = (answer: string) => {
    if (phase !== 'CHALLENGE') return;
    
    setSelectedAnswer(answer);
    const correct = answer === unit.challenge_payload.correct_answer;
    setIsCorrect(correct);

    if (correct) {
      // Add Rewards to Session Tracker (Visual)
      setSessionFunds(prev => prev + unit.game_rewards.currency_value);
      setSessionXP(prev => prev + unit.game_rewards.base_xp);
      // Play sound effect here ideally
      setPhase('FEEDBACK');
    }
  };

  if (!unit && phase !== 'COMPLETE') return <div>Loading Data...</div>;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header: HUD */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={onExit} className="hover:bg-gray-700 p-2 rounded-full"><X size={20} /></button>
                <span className="font-bold text-gray-400 text-sm uppercase tracking-widest">
                    {unit ? unit.topic_tag.replace(/_/g, ' ') : 'Mission Complete'}
                </span>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full text-yellow-400 font-mono font-bold">
                    <Coins size={16} /> ${sessionFunds}
                </div>
                <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full text-blue-400 font-mono font-bold">
                    <Zap size={16} /> {sessionXP} XP
                </div>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 w-full">
            <motion.div 
                className="h-full bg-kid-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex) / units.length) * 100}%` }}
            />
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative">
            <AnimatePresence mode="wait">
                
                {/* PHASE 1: LEARN */}
                {phase === 'LEARN' && (
                    <motion.div 
                        key="learn"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                            Briefing
                        </span>
                        <h2 className="text-3xl font-black text-gray-800">{unit.lesson_payload.headline}</h2>
                        <div className="text-lg text-gray-600 leading-relaxed space-y-4">
                            <p>
                                {unit.lesson_payload.key_term ? (
                                    unit.lesson_payload.body_text.split(unit.lesson_payload.key_term).map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <span className="bg-yellow-200 px-1 rounded font-bold text-gray-900 border-b-2 border-yellow-400">
                                                    {unit.lesson_payload.key_term}
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    unit.lesson_payload.body_text
                                )}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* PHASE 2: CHALLENGE */}
                {phase === 'CHALLENGE' && (
                    <motion.div 
                        key="challenge"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-black text-xl">?</div>
                             <h3 className="text-gray-400 font-bold uppercase text-sm">Decision Required</h3>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-800">{unit.challenge_payload.question_text}</h2>

                        <div className="grid grid-cols-1 gap-3">
                            {shuffledOptions.map((opt, idx) => {
                                const isSelected = selectedAnswer === opt;
                                const isWrong = isSelected && !isCorrect;
                                
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSubmit(opt)}
                                        className={`p-5 rounded-2xl border-2 text-left font-bold text-lg transition-all
                                            ${isWrong 
                                                ? 'bg-red-50 border-red-400 text-red-700 shake-animation' 
                                                : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'}
                                        `}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                         {selectedAnswer && !isCorrect && (
                            <div className="text-center text-red-500 font-bold animate-pulse">
                                Project Failed! Try another strategy.
                            </div>
                        )}
                    </motion.div>
                )}

                {/* PHASE 3: FEEDBACK (SUCCESS) */}
                {phase === 'FEEDBACK' && (
                    <motion.div 
                        key="feedback"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8 space-y-6"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
                            <Check size={48} strokeWidth={4} />
                        </div>
                        
                        <h2 className="text-3xl font-black text-gray-800">Success!</h2>
                        <p className="text-xl text-gray-600 font-medium px-8">"{unit.flavor_text}"</p>
                        
                        <div className="flex justify-center gap-4 py-4">
                            <div className="bg-yellow-50 border border-yellow-200 px-6 py-3 rounded-xl flex flex-col items-center">
                                <span className="text-xs font-bold text-yellow-600 uppercase">Revenue</span>
                                <span className="text-2xl font-black text-gray-800">+${unit.game_rewards.currency_value}</span>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 px-6 py-3 rounded-xl flex flex-col items-center">
                                <span className="text-xs font-bold text-blue-600 uppercase">Experience</span>
                                <span className="text-2xl font-black text-gray-800">+{unit.game_rewards.base_xp} XP</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* COMPLETE */}
                {phase === 'COMPLETE' && (
                    <ModuleRecap 
                        moduleTitle={units[0]?.topic_tag || "Module"} 
                        lessons={units} 
                        totalXp={sessionXP}
                        onClose={onExit}
                    />
                )}

            </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            {phase === 'LEARN' && (
                <button 
                    onClick={handleNextPhase}
                    className="flex items-center gap-2 bg-kid-accent text-white px-8 py-3 rounded-2xl font-black shadow-[0_4px_0_0_rgba(30,58,138,1)] btn-juicy"
                >
                    Start Challenge <ArrowRight size={20} />
                </button>
            )}
            {phase === 'FEEDBACK' && (
                <button 
                    onClick={handleNextPhase}
                    className="flex items-center gap-2 bg-kid-secondary text-white px-8 py-3 rounded-2xl font-black shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy"
                >
                    Next Unit <ArrowRight size={20} />
                </button>
            )}
        </div>

      </div>
      
      <style>{`
        .shake-animation {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default UniversalLessonEngine;
