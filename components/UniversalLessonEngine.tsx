
import React, { useState, useEffect, useMemo } from 'react';
import { UniversalLessonUnit } from '../types';
import { useAppStore } from '../store';
import { getOwlyExplanation, chatWithOllie } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Coins, Zap, RotateCcw, Filter, Star, Info, AlertCircle, Loader2 } from 'lucide-react';
import ModuleRecap from './ModuleRecap';
import { useTranslation } from 'react-i18next';

interface EngineProps {
  units: UniversalLessonUnit[];
  onExit: () => void;
}

type Phase = 'LEARN' | 'CHALLENGE' | 'FEEDBACK' | 'COMPLETE';

const UniversalLessonEngine: React.FC<EngineProps> = ({ units, onExit }) => {
  // Global Store Access
  const { user, completeLesson } = useAppStore();
  const { t } = useTranslation();

  // Local State
  const [difficultyFilter, setDifficultyFilter] = useState<number | 'ALL'>('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
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
      if (difficultyFilter === 'ALL' && user) {
          const firstUnfinished = units.findIndex(u => !user.completedLessonIds.includes(u.id));
          if (firstUnfinished !== -1) setCurrentIndex(firstUnfinished);
      }
  }, []);

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
    // We only translate the text options here if needed, but usually options are dynamic.
    // For now, we use the raw strings, but you could wrap them in t() if they were static keys.
    const opts = [unit.challenge_payload.correct_answer, ...unit.challenge_payload.distractors];
    return opts.sort(() => Math.random() - 0.5);
  }, [unit]);

  // Helper: Translate Topic Tag
  const getTopicLabel = (tag: string) => {
      const map: Record<string, string> = {
          "Money Basics": "money_basics",
          "Entrepreneurship": "entrepreneurship",
          "Investing & Wealth": "investing_wealth",
          "Marketing": "marketing",
          "Leadership": "leadership",
          "Economics": "economics",
          "Technology": "technology",
          "Social Responsibility": "social_responsibility",
          "Global Business": "global_business",
          "Financial Smarts": "financial_smarts"
      };
      return t(map[tag] || tag);
  };

  // Handler: Advance Phase
  const handleNextPhase = () => {
    if (phase === 'LEARN') {
      setPhase('CHALLENGE');
    } else if (phase === 'FEEDBACK') {
      if (!isCorrect) return;

      if (unit && !user?.completedLessonIds.includes(unit.id)) {
          completeLesson(unit.id, unit.game_rewards.base_xp, unit.game_rewards.currency_value);
      }

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
      setSessionFunds(prev => prev + unit.game_rewards.currency_value);
      setSessionXP(prev => prev + unit.game_rewards.base_xp);
    } else {
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
    
    setTimeout(() => {
        setPhase('FEEDBACK');
    }, 1000);
  };
  
  // Handler: Key Term Click (AI Tutor)
  const handleTermClick = async (term: string) => {
      if (activeTooltip === term) {
          setActiveTooltip(null);
          return;
      }
      
      setActiveTooltip(term);
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
          case 1: return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
          case 2: return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
          case 3: return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
          default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
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

  // Render Body Text with Interactive Terms
  const renderBodyText = (text: string) => {
      // Split by bold markdown to find key terms
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
              const term = part.slice(2, -2);
              return (
                  <span key={index} className="relative inline-block whitespace-nowrap mx-1">
                      <motion.button
                          whileHover={{ scale: 1.05, color: "#b45309" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTermClick(term)}
                          className={`font-bold border-b-2 border-dashed border-yellow-400 cursor-pointer transition-colors px-1 rounded
                              ${activeTooltip === term ? 'bg-yellow-200 text-yellow-900' : 'text-gray-800 dark:text-white hover:bg-yellow-50 dark:hover:bg-gray-700'}`}
                      >
                          {term}
                      </motion.button>
                      
                      <AnimatePresence>
                          {activeTooltip === term && (
                              <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-gray-900 text-white text-sm p-4 rounded-2xl shadow-2xl z-50 text-center"
                              >
                                  <div className="flex items-center justify-center gap-2 mb-3 text-yellow-400 font-bold uppercase tracking-widest text-xs border-b border-gray-700 pb-2">
                                      <Info size={14} /> Ollie's Definition
                                  </div>
                                  <div className="font-medium leading-relaxed text-gray-200">
                                      {isLoadingExplanation ? (
                                          <div className="flex flex-col items-center justify-center py-4 gap-3">
                                              <Loader2 className="animate-spin text-yellow-400" size={24} />
                                              <span className="text-gray-400 text-xs font-bold">Asking the owl...</span>
                                          </div>
                                      ) : (
                                          aiExplanation || "Click to ask Ollie!"
                                      )}
                                  </div>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </span>
              );
          }
          return <span key={index}>{part}</span>;
      });
  };

  // Render Empty State (if filter yields no results)
  if (activeUnits.length === 0 && phase !== 'COMPLETE') {
      return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center">
                <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">No Lessons Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">There are no lessons with this difficulty level in this module.</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => setDifficultyFilter('ALL')} className="bg-blue-100 text-blue-700 px-6 py-2 rounded-xl font-bold hover:bg-blue-200">
                        Show All
                    </button>
                    <button onClick={onExit} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                        Exit
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // Loading state
  if (!unit && phase !== 'COMPLETE') return <div>Loading Data...</div>;

  // DYNAMIC TRANSLATION LOOKUP
  const translatedHeadline = unit ? t(`lesson_${unit.id}_title`, { defaultValue: unit.lesson_payload.headline }) : "";
  const translatedBody = unit ? t(`lesson_${unit.id}_body`, { defaultValue: unit.lesson_payload.body_text }) : "";
  const translatedQuestion = unit ? t(`lesson_${unit.id}_question`, { defaultValue: unit.challenge_payload.question_text }) : "";
  const translatedFlavor = unit ? t(`lesson_${unit.id}_flavor`, { defaultValue: unit.flavor_text }) : "";

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header: HUD */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center relative z-20">
            <div className="flex items-center gap-4">
                <button onClick={onExit} className="hover:bg-gray-700 p-2 rounded-full"><X size={20} /></button>
                
                {/* Topic & Filter */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-400 text-sm uppercase tracking-widest hidden sm:block">
                        {unit ? getTopicLabel(unit.topic_tag) : 'Mission Complete'}
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
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 overflow-hidden text-gray-800 dark:text-gray-200 py-1">
                                <button onClick={() => { setDifficultyFilter('ALL'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-bold">All Levels</button>
                                <button onClick={() => { setDifficultyFilter(1); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/30 text-sm font-bold text-green-600 dark:text-green-400">⭐ Easy</button>
                                <button onClick={() => { setDifficultyFilter(2); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 text-sm font-bold text-yellow-600 dark:text-yellow-400">⭐⭐ Medium</button>
                                <button onClick={() => { setDifficultyFilter(3); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm font-bold text-red-600 dark:text-red-400">⭐⭐⭐ Hard</button>
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
        <div className="h-2 bg-gray-200 dark:bg-gray-700 w-full">
            <motion.div 
                className="h-full bg-kid-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / activeUnits.length) * 100}%` }}
            />
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative bg-white dark:bg-gray-800">
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
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
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
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ 
                                    scale: 1, 
                                    opacity: 1, 
                                    y: [0, -5, 0],
                                    transition: {
                                        y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                                        opacity: { duration: 0.5 }
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                                src={unit.lesson_payload.image_url} 
                                alt="Lesson Visual" 
                                className={`w-full rounded-2xl shadow-sm border-2 border-gray-100 dark:border-gray-700 cursor-pointer bg-gray-50 dark:bg-gray-700 ${
                                    unit.lesson_payload.image_url.toLowerCase().endsWith('.gif') 
                                        ? 'h-auto max-h-64 object-contain' 
                                        : 'h-48 object-cover'
                                }`}
                            />
                        )}

                        <h2 className="text-3xl font-black text-gray-800 dark:text-white">{translatedHeadline}</h2>
                        
                        <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                            <p>{renderBodyText(translatedBody)}</p>
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
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 font-black text-xl">?</div>
                                <h3 className="text-gray-400 font-bold uppercase text-sm">Decision Required</h3>
                             </div>
                             {/* Small diff badge in challenge mode too */}
                             <div className="flex text-yellow-400">
                                {[...Array(unit.difficulty)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                             </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{translatedQuestion}</h2>

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
                                                ? 'bg-red-50 border-red-400 text-red-700 shake-animation dark:bg-red-900/30 dark:text-red-300' 
                                                : isRight
                                                    ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'}
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
                                    className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400 mb-4"
                                >
                                    <Check size={48} strokeWidth={4} />
                                </motion.div>
                                
                                <h2 className="text-3xl font-black text-gray-800 dark:text-white">Success!</h2>
                                <p className="text-xl text-gray-600 dark:text-gray-300 font-medium px-8">"{translatedFlavor}"</p>
                                
                                <div className="flex justify-center gap-4 py-4">
                                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 px-6 py-3 rounded-xl flex flex-col items-center">
                                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase">Revenue</span>
                                        <span className="text-2xl font-black text-gray-800 dark:text-white">+${unit.game_rewards.currency_value}</span>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-6 py-3 rounded-xl flex flex-col items-center">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Experience</span>
                                        <span className="text-2xl font-black text-gray-800 dark:text-white">+{unit.game_rewards.base_xp} XP</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4"
                                >
                                    <X size={48} strokeWidth={4} />
                                </motion.div>
                                
                                <h2 className="text-3xl font-black text-gray-800 dark:text-white">Mission Failed</h2>
                                <p className="text-lg text-gray-500 dark:text-gray-400 font-bold">Don't worry, even CEOs make mistakes.</p>
                                
                                {/* Specific Feedback: Correct Answer */}
                                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-800 p-4 rounded-xl mx-6 text-left flex items-start gap-3">
                                    <div className="bg-red-200 dark:bg-red-800 p-1 rounded-full text-red-600 dark:text-red-200 mt-1">
                                        <AlertCircle size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-red-500 dark:text-red-300 uppercase mb-1">Correct Answer</div>
                                        <div className="text-lg font-black text-gray-800 dark:text-white leading-tight">
                                            {unit.challenge_payload.correct_answer}
                                        </div>
                                    </div>
                                </div>

                                {/* AI Hint Bubble */}
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 p-4 rounded-xl mx-6 text-left flex items-start gap-3 mt-4 relative overflow-hidden">
                                    <div className="text-3xl relative z-10">🦉</div>
                                    <div className="flex-1 relative z-10">
                                        <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase mb-1">Ollie's Tip</div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-snug">
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
                                    <div className="absolute -bottom-4 -right-4 text-yellow-100 dark:text-yellow-900 opacity-50 rotate-12">
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
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end">
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
