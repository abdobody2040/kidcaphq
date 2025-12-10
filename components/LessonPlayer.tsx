
import React, { useState } from 'react';
import { Lesson, SlideType } from '../types';
import { useAppStore } from '../store';
import { getOwlyExplanation } from '../services/geminiService';
import { Check, X, HelpCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample Lesson Data
const SAMPLE_LESSON: Lesson = {
  id: 'lesson_1_1',
  moduleId: 'mod_1',
  title: 'What is Money?',
  description: 'Learn about the history of money and why we use it.',
  xpReward: 50,
  slides: [
    {
      id: 's1',
      type: SlideType.INTRO,
      content: 'Welcome to KidCap HQ! Today we are going to learn a super power: **Understanding Money**.',
      imagePlaceholder: 'https://picsum.photos/400/300?random=1'
    },
    {
      id: 's2',
      type: SlideType.INFO,
      content: 'Long ago, people didn’t have coins or dollar bills. They used **Bartering**. This means trading one thing for another. Like trading a sheep for a bag of wheat!',
      imagePlaceholder: 'https://picsum.photos/400/300?random=2'
    },
    {
      id: 's3',
      type: SlideType.QUIZ,
      content: 'If you trade your lunch apple for your friend’s cookie, what is that called?',
      options: ['Banking', 'Bartering', 'Stealing', 'Investing'],
      correctAnswer: 'Bartering'
    },
    {
      id: 's4',
      type: SlideType.REWARD,
      content: 'Great Job! You now know the basics of trade.',
    }
  ]
};

interface LessonPlayerProps {
  onExit: () => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ onExit }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [owlyTip, setOwlyTip] = useState<string>('');
  const { completeLesson } = useAppStore();

  const slide = SAMPLE_LESSON.slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / SAMPLE_LESSON.slides.length) * 100;

  const handleNext = () => {
    if (currentSlideIndex < SAMPLE_LESSON.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowExplanation(false);
      setOwlyTip('');
    } else {
      completeLesson(SAMPLE_LESSON.id);
      onExit();
    }
  };

  const handleOptionClick = (option: string) => {
    if (isCorrect !== null) return; // Prevent changing after answer
    setSelectedOption(option);
    const correct = option === slide.correctAnswer;
    setIsCorrect(correct);
  };

  const askOwly = async () => {
    setOwlyTip("Ollie is thinking...");
    setShowExplanation(true);
    const tip = await getOwlyExplanation(slide.content.substring(0, 50) + "...", 8);
    setOwlyTip(tip);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header / Progress */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
            <button onClick={onExit} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
            <div className="flex-1 mx-4 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-kid-secondary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="text-kid-secondary font-black">{currentSlideIndex + 1}/{SAMPLE_LESSON.slides.length}</div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    {slide.type === SlideType.REWARD ? (
                        <div className="text-center py-10">
                            <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                className="inline-block p-6 bg-yellow-100 rounded-full mb-6"
                            >
                                <Trophy size={64} className="text-yellow-500" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-gray-800 mb-2">Lesson Complete!</h2>
                            <p className="text-xl text-gray-600 mb-6">You earned {SAMPLE_LESSON.xpReward} XP!</p>
                            <button 
                                onClick={handleNext}
                                className="w-full bg-kid-secondary hover:bg-green-600 text-white font-black py-4 px-8 rounded-2xl shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy text-xl"
                            >
                                Continue
                            </button>
                        </div>
                    ) : (
                        <>
                            {slide.imagePlaceholder && (
                                <img 
                                    src={slide.imagePlaceholder} 
                                    alt="Lesson illustration" 
                                    className="w-full h-48 object-cover rounded-2xl mb-4 border-4 border-gray-100"
                                />
                            )}
                            
                            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
                                {slide.content.split('**').map((part, i) => 
                                    i % 2 === 1 ? <span key={i} className="text-kid-accent">{part}</span> : part
                                )}
                            </h2>

                            {/* Quiz Interface */}
                            {slide.type === SlideType.QUIZ && slide.options && (
                                <div className="grid grid-cols-1 gap-3 mt-6">
                                    {slide.options.map((opt) => {
                                        let btnClass = "bg-white border-gray-200 text-gray-600 hover:bg-gray-50";
                                        if (selectedOption === opt) {
                                            if (isCorrect) btnClass = "bg-green-100 border-green-400 text-green-700";
                                            else btnClass = "bg-red-100 border-red-400 text-red-700";
                                        }
                                        return (
                                            <button
                                                key={opt}
                                                onClick={() => handleOptionClick(opt)}
                                                className={`w-full p-4 rounded-xl border-2 font-bold text-left transition-all ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Feedback Message */}
                            {isCorrect !== null && (
                                <div className={`p-4 rounded-xl mt-4 font-bold flex items-center gap-3 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {isCorrect ? <Check size={24} /> : <X size={24} />}
                                    {isCorrect ? "Correct! Amazing job!" : "Oops! Try again."}
                                </div>
                            )}

                             {/* AI Helper */}
                             {!isCorrect && (
                                <div className="mt-6 border-t pt-4">
                                   <button 
                                      onClick={askOwly}
                                      className="flex items-center gap-2 text-kid-accent font-bold hover:underline"
                                    >
                                        <div className="bg-kid-accent text-white p-1 rounded-full"><HelpCircle size={16}/></div>
                                        Ask Ollie for help
                                    </button>
                                    {showExplanation && (
                                        <div className="mt-3 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 flex gap-3">
                                            <div className="text-2xl">🦉</div>
                                            <p className="text-sm font-semibold">{owlyTip}</p>
                                        </div>
                                    )}
                                </div>
                             )}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Footer */}
        {slide.type !== SlideType.REWARD && (
             <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={slide.type === SlideType.QUIZ && !isCorrect}
                    className={`
                        px-8 py-3 rounded-2xl font-black text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.1)] btn-juicy transition-all
                        ${(slide.type === SlideType.QUIZ && !isCorrect) 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                            : 'bg-kid-secondary text-white shadow-[0_4px_0_0_rgba(21,128,61,1)] hover:bg-green-600'}
                    `}
                >
                    {slide.type === SlideType.QUIZ && !isCorrect ? 'Choose Answer' : 'Continue'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;
