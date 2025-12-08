
import React from 'react';
import { useAppStore } from '../store';
import { UniversalLessonUnit } from '../types';
import { motion } from 'framer-motion';
import { Check, Trophy, Star, ArrowRight, Share2, Download } from 'lucide-react';

interface ModuleRecapProps {
  moduleTitle: string;
  lessons: UniversalLessonUnit[];
  totalXp: number;
  onClose: () => void;
}

const ModuleRecap: React.FC<ModuleRecapProps> = ({ moduleTitle, lessons, totalXp, onClose }) => {
  const { user } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-3xl shadow-xl border-4 border-yellow-400 max-w-md w-full text-center relative overflow-hidden"
            >
                {/* Certificate Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#F59E0B 2px, transparent 2px)', backgroundSize: '20px 20px' }} 
                />

                <div className="relative z-10">
                    <motion.div 
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6"
                    >
                        Certificate of Completion
                    </motion.div>

                    <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-4 border-white">
                        <Trophy size={48} className="text-yellow-900" />
                    </div>

                    <h2 className="text-3xl font-black text-gray-800 mb-2">{moduleTitle}</h2>
                    <p className="text-gray-500 font-bold mb-8">Mastered by {user?.name || 'Future CEO'}</p>

                    <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase">Key Takeaways</h3>
                        {lessons.slice(0, 3).map((lesson, idx) => (
                            <div key={lesson.id} className="flex items-start gap-3">
                                <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1 min-w-[20px] h-[20px] flex items-center justify-center">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                                <span className="text-sm font-bold text-gray-700 leading-tight">
                                    {lesson.lesson_payload.headline}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-8 mb-8 border-t border-gray-100 pt-6">
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase">Total XP</div>
                            <div className="text-3xl font-black text-blue-600">+{totalXp}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase">Skill Rating</div>
                            <div className="flex text-yellow-400 gap-1 mt-1">
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50">
                            <Download size={18} /> Save
                        </button>
                        <button className="py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50">
                            <Share2 size={18} /> Share
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="p-4 bg-white border-t border-gray-200 flex justify-center">
            <button 
                onClick={onClose}
                className="bg-kid-secondary text-white px-12 py-4 rounded-2xl font-black shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy flex items-center gap-2 text-xl hover:bg-green-600"
            >
                Continue Journey <ArrowRight size={24} />
            </button>
        </div>
    </div>
  );
};

export default ModuleRecap;
