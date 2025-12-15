
import React from 'react';
import { COURSE_MAP } from '../data/curriculum';
import { BookOpen, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNavbar from './PublicNavbar';

interface CurriculumPageProps {
  onHome: () => void;
  onFeatures: () => void;
  onCurriculum: () => void;
  onPricing: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const CurriculumPage: React.FC<CurriculumPageProps> = ({ 
  onHome, onFeatures, onCurriculum, onPricing, onLogin, onRegister 
}) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <PublicNavbar 
        onHome={onHome}
        onFeatures={onFeatures}
        onCurriculum={onCurriculum}
        onPricing={onPricing}
        onLogin={onLogin}
        onRegister={onRegister}
      />

      <div className="bg-green-50 p-8 border-b border-green-100 pt-32">
          <div className="max-w-5xl mx-auto">
              <h1 className="text-5xl font-black text-gray-800 mb-4">The Academy Curriculum</h1>
              <p className="text-xl text-gray-600 max-w-2xl">A complete business education designed for kids. From the history of money to launching a global startup.</p>
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid gap-8">
              {COURSE_MAP.map((module, index) => (
                  <motion.div 
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row gap-8 items-start p-8 rounded-3xl border-2 border-gray-100 hover:border-blue-200 transition-all shadow-sm bg-white"
                  >
                      <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-5xl shrink-0">
                          {module.icon}
                      </div>
                      
                      <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Module {index + 1}</span>
                              <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                                  <Clock size={14} /> 20 Mins
                              </div>
                          </div>
                          <h2 className="text-2xl font-black text-gray-800 mb-3">{module.title}</h2>
                          <div className="flex flex-wrap gap-2">
                              {module.lessonIds.slice(0, 5).map((lessonId, i) => (
                                  <span key={lessonId} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                      Lesson {index + 1}.{i + 1}
                                  </span>
                              ))}
                              {module.lessonIds.length > 5 && (
                                  <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-sm font-medium">
                                      +{module.lessonIds.length - 5} More
                                  </span>
                              )}
                          </div>
                      </div>

                      <div className="md:self-center">
                          <div className="flex flex-col items-center gap-1 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                              <Star className="text-yellow-500 fill-current" size={24} />
                              <span className="font-black text-yellow-800 text-sm">Level {index + 1}</span>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default CurriculumPage;
