
import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { Check, Star, Lock, MapPin, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import InvestorPitchModal from './InvestorPitchModal';

interface KidMapProps {
  onStartLesson: (moduleId: string) => void;
}

const KidMap: React.FC<KidMapProps> = ({ onStartLesson }) => {
  const { user, lessons, assignments } = useAppStore();
  const { t } = useTranslation();
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Dynamically build course map from store data
  const courseMap = useMemo(() => {
      if (!lessons || lessons.length === 0) return [];
      const uniqueTags = Array.from(new Set(lessons.map(l => l.topic_tag)));
      // Simplified mapping for visual icons based on tag keywords
      return uniqueTags.map((tag: string) => {
          const safeTag = String(tag);
          
          // Map topic tags to translation keys safely
          let translationKey = safeTag;
          if (safeTag === "Money Basics") translationKey = "money_basics";
          else if (safeTag === "Entrepreneurship") translationKey = "entrepreneurship";
          else if (safeTag === "Investing & Wealth") translationKey = "investing_wealth";
          else if (safeTag === "Marketing") translationKey = "marketing";
          else if (safeTag === "Leadership") translationKey = "leadership";
          else if (safeTag === "Economics") translationKey = "economics";
          else if (safeTag === "Technology") translationKey = "technology";
          else if (safeTag === "Social Responsibility") translationKey = "social_responsibility";
          else if (safeTag === "Global Business") translationKey = "global_business";
          else if (safeTag === "Financial Smarts") translationKey = "financial_smarts";

          return {
              id: `MOD_${safeTag.replace(/\s+/g, '_').toUpperCase()}`,
              title: safeTag,
              translationKey: translationKey,
              icon: safeTag.includes('Money') ? '💰' : safeTag.includes('Tech') ? '💻' : safeTag.includes('Global') ? '✈️' : '🚀',
              lessonIds: lessons.filter(l => l.topic_tag === tag).map(l => l.id)
          };
      });
  }, [lessons]);

  // Calculate completion for a module
  const getModuleStatus = (lessonIds: string[]) => {
      if (!user || lessonIds.length === 0) return 'LOCKED';
      const completedCount = lessonIds.filter(id => user.completedLessonIds.includes(id)).length;
      if (completedCount === lessonIds.length) return 'COMPLETE';
      if (completedCount > 0) return 'IN_PROGRESS';
      return 'LOCKED'; 
  };

  // Check for active assignments in this module
  const getAssignmentCount = (lessonIds: string[]) => {
      if (!user || !user.classId) return 0;
      // Find assignments for this class that link to any lesson in this module
      // And are PUBLISHED
      const relevantAssignments = assignments.filter(a => 
          a.classId === user.classId && 
          a.status === 'PUBLISHED' &&
          lessonIds.includes(a.lessonId) &&
          !user.completedLessonIds.includes(a.lessonId) // Only count incomplete ones
      );
      return relevantAssignments.length;
  };

  if (courseMap.length === 0) {
      return <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-bold">{t('map.no_curriculum')}</div>;
  }

  const isIntern = user?.subscriptionTier === 'intern';
  const ALLOWED_INTERN_MODULES = ['Money Basics', 'Entrepreneurship'];

  return (
    <div className="relative pb-20">
       <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

       <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2">{t('path_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">{t('subtitle_complete')}</p>
          {user?.classId && (
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                  <ClipboardList size={14} /> {t('class_mode')}
              </div>
          )}
       </div>

       <div className="max-w-md mx-auto relative space-y-16">
          {/* Vertical Path Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 rounded-full -z-10" />

          {courseMap.map((mod, index) => {
              // 1. Progression Locking: First module open, others check previous completion
              const prevModule = index > 0 ? courseMap[index - 1] : null;
              const isPrevComplete = prevModule ? getModuleStatus(prevModule.lessonIds) === 'COMPLETE' : true;
              const isProgressionLocked = index > 0 && !isPrevComplete;

              // 2. Tier Locking: Interns only get Money Basics & Entrepreneurship
              const isTierLocked = isIntern && !ALLOWED_INTERN_MODULES.includes(mod.title);

              // Combined Lock State
              const isLocked = isProgressionLocked || isTierLocked;
              
              const status = getModuleStatus(mod.lessonIds);
              const progress = mod.lessonIds.filter(id => user?.completedLessonIds.includes(id)).length;
              const total = mod.lessonIds.length;
              const dueCount = getAssignmentCount(mod.lessonIds);

              // Alternating Sides
              const isLeft = index % 2 === 0;

              const handleModuleClick = () => {
                  if (isTierLocked) {
                      setShowPaywall(true);
                      return;
                  }
                  if (isProgressionLocked) return; // Silent block for progression
                  if (mod.lessonIds.length === 0) return; // Empty module safety
                  onStartLesson(mod.lessonIds[0]);
              };

              return (
                 <div key={mod.id} className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
                    
                    {/* Module Node */}
                    <motion.button
                        whileHover={!isLocked ? { scale: 1.05 } : {}}
                        whileTap={!isLocked ? { scale: 0.95 } : {}}
                        onClick={handleModuleClick}
                        className={`
                            w-24 h-24 rounded-3xl flex flex-col items-center justify-center border-b-8 transition-all relative z-10 shadow-lg
                            ${isLocked 
                                ? 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500 cursor-not-allowed' 
                                : status === 'COMPLETE' 
                                    ? 'bg-kid-secondary border-green-700' 
                                    : 'bg-kid-primary border-yellow-600'}
                        `}
                    >
                        <div className="text-3xl mb-1">
                            {/* Visual differentiation for lock type */}
                            {isTierLocked ? <Lock className="text-red-500" /> : isLocked ? <Lock className="text-gray-500 dark:text-gray-400" /> : mod.icon}
                        </div>
                        {status === 'COMPLETE' && (
                             <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 text-green-600 rounded-full p-1 border-2 border-green-600">
                                 <Check size={16} strokeWidth={4} />
                             </div>
                        )}
                        {/* Assignment Badge */}
                        {!isLocked && dueCount > 0 && (
                            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-white shadow-md animate-bounce">
                                {dueCount} {t('due')}
                            </div>
                        )}
                    </motion.button>

                    {/* Label */}
                    <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-40 bg-white dark:bg-gray-800 p-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm text-center
                        ${isLeft ? 'left-28' : 'right-28'}
                        `}
                    >
                        <h3 className="font-black text-gray-800 dark:text-white text-sm uppercase">
                            {t(mod.translationKey, { defaultValue: mod.title })}
                        </h3>
                        {isTierLocked ? (
                            <span className="text-xs font-black text-red-500 uppercase mt-1 block">Premium Only</span>
                        ) : (
                            <>
                                <div className="text-xs font-bold text-gray-400 mt-1">{progress}/{total} {t('lessons_count')}</div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-kid-secondary h-full transition-all" style={{ width: `${total > 0 ? (progress/total)*100 : 0}%` }} dir="ltr" />
                                </div>
                            </>
                        )}
                    </div>

                 </div>
              );
          })}
          
          <div className="text-center pt-8">
              <div className="inline-block bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 px-6 py-3 rounded-full font-black text-xl border-4 border-white dark:border-gray-800 shadow-xl">
                  🏆 {t('certificate')} 🏆
              </div>
          </div>
       </div>
    </div>
  );
};

export default KidMap;
