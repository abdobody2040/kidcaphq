
import React from 'react';
import { ArrowLeft, Brain, Rocket, Shield, Gamepad2, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';

interface FeaturesPageProps {
  onBack: () => void;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ onBack }) => {
  const { cmsContent } = useAppStore();
  const features = cmsContent.features;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <div className="bg-blue-50 p-8 border-b border-blue-100">
          <div className="max-w-5xl mx-auto">
              <button onClick={onBack} className="flex items-center gap-2 text-blue-700 font-bold mb-6 hover:underline">
                  <ArrowLeft size={20} /> Back
              </button>
              <h1 className="text-5xl font-black text-gray-800 mb-4">Platform Features</h1>
              <p className="text-xl text-gray-600 max-w-2xl">Discover how KidCap HQ builds the next generation of leaders through play.</p>
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid gap-12">
          
          <FeatureSection 
             title={features.learningTitle}
             desc={features.learningDesc}
             icon={<Brain size={40} className="text-white" />}
             color="bg-purple-500"
             items={['100+ Lessons', 'Quizzes & Challenges', 'AI Tutoring Support']}
             image={features.learningImage}
          />

          <FeatureSection 
             title={features.arcadeTitle}
             desc={features.arcadeDesc}
             icon={<Gamepad2 size={40} className="text-white" />}
             color="bg-blue-500"
             items={['30+ Simulation Games', 'Dynamic Markets', 'Upgrade Trees']}
             image={features.arcadeImage}
             reverse
          />

          <FeatureSection 
             title={features.progressionTitle}
             desc={features.progressionDesc}
             icon={<TrendingUp size={40} className="text-white" />}
             color="bg-green-500"
             items={['Customizable HQ', 'Avatar Shop', 'Skill Trees']}
             image={features.progressionImage}
          />

          <FeatureSection 
             title={features.safetyTitle}
             desc={features.safetyDesc}
             icon={<Shield size={40} className="text-white" />}
             color="bg-orange-500"
             items={['Parent Dashboard', 'No Ads', 'Teacher Controls']}
             image={features.safetyImage}
             reverse
          />

      </div>
    </div>
  );
};

const FeatureSection = ({ title, desc, icon, color, items, image, reverse }: any) => (
    <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`flex flex-col md:flex-row gap-12 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}
    >
        <div className="flex-1 space-y-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${color}`}>
                {icon}
            </div>
            <h2 className="text-3xl font-black text-gray-800">{title}</h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">{desc}</p>
            <ul className="space-y-3">
                {items.map((item: string) => (
                    <li key={item} className="flex items-center gap-3 font-bold text-gray-700">
                        <div className={`w-2 h-2 rounded-full ${color}`} />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
        <div className="flex-1">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 aspect-video relative group">
               {image && image.startsWith('http') ? (
                   <img src={image} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
               ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 font-black text-xl uppercase tracking-widest">
                       Preview Image
                   </div>
               )}
               <div className={`absolute inset-0 opacity-10 ${color} mix-blend-overlay`}></div>
            </div>
        </div>
    </motion.div>
);

export default FeaturesPage;
