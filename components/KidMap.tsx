
import React, { useMemo } from 'react';
import { useAppStore } from '../store';
import { Check, Star, Lock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface KidMapProps {
  onStartLesson: (moduleId: string) => void;
}

const KidMap: React.FC<KidMapProps> = ({ onStartLesson }) => {
  const { user, lessons } = useAppStore();
  
  // Dynamically build course map from store data
  const courseMap = useMemo(() => {
      if (!lessons || lessons.length === 0) return [];
      const uniqueTags = Array.from(new Set(lessons.map(l => l.topic_tag)));
      // Simplified mapping for visual icons based on tag keywords
      return uniqueTags.map((tag: string) => {
          const safeTag = String(tag);
          return {
              id: `MOD_${safeTag.replace(/\s+/g, '_').toUpperCase()}`,
              title: safeTag,
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

  if (courseMap.length === 0) {
      return <div className="text-center py-20 text-gray-400 font-bold">No curriculum loaded. Please contact Admin.</div>;
  }

  return (
    <div className="relative pb-20">
       <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-800 mb-2">My Entrepreneur Path</h2>
          <p className="text-gray-500 font-bold">Complete all modules to become a CEO!</p>
       </div>

       <div className="max-w-md mx-auto relative space-y-16">
          {/* Vertical Path Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-gray-200 -translate-x-1/2 rounded-full -z-10" />

          {courseMap.map((mod, index) => {
              // Unlock Logic: First module open, others check previous completion
              const prevModule = index > 0 ? courseMap[index - 1] : null;
              const isPrevComplete = prevModule ? getModuleStatus(prevModule.lessonIds) === 'COMPLETE' : true;
              
              // Only lock if previous is not complete. Index 0 is always unlocked.
              const isLocked = index > 0 && !isPrevComplete;
              
              const status = getModuleStatus(mod.lessonIds);
              const progress = mod.lessonIds.filter(id => user?.completedLessonIds.includes(id)).length;
              const total = mod.lessonIds.length;

              // Alternating Sides
              const isLeft = index % 2 === 0;

              const handleModuleClick = () => {
                  if (isLocked) return;
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
                                ? 'bg-gray-300 border-gray-400 cursor-not-allowed' 
                                : status === 'COMPLETE' 
                                    ? 'bg-kid-secondary border-green-700' 
                                    : 'bg-kid-primary border-yellow-600'}
                        `}
                    >
                        <div className="text-3xl mb-1">{isLocked ? <Lock className="text-gray-500" /> : mod.icon}</div>
                        {status === 'COMPLETE' && (
                             <div className="absolute -top-2 -right-2 bg-white text-green-600 rounded-full p-1 border-2 border-green-600">
                                 <Check size={16} strokeWidth={4} />
                             </div>
                        )}
                    </motion.button>

                    {/* Label */}
                    <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-40 bg-white p-3 rounded-xl border-2 border-gray-100 shadow-sm text-center
                        ${isLeft ? 'left-28' : 'right-28'}
                        `}
                    >
                        <h3 className="font-black text-gray-800 text-sm uppercase">{mod.title}</h3>
                        <div className="text-xs font-bold text-gray-400 mt-1">{progress}/{total} Lessons</div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                            <div className="bg-kid-secondary h-full transition-all" style={{ width: `${total > 0 ? (progress/total)*100 : 0}%` }} />
                        </div>
                    </div>

                 </div>
              );
          })}
          
          <div className="text-center pt-8">
              <div className="inline-block bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-black text-xl border-4 border-white shadow-xl">
                  🏆 CERTIFICATE 🏆
              </div>
          </div>
       </div>
    </div>
  );
};

export default KidMap;
