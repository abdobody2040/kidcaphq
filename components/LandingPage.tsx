
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Brain, Shield, Star, Check, ArrowRight, Play, Users, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewCurriculum: () => void;
  onViewPricing: () => void;
  onViewFeatures: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewCurriculum, onViewPricing, onViewFeatures }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_4px_0_0_rgba(21,128,61,1)]">
                K
            </div>
            <span className="text-2xl font-black text-gray-800 tracking-tight">KidCap HQ</span>
        </div>
        <div className="hidden md:flex gap-8 font-bold text-gray-500">
            <button onClick={onViewFeatures} className="hover:text-green-600 transition-colors">Features</button>
            <button onClick={onViewCurriculum} className="hover:text-green-600 transition-colors">Curriculum</button>
            <button onClick={onViewPricing} className="hover:text-green-600 transition-colors">Pricing</button>
        </div>
        <button 
            onClick={onGetStarted}
            className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
            Log In
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                      <span className="inline-block px-4 py-1 rounded-full bg-yellow-100 text-yellow-800 font-black text-xs uppercase tracking-widest mb-6">
                          🚀 The #1 Business Game for Kids
                      </span>
                      <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
                          Turn Screen Time into <span className="text-green-500">Business Skills</span>.
                      </h1>
                      <p className="text-xl text-gray-500 font-medium mb-8 max-w-lg mx-auto md:mx-0">
                          KidCap HQ teaches entrepreneurship, money management, and leadership through addictive mini-games.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                          <button 
                            onClick={onGetStarted}
                            className="px-8 py-4 bg-green-500 text-white font-black text-xl rounded-2xl shadow-[0_6px_0_0_rgba(21,128,61,1)] hover:bg-green-400 btn-juicy flex items-center justify-center gap-3 transition-all"
                          >
                              Start Your Empire <ArrowRight strokeWidth={3} />
                          </button>
                          <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold text-xl rounded-2xl hover:border-gray-300 flex items-center justify-center gap-3 transition-all">
                              <Play size={20} fill="currentColor" /> Watch Demo
                          </button>
                      </div>
                      
                      <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-400">
                          <div className="flex -space-x-2">
                              {[1,2,3,4].map(i => (
                                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                              ))}
                          </div>
                          <p>Trusted by 10,000+ Parents</p>
                      </div>
                  </motion.div>
              </div>

              <div className="flex-1 relative">
                  {/* Decorative Blobs */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
                  <div className="absolute bottom-0 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl -z-10" />

                  <motion.img 
                    initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="App Screenshot" 
                    className="rounded-3xl shadow-2xl border-8 border-white rotate-2 hover:rotate-0 transition-transform duration-500"
                  />
                  
                  {/* Floating Badge */}
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border-2 border-gray-100 flex items-center gap-3"
                  >
                      <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                          <Star fill="currentColor" size={24} />
                      </div>
                      <div>
                          <div className="font-black text-gray-800 text-lg">Level Up!</div>
                          <div className="text-gray-400 text-xs font-bold">Earned 500 BizCoins</div>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-black text-gray-800 mb-4">More Than Just a Game</h2>
                  <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">We combine the addiction loop of modern games with Ivy League business curriculum.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FeatureCard 
                      icon={<Brain className="text-purple-500" size={32} />}
                      title="Learn"
                      desc="100+ Interactive lessons on Finance, Marketing, and Leadership."
                      color="bg-purple-50"
                  />
                  <FeatureCard 
                      icon={<Rocket className="text-blue-500" size={32} />}
                      title="Build"
                      desc="Launch virtual startups. Design logos, manage inventory, and scale."
                      color="bg-blue-50"
                  />
                  <FeatureCard 
                      icon={<Shield className="text-green-500" size={32} />}
                      title="Safe"
                      desc="100% Ad-free. Kid-safe environment with parental controls."
                      color="bg-green-50"
                  />
              </div>
          </div>
      </section>

      {/* --- GAMEPLAY SHOWCASE --- */}
      <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 order-2 md:order-1">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4 mt-8">
                          <div className="h-48 bg-yellow-100 rounded-3xl w-full flex items-center justify-center text-6xl shadow-inner">🍋</div>
                          <div className="h-64 bg-blue-100 rounded-3xl w-full flex items-center justify-center text-6xl shadow-inner">🍕</div>
                      </div>
                      <div className="space-y-4">
                          <div className="h-64 bg-pink-100 rounded-3xl w-full flex items-center justify-center text-6xl shadow-inner">🎨</div>
                          <div className="h-48 bg-green-100 rounded-3xl w-full flex items-center justify-center text-6xl shadow-inner">📈</div>
                      </div>
                  </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                  <h2 className="text-4xl font-black text-gray-800 mb-6">Real Business Simulations</h2>
                  <p className="text-lg text-gray-500 font-medium mb-8 leading-relaxed">
                      Kids don't just read about business; they <strong>run</strong> them. From a simple Lemonade Stand to a high-tech Drone Delivery Service, our "Tycoon" engine adapts to their skill level.
                  </p>
                  <ul className="space-y-4">
                      <li className="flex items-center gap-3 font-bold text-gray-700">
                          <Check className="text-green-500" strokeWidth={3} /> Dynamic Weather & Markets
                      </li>
                      <li className="flex items-center gap-3 font-bold text-gray-700">
                          <Check className="text-green-500" strokeWidth={3} /> Hire & Manage Staff
                      </li>
                      <li className="flex items-center gap-3 font-bold text-gray-700">
                          <Check className="text-green-500" strokeWidth={3} /> Upgrade Headquarters
                      </li>
                  </ul>
              </div>
          </div>
      </section>

      {/* --- PRICING SECTION ON LANDING (Simplified) --- */}
      <section id="pricing" className="py-24 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-black mb-4">Pricing Plans</h2>
              <p className="text-gray-400 font-medium mb-12">See our detailed <button onClick={onViewPricing} className="text-green-400 hover:underline">Pricing Page</button> for more info.</p>
              
              <div className="flex justify-center gap-4">
                  <button onClick={onViewPricing} className="bg-green-500 text-gray-900 px-8 py-3 rounded-xl font-black hover:bg-green-400 transition-all">View All Plans</button>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 grayscale opacity-50">
                  <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white font-black">K</div>
                  <span className="font-bold text-gray-600">KidCap HQ</span>
              </div>
              <div className="text-sm text-gray-400 font-medium">
                  © 2024 KidCap HQ Inc. All rights reserved.
              </div>
              <div className="flex gap-6 text-gray-400">
                  <Users size={20} className="hover:text-gray-600 cursor-pointer"/>
                  <Globe size={20} className="hover:text-gray-600 cursor-pointer"/>
              </div>
          </div>
      </footer>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }: any) => (
    <div className={`p-8 rounded-3xl ${color} border border-transparent hover:border-black/5 transition-all`}>
        <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-black text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 font-medium leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
