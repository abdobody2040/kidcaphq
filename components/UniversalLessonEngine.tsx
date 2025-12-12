
import React, { useState, useEffect, useMemo } from 'react';
import { UniversalLessonUnit } from '../types';
import { useAppStore } from '../store';
import { getOwlyExplanation, chatWithOllie } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Coins, Zap, RotateCcw, Filter, Star, Info, AlertCircle, Loader2 } from 'lucide-react';
import ModuleRecap from './ModuleRecap';

interface EngineProps {
  units: UniversalLessonUnit[];
  onExit: () => void;
}

type Phase = 'LEARN' | 'CHALLENGE' | 'FEEDBACK' | 'COMPLETE';

const UniversalLessonEngine: React.FC<EngineProps> = ({ units, onExit }) => {
  // Global Store Access
  const { user, completeLesson } = useAppStore();

  // Local State
  const [difficultyFilter, setDifficultyFilter] = useState<number | 'ALL'>('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  
  // AI Tutor State (Tooltip)
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(false);

  // AI Feedback State (Wrong Answers)
  const [feedbackHint, setFeedbackHint] = useState<string>('');
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);

  // Filter Logic
  const activeUnits = useMemo(() => {
      if (difficultyFilter === 'ALL') return units;
      return units.filter(u => u.difficulty === difficultyFilter);
  }, [units, difficultyFilter]);

  // Engine State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('LEARN');
  
  // Reset index when filter changes to avoid out of bounds
  useEffect(() => {
      setCurrentIndex(0);
      setPhase('LEARN');
  }, [difficultyFilter]);

  // Reset transient UI states when phase or index changes
  useEffect(() => {
      setActiveTooltip(null);
      setAiExplanation('');
      // Only clear feedback hint when starting a new learning phase (retry or next)
      // This preserves the hint during the transition from CHALLENGE to FEEDBACK
      if (phase === 'LEARN') {
          setFeedbackHint('');
          setIsLoadingHint(false);
      }
  }, [currentIndex, phase]);

  // Initialize index on mount (only once)
  useEffect(() => {
      // Find first unfinished lesson in the *full* set initially, 
      // but if we filter later, we reset to 0. 
      // This logic is a bit complex with filtering, so we'll keep it simple:
      // If no filter, jump to first unfinished.
      if (difficultyFilter === 'ALL' && user) {
          const firstUnfinished = units.findIndex(u => !user.completedLessonIds.includes(u.id));
          if (firstUnfinished !== -1) setCurrentIndex(firstUnfinished);
      }
  }, []); // Empty dependency array ensures this runs once on mount

  // Session Stats (Visual only now, since rewards are saved incrementally)
  const [sessionFunds, setSessionFunds] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  
  // Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Load current unit
  const unit = activeUnits[currentIndex];

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
      // Only advance if correct. If incorrect, we shouldn't be calling this (Retry button used instead)
      if (!isCorrect) return;

      // Save progress for the unit we just finished
      if (unit && !user?.completedLessonIds.includes(unit.id)) {
          completeLesson(unit.id, unit.game_rewards.base_xp, unit.game_rewards.currency_value);
      }

      // Check if there are more units
      if (currentIndex < activeUnits.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setPhase('LEARN');
        setSelectedAnswer(null);
        setIsCorrect(false);
      } else {
        setPhase('COMPLETE');
      }
    }
  };

  const handleRetryLesson = () => {
      setPhase('LEARN');
      setSelectedAnswer(null);
      setIsCorrect(false);
  };

  // Handler: Answer Selection
  const handleAnswerSubmit = async (answer: string) => {
    if (phase !== 'CHALLENGE') return;
    if (selectedAnswer) return; // Prevent multi-click
    
    setSelectedAnswer(answer);
    const correct = answer === unit.challenge_payload.correct_answer;
    setIsCorrect(correct);

    if (correct) {
      // Add Rewards to Session Tracker (Visual)
      setSessionFunds(prev => prev + unit.game_rewards.currency_value);
      setSessionXP(prev => prev + unit.game_rewards.base_xp);
    } else {
        // Trigger AI Feedback for wrong answer
        setIsLoadingHint(true);
        try {
            const query = `I answered "${answer}" to the question "${unit.challenge_payload.question_text}". The correct answer was "${unit.challenge_payload.correct_answer}". Explain why I was wrong or help me understand the correct answer in 1-2 simple sentences for a kid.`;
            const hint = await chatWithOllie([], query);
            setFeedbackHint(hint);
        } catch (e) {
            console.error("AI Feedback Error:", e);
            setFeedbackHint("Oops! I couldn't load the hint, but try reading the briefing again.");
        } finally {
            setIsLoadingHint(false);
        }
    }
    
    // Delay feedback transition so user sees the result color
    setTimeout(() => {
        setPhase('FEEDBACK');
    }, 1000);
  };
  
  // Handler: Key Term Click (AI Tutor)
  const handleTermClick = async (index: number, term: string) => {
      if (activeTooltip === index) {
          setActiveTooltip(null);
          return;
      }
      
      setActiveTooltip(index);
      setAiExplanation('');
      setIsLoadingExplanation(true);
      
      try {
          const explanation = await getOwlyExplanation(term);
          setAiExplanation(explanation);
      } catch (error) {
          console.error("AI Error:", error);
          setAiExplanation("Ollie is taking a nap. Try again later!");
      } finally {
          setIsLoadingExplanation(false);
      }
  };

  // Helpers for Difficulty UI
  const getDifficultyColor = (level: number) => {
      switch(level) {
          case 1: return 'bg-green-100 text-green-700 border-green-200';
          case 2: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 3: return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
  };

  const getDifficultyLabel = (level: number) => {
      switch(level) {
          case 1: return 'Easy';
          case 2: return 'Medium';
          case 3: return 'Hard';
          default: return '';
      }
  };

  // Safe Render Helpers
  const safeStr = (val: any) => typeof val === 'string' ? val : '';

  // Render Empty State (if filter yields no results)
  if (activeUnits.length === 0 && phase !== 'COMPLETE') {
      return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
                <h3 className="text-2xl font-black text-gray-800 mb-2">No Lessons Found</h3>
                <p className="text-gray-500 mb-6">There are no lessons with this difficulty level in this module.</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => setDifficultyFilter('ALL')} className="bg-blue-100 text-blue-700 px-6 py-2 rounded-xl font-bold hover:bg-blue-200">
                        Show All
                    </button>
                    <button onClick={onExit} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold hover:bg-gray-200">
                        Exit
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // Loading state
  if (!unit && phase !== 'COMPLETE') return <div>Loading Data...</div>;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header: HUD */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center relative z-20">
            <div className="flex items-center gap-4">
                <button onClick={onExit} className="hover:bg-gray-700 p-2 rounded-full"><X size={20} /></button>
                
                {/* Topic & Filter */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-400 text-sm uppercase tracking-widest hidden sm:block">
                        {unit ? String(unit.topic_tag).replace(/_/g, ' ') : 'Mission Complete'}
                    </span>
                    
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                        >
                            <Filter size={14} />
                            {difficultyFilter === 'ALL' ? 'All Levels' : `Level ${difficultyFilter}`}
                        </button>
                        
                        {showFilterMenu && (
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 py-1">
                                <button onClick={() => { setDifficultyFilter('ALL'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-bold">All Levels</button>
                                <button onClick={() => { setDifficultyFilter(1); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm font-bold text-green-600">⭐ Easy</button>
                                <button onClick={() => { setDifficultyFilter(2); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-sm font-bold text-yellow-600">⭐⭐ Medium</button>
                                <button onClick={() => { setDifficultyFilter(3); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-bold text-red-600">⭐⭐⭐ Hard</button>
                            </div>
                        )}
                    </div>
                </div>
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
                animate={{ width: `${((currentIndex + 1) / activeUnits.length) * 100}%` }}
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
                        <div className="flex items-center justify-between">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                                Briefing
                            </span>
                            {/* Difficulty Badge */}
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getDifficultyColor(unit.difficulty)}`}>
                                <div className="flex">
                                    {[...Array(unit.difficulty)].map((_, i) => (
                                        <Star key={i} size={12} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-xs font-black uppercase ml-1">{getDifficultyLabel(unit.difficulty)}</span>
                            </div>
                        </div>
                        
                        {unit.lesson_payload.image_url && (
                            <motion.img 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4 }}
                                src={unit.lesson_payload.image_url} 
                                alt="Lesson Visual" 
                                className={`w-full rounded-2xl shadow-sm border-2 border-gray-100 cursor-pointer bg-gray-50 ${
                                    unit.lesson_payload.image_url.toLowerCase().endsWith('.gif') 
                                        ? 'h-auto max-h-64 object-contain' 
                                        : 'h-48 object-cover'
                                }`}
                            />
                        )}

                        <h2 className="text-3xl font-black text-gray-800">{safeStr(unit.lesson_payload.headline)}</h2>
                        
                        <div className="text-lg text-gray-600 leading-relaxed space-y-4">
                            <p>
                                {unit.lesson_payload.key_term && typeof unit.lesson_payload.body_text === 'string' ? (
                                    unit.lesson_payload.body_text.split(unit.lesson_payload.key_term).map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <span className="relative inline-block">
                                                    <motion.span 
                                                        whileHover={{ scale: 1.05, backgroundColor: "#fef08a" }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleTermClick(i, unit.lesson_payload.key_term!)}
                                                        className="bg-yellow-200 px-1 rounded font-bold text-gray-900 border-b-2 border-yellow-400 cursor-pointer transition-colors"
                                                    >
                                                        {unit.lesson_payload.key_term}
                                                    </motion.span>
                                                    
                                                    {/* Tooltip */}
                                                    <AnimatePresence>
                                                        {activeTooltip === i && (
                                                            <motion.div 
                                                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-800 text-white text-xs p-3 rounded-xl shadow-xl z-50 text-center"
                                                            >
                                                                <div className="flex items-center justify-center gap-1 mb-2 text-yellow-400 font-bold uppercase tracking-wide">
                                                                    <Info size={12} /> Key Concept
                                                                </div>
                                                                <div className="font-medium text-sm leading-snug">
                                                                    {isLoadingExplanation ? (
                                                                        <div className="flex flex-col items-center justify-center py-2 gap-2">
                                                                            <Loader2 className="animate-spin text-yellow-400" size={20} />
                                                                            <span className="text-gray-300">Ollie is thinking...</span>
                                                                        </div>
                                                                    ) : (
                                                                        aiExplanation || "Click to ask Ollie!"
                                                                    )}
                                                                </div>
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    safeStr(unit.lesson_payload.body_text)
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
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-black text-xl">?</div>
                                <h3 className="text-gray-400 font-bold uppercase text-sm">Decision Required</h3>
                             </div>
                             {/* Small diff badge in challenge mode too */}
                             <div className="flex text-yellow-400">
                                {[...Array(unit.difficulty)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                             </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-800">{safeStr(unit.challenge_payload.question_text)}</h2>

                        <div className="grid grid-cols-1 gap-3">
                            {shuffledOptions.map((opt, idx) => {
                                const isSelected = selectedAnswer === opt;
                                const isWrong = isSelected && !isCorrect;
                                const isRight = isSelected && isCorrect;
                                
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSubmit(opt)}
                                        disabled={!!selectedAnswer}
                                        className={`p-5 rounded-2xl border-2 text-left font-bold text-lg transition-all
                                            ${isWrong 
                                                ? 'bg-red-50 border-red-400 text-red-700 shake-animation' 
                                                : isRight
                                                    ? 'bg-green-50 border-green-400 text-green-700'
                                                    : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'}
                                        `}
                                    >
                                        {safeStr(opt)}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* PHASE 3: FEEDBACK */}
                {phase === 'FEEDBACK' && (
                    <motion.div 
                        key="feedback"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8 space-y-6"
                    >
                        {isCorrect ? (
                            <>
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4"
                                >
                                    <Check size={48} strokeWidth={4} />
                                </motion.div>
                                
                                <h2 className="text-3xl font-black text-gray-800">Success!</h2>
                                <p className="text-xl text-gray-600 font-medium px-8">"{safeStr(unit.flavor_text)}"</p>
                                
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
                            </>
                        ) : (
                            <>
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4"
                                >
                                    <X size={48} strokeWidth={4} />
                                </motion.div>
                                
                                <h2 className="text-3xl font-black text-gray-800">Mission Failed</h2>
                                <p className="text-lg text-gray-500 font-bold">Don't worry, even CEOs make mistakes.</p>
                                
                                {/* Specific Feedback: Correct Answer */}
                                <div className="bg-red-50 border-2 border-red-100 p-4 rounded-xl mx-6 text-left flex items-start gap-3">
                                    <div className="bg-red-200 p-1 rounded-full text-red-600 mt-1">
                                        <AlertCircle size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-red-500 uppercase mb-1">Correct Answer</div>
                                        <div className="text-lg font-black text-gray-800 leading-tight">
                                            {unit.challenge_payload.correct_answer}
                                        </div>
                                    </div>
                                </div>

                                {/* AI Hint Bubble */}
                                <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl mx-6 text-left flex items-start gap-3 mt-4 relative overflow-hidden">
                                    <div className="text-3xl relative z-10">🦉</div>
                                    <div className="flex-1 relative z-10">
                                        <div className="text-xs font-bold text-yellow-600 uppercase mb-1">Ollie's Tip</div>
                                        <div className="text-sm font-medium text-gray-700 leading-snug">
                                            {isLoadingHint ? (
                                                <span className="flex items-center gap-2 text-gray-500">
                                                    <Loader2 className="animate-spin text-yellow-500" size={16} /> Ollie is analyzing your answer...
                                                </span>
                                            ) : (
                                                feedbackHint || "Review the briefing and give it another shot! You got this!"
                                            )}
                                        </div>
                                    </div>
                                    {/* Decor */}
                                    <div className="absolute -bottom-4 -right-4 text-yellow-100 opacity-50 rotate-12">
                                        <Info size={100} />
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 font-bold mt-4">Review the lesson briefing and try again!</p>
                            </>
                        )}
                    </motion.div>
                )}

                {/* COMPLETE */}
                {phase === 'COMPLETE' && (
                    <ModuleRecap 
                        moduleTitle={units[0]?.topic_tag || "Module"} 
                        lessons={activeUnits} 
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
                isCorrect ? (
                    <button 
                        onClick={handleNextPhase}
                        className="flex items-center gap-2 bg-kid-secondary text-white px-8 py-3 rounded-2xl font-black shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy"
                    >
                        Next Unit <ArrowRight size={20} />
                    </button>
                ) : (
                    <button 
                        onClick={handleRetryLesson}
                        className="flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-2xl font-black shadow-[0_4px_0_0_rgba(194,65,12,1)] btn-juicy hover:bg-orange-600"
                    >
                        <RotateCcw size={20} /> Retry Lesson
                    </button>
                )
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
