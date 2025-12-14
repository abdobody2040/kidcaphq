
import React from 'react';
import { useAppStore } from '../store';
import { UniversalLessonUnit } from '../types';
import { motion } from 'framer-motion';
import { Check, Trophy, Star, ArrowRight, Share2, Download, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModuleRecapProps {
  moduleTitle: string;
  lessons: UniversalLessonUnit[];
  totalXp: number;
  onClose: () => void;
}

const ModuleRecap: React.FC<ModuleRecapProps> = ({ moduleTitle, lessons, totalXp, onClose }) => {
  const { user } = useAppStore();
  const { t } = useTranslation();

  const handleDownloadCertificate = () => {
      // Trigger browser print dialog. 
      // The CSS @media print rule in styles.css will hide everything 
      // except the #certificate-area div.
      window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
  });

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
                                    {t(`lesson_${lesson.id}_title`, { defaultValue: lesson.lesson_payload.headline })}
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
                        <button 
                            onClick={handleDownloadCertificate}
                            className="py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-kid-accent hover:border-kid-accent transition-colors"
                        >
                            <Download size={18} /> Download
                        </button>
                        <button className="py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 cursor-not-allowed opacity-50">
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

        {/* 
            HIDDEN PRINTABLE CERTIFICATE 
            This section is hidden via CSS (display:none) normally, 
            but visible via @media print in styles.css 
        */}
        <div id="certificate-area" className="hidden">
            <div className="w-[1000px] h-[700px] border-[20px] border-double border-yellow-500 p-10 relative bg-white text-center flex flex-col justify-between items-center" style={{ fontFamily: 'Cinzel, serif' }}>
                
                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-yellow-600"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-yellow-600"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-yellow-600"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-yellow-600"></div>

                {/* Header */}
                <div className="mt-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center font-black text-2xl" style={{ fontFamily: 'Nunito, sans-serif' }}>K</div>
                        <h1 className="text-3xl font-bold text-gray-500 uppercase tracking-[0.3em]">KidCap HQ</h1>
                    </div>
                    <h2 className="text-6xl font-bold text-gray-900 mt-4 mb-2">Certificate of Completion</h2>
                    <p className="text-xl text-gray-500 italic">This certifies that</p>
                </div>

                {/* Name */}
                <div className="border-b-2 border-gray-400 w-2/3 mx-auto px-10 py-2">
                    <h3 className="text-5xl font-bold text-blue-900" style={{ fontFamily: 'Cursive, serif' }}>{user?.name || 'Future CEO'}</h3>
                </div>

                {/* Description */}
                <div>
                    <p className="text-xl text-gray-500 italic mb-2">Has successfully mastered the module</p>
                    <h3 className="text-4xl font-bold text-gray-800 uppercase tracking-wide">{moduleTitle}</h3>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                        Demonstrating exceptional skills in Entrepreneurship, Financial Literacy, and Leadership.
                    </p>
                </div>

                {/* Footer / Seal */}
                <div className="w-full flex justify-between items-end px-20 mb-10">
                    <div className="text-center">
                        <div className="border-b border-gray-400 w-48 mb-2"></div>
                        <p className="font-bold text-gray-500 uppercase text-sm">Instructor Signature</p>
                    </div>

                    <div className="relative">
                        <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg relative z-10">
                            <div className="w-28 h-28 border-2 border-dashed border-yellow-200 rounded-full flex items-center justify-center">
                                <Trophy size={48} />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-40 h-10 bg-blue-700 z-0"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-40 h-10 bg-blue-700 rotate-45 z-0"></div>
                    </div>

                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-800 mb-1">{currentDate}</p>
                        <div className="border-b border-gray-400 w-48 mb-2"></div>
                        <p className="font-bold text-gray-500 uppercase text-sm">Date Awarded</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default ModuleRecap;
