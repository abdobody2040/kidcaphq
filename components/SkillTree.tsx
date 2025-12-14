
import React from 'react';
import { useAppStore, SKILLS_DB } from '../store';
import { Zap, Brain, Smile, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SkillTree: React.FC = () => {
  const { user, unlockSkill } = useAppStore();
  const { t } = useTranslation();

  if (!user) return null;

  const categories = ['CHARISMA', 'EFFICIENCY', 'WISDOM'];
  const icons: Record<string, any> = { CHARISMA: Smile, EFFICIENCY: Zap, WISDOM: Brain };
  const themeColors: Record<string, string> = { 
      CHARISMA: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800', 
      EFFICIENCY: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800', 
      WISDOM: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' 
  };
  const lineColors: Record<string, string> = {
      CHARISMA: 'bg-pink-300 dark:bg-pink-800',
      EFFICIENCY: 'bg-blue-300 dark:bg-blue-800',
      WISDOM: 'bg-purple-300 dark:bg-purple-800'
  };

  return (
    <div className="pb-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-3">{t('skills.title')}</h2>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">{t('skills.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {categories.map(cat => {
              const categorySkills = SKILLS_DB.filter(s => s.category === cat);
              
              return (
                  <div key={cat} className="flex flex-col items-center">
                      {/* Header Node */}
                      <div className={`w-full flex items-center justify-center gap-3 p-4 rounded-3xl border-4 shadow-sm mb-2 z-10 relative ${themeColors[cat]}`}>
                          {React.createElement(icons[cat], { size: 32, strokeWidth: 2.5 })}
                          <h3 className="font-black text-2xl tracking-tight">{cat}</h3>
                      </div>

                      {/* Skills Column */}
                      <div className="flex flex-col items-center w-full">
                          {categorySkills.map((skill, index) => {
                              const isUnlocked = user.unlockedSkills.includes(skill.id);
                              const previousSkill = index > 0 ? categorySkills[index - 1] : null;
                              // The first skill is always "unlockable" if we consider the category header as the start
                              const isPreviousUnlocked = !previousSkill || user.unlockedSkills.includes(previousSkill.id);
                              
                              const isAvailable = !isUnlocked && isPreviousUnlocked;
                              const isLocked = !isUnlocked && !isPreviousUnlocked;

                              return (
                                  <React.Fragment key={skill.id}>
                                      {/* Connector Line */}
                                      <div className={`w-2 h-12 rounded-full my-1 transition-colors duration-500
                                          ${isPreviousUnlocked ? lineColors[cat] : 'bg-gray-200 dark:bg-gray-700'}
                                      `} />

                                      {/* Skill Card */}
                                      <motion.div 
                                         whileHover={!isLocked ? { scale: 1.03, translateY: -2 } : {}}
                                         className={`relative w-full p-6 rounded-3xl border-4 text-center transition-all duration-300
                                            ${isUnlocked 
                                                ? 'bg-white dark:bg-gray-800 border-green-500 shadow-lg' 
                                                : isAvailable
                                                    ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-md ring-4 ring-yellow-100 dark:ring-yellow-900/30 ring-opacity-50' 
                                                    : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60 grayscale'}
                                         `}
                                      >
                                          {/* Lock Icon Overlay for fully locked */}
                                          {isLocked && (
                                              <div className="absolute top-4 right-4 text-gray-400 dark:text-gray-600">
                                                  <Lock size={20} />
                                              </div>
                                          )}

                                          {/* Status Badge */}
                                          {isUnlocked && (
                                              <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full border-4 border-white dark:border-gray-800 shadow-sm">
                                                  <Check size={16} strokeWidth={4} />
                                              </div>
                                          )}

                                          <h4 className={`font-black text-xl mb-2 ${isUnlocked ? 'text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                              {skill.name}
                                          </h4>
                                          
                                          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed mb-6">
                                              {skill.description}
                                          </p>
                                          
                                          {isUnlocked ? (
                                              <div className="w-full py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-black rounded-xl text-sm flex items-center justify-center gap-2">
                                                  {t('skills.active')}
                                              </div>
                                          ) : (
                                              <button 
                                                 onClick={() => unlockSkill(skill.id)}
                                                 disabled={!isAvailable || user.bizCoins < skill.cost}
                                                 className={`w-full py-3 rounded-xl font-black flex items-center justify-center gap-2 text-sm transition-all
                                                    ${isAvailable 
                                                        ? user.bizCoins >= skill.cost
                                                            ? 'bg-kid-primary text-yellow-900 shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy hover:bg-yellow-400'
                                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                        : 'bg-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed border-2 border-gray-200 dark:border-gray-700'}
                                                 `}
                                              >
                                                  {isAvailable ? (
                                                       user.bizCoins >= skill.cost 
                                                          ? <>{t('skills.unlock')} <span className="bg-black/10 px-1.5 rounded text-xs py-0.5">${skill.cost}</span></>
                                                          : <>{t('skills.need')} ${skill.cost}</>
                                                  ) : (
                                                      <span className="flex items-center gap-1"><Lock size={12}/> {t('skills.locked')}</span>
                                                  )}
                                              </button>
                                          )}
                                      </motion.div>
                                  </React.Fragment>
                              );
                          })}
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
};

export default SkillTree;
