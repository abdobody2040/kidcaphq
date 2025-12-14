
import React, { useRef, useState } from 'react';
import { useAppStore } from '../store';
import { UniversalLessonUnit } from '../types';
import { motion } from 'framer-motion';
import { Check, Trophy, Star, ArrowRight, Share2, Download, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ModuleRecapProps {
  moduleTitle: string;
  lessons: UniversalLessonUnit[];
  totalXp: number;
  onClose: () => void;
}

const ModuleRecap: React.FC<ModuleRecapProps> = ({ moduleTitle, lessons, totalXp, onClose }) => {
  const { user } = useAppStore();
  const { t } = useTranslation();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadCertificate = async () => {
      if (!certificateRef.current) return;
      setIsGenerating(true);

      try {
          const canvas = await html2canvas(certificateRef.current, {
              scale: 2, // Higher quality
              useCORS: true, // Handle cross-origin images
              logging: false,
              backgroundColor: '#ffffff'
          });

          const imgData = canvas.toDataURL('image/png');
          
          // PDF dimensions (A4 landscape)
          const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4'
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`KidCap_Certificate_${moduleTitle.replace(/\s+/g, '_')}.pdf`);
      } catch (error) {
          console.error("Certificate generation failed:", error);
          alert("Oops! Could not generate certificate. Please try again.");
      } finally {
          setIsGenerating(false);
      }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-3xl shadow-xl border-4 border-yellow-400 max-w-md w-full text-center relative overflow-hidden"
            >
                {/* Visual Background Pattern */}
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
                            disabled={isGenerating}
                            className="py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-kid-accent hover:border-kid-accent transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} 
                            {isGenerating ? 'Saving...' : 'Download PDF'}
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
            HIDDEN CERTIFICATE TEMPLATE 
            This is positioned off-screen to allow html2canvas to capture it cleanly 
            without it being visible to the user during normal interaction.
        */}
        <div style={{ position: 'fixed', top: 0, left: '-9999px', zIndex: -1 }}>
            <div 
                ref={certificateRef}
                className="w-[1123px] h-[794px] bg-white text-gray-900 relative flex flex-col justify-between items-center text-center p-12 box-border"
                style={{ fontFamily: 'Georgia, serif', backgroundColor: '#fff' }}
            >
                {/* Decorative Border */}
                <div className="absolute inset-4 border-[20px] border-double border-yellow-500 pointer-events-none"></div>
                <div className="absolute top-8 left-8 w-20 h-20 border-t-8 border-l-8 border-yellow-600"></div>
                <div className="absolute top-8 right-8 w-20 h-20 border-t-8 border-r-8 border-yellow-600"></div>
                <div className="absolute bottom-8 left-8 w-20 h-20 border-b-8 border-l-8 border-yellow-600"></div>
                <div className="absolute bottom-8 right-8 w-20 h-20 border-b-8 border-r-8 border-yellow-600"></div>

                {/* Header Section */}
                <div className="mt-12 z-10">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-green-600 text-white rounded-xl flex items-center justify-center font-black text-4xl shadow-lg font-sans">K</div>
                        <h1 className="text-4xl font-bold text-gray-500 uppercase tracking-[0.4em] font-sans">KidCap HQ</h1>
                    </div>
                    <div className="w-96 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto my-6"></div>
                    <h2 className="text-7xl font-bold text-gray-900 mb-2 uppercase tracking-wide text-shadow-sm">Certificate</h2>
                    <h3 className="text-3xl font-medium text-gray-500 uppercase tracking-widest">Of Completion</h3>
                </div>

                {/* Body Section */}
                <div className="flex-1 flex flex-col justify-center z-10 w-full max-w-4xl">
                    <p className="text-2xl text-gray-500 italic mb-6">This distinctive award is proudly presented to</p>
                    
                    <div className="relative mb-8">
                        <div className="text-7xl font-bold text-blue-900 font-cursive py-4 border-b-4 border-gray-300 w-full">
                            {user?.name || 'Future CEO'}
                        </div>
                    </div>

                    <p className="text-2xl text-gray-500 italic mb-4">For successfully mastering the business module</p>
                    <div className="bg-yellow-50 border-2 border-yellow-100 py-4 px-12 rounded-full inline-block mx-auto mb-6">
                        <h3 className="text-5xl font-bold text-gray-800 uppercase tracking-wide">{moduleTitle}</h3>
                    </div>
                    
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Demonstrating exceptional initiative, leadership potential, and financial literacy skills at the KidCap Academy.
                    </p>
                </div>

                {/* Footer Section */}
                <div className="w-full flex justify-between items-end px-24 mb-16 z-10">
                    <div className="text-center w-64">
                        <div className="font-cursive text-3xl text-blue-600 mb-2">Ollie The Owl</div>
                        <div className="border-t-2 border-gray-400 w-full pt-2">
                            <p className="font-bold text-gray-500 uppercase text-sm tracking-widest font-sans">Chief Education Officer</p>
                        </div>
                    </div>

                    {/* Seal */}
                    <div className="relative -mb-4">
                        <div className="w-40 h-40 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-xl relative z-10 border-4 border-yellow-300">
                            <div className="w-32 h-32 border-2 border-dashed border-white/50 rounded-full flex flex-col items-center justify-center">
                                <Trophy size={48} />
                                <span className="text-xs font-black uppercase mt-1 tracking-widest font-sans">Official Seal</span>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-1/2 w-48 h-16 bg-blue-800 z-0 shadow-lg"></div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-1/2 w-48 h-16 bg-blue-800 rotate-45 z-0 shadow-lg"></div>
                    </div>

                    <div className="text-center w-64">
                        <div className="text-2xl font-bold text-gray-800 mb-2 font-mono">{currentDate}</div>
                        <div className="border-t-2 border-gray-400 w-full pt-2">
                            <p className="font-bold text-gray-500 uppercase text-sm tracking-widest font-sans">Date Awarded</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ModuleRecap;
