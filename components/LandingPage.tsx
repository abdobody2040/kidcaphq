
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Brain, Shield, Star, Check, ArrowRight, Play, Users, Globe, Trophy, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onViewCurriculum: () => void;
  onViewPricing: () => void;
  onViewFeatures: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onRegister, onViewCurriculum, onViewPricing, onViewFeatures }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden selection:bg-yellow-200">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onGetStarted}>
                <div className="w-10 h-10 bg-kid-secondary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_4px_0_0_rgba(21,128,61,1)]">
                    K
                </div>
                <span className="text-2xl font-black text-gray-800 tracking-tight">KidCap HQ</span>
            </div>
            <div className="hidden md:flex gap-8 font-bold text-gray-500">
                <button onClick={onViewFeatures} className="hover:text-kid-secondary transition-colors">Features</button>
                <button onClick={onViewCurriculum} className="hover:text-kid-secondary transition-colors">Curriculum</button>
                <button onClick={onViewPricing} className="hover:text-kid-secondary transition-colors">Pricing</button>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={onLogin}
                    className="px-5 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                    Log In
                </button>
                <button 
                    onClick={onRegister}
                    className="px-6 py-2 bg-kid-primary text-yellow-900 font-black rounded-xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy hover:bg-yellow-400 transition-all"
                >
                    Start Free
                </button>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden bg-gradient-to-b from-green-50 via-blue-50 to-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-black text-xs uppercase tracking-widest mb-6 border-2 border-yellow-200">
                          <Star fill="currentColor" size={14} /> The #1 Entrepreneur Academy for Kids
                      </div>
                      <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
                          Don't just play games. <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-kid-secondary to-teal-400">Build an Empire.</span>
                      </h1>
                      <p className="text-xl text-gray-600 font-medium mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                          KidCap HQ turns screen time into real-world business skills. Learn finance, leadership, and marketing through addictive mini-games.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                          <button 
                            onClick={onGetStarted}
                            className="px-8 py-4 bg-kid-secondary text-white font-black text-xl rounded-2xl shadow-[0_6px_0_0_rgba(21,128,61,1)] hover:bg-green-500 btn-juicy flex items-center justify-center gap-3 transition-all"
                          >
                              Play Now - It's Free! <ArrowRight strokeWidth={4} />
                          </button>
                      </div>
                      
                      <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-400">
                          <div className="flex -space-x-2">
                              {[1,2,3,4].map(i => (
                                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                                  </div>
                              ))}
                          </div>
                          <p>Join 10,000+ Future CEOs</p>
                      </div>
                  </motion.div>
              </div>

              <div className="flex-1 relative h-[500px] w-full flex items-center justify-center">
                  {/* Decorative Elements */}
                  <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-10 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />

                  {/* Floating Cards */}
                  <motion.div 
                    className="absolute z-20 top-0 right-10 md:right-20 bg-white p-4 rounded-2xl shadow-xl border-b-4 border-gray-100 flex items-center gap-3 animate-float"
                  >
                      <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                          <Trophy fill="currentColor" size={24} />
                      </div>
                      <div>
                          <div className="font-black text-gray-800">You Won!</div>
                          <div className="text-gray-400 text-xs font-bold">+500 XP</div>
                      </div>
                  </motion.div>

                  <motion.div 
                    className="absolute z-20 bottom-20 left-0 md:left-10 bg-white p-4 rounded-2xl shadow-xl border-b-4 border-gray-100 flex items-center gap-3 animate-float-delayed"
                  >
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                          <Rocket fill="currentColor" size={24} />
                      </div>
                      <div>
                          <div className="font-black text-gray-800">New Startup</div>
                          <div className="text-gray-400 text-xs font-bold">Lemonade Inc.</div>
                      </div>
                  </motion.div>

                  {/* Main Image */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                  >
                      <img 
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="App Screenshot" 
                        className="rounded-3xl shadow-2xl border-8 border-white w-full max-w-md mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500"
                      />
                  </motion.div>
              </div>
          </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-12 border-y border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">Loved by Parents & Teachers Everywhere</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ReviewCard 
                      name="Sarah Jenkins" 
                      role="Parent" 
                      text="My 8-year-old asked me about 'compound interest' at dinner. I was floored. This app is pure gold." 
                  />
                  <ReviewCard 
                      name="Mr. Thompson" 
                      role="Teacher" 
                      text="Finally, a way to teach financial literacy that isn't boring worksheets. The kids beg to play KidCap." 
                  />
                  <ReviewCard 
                      name="David L." 
                      role="Dad of 3" 
                      text="Safe, educational, and actually fun. It's the only screen time I don't feel guilty about." 
                  />
              </div>
          </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-black text-gray-800 mb-4">How KidCap Works</h2>
                  <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">We use a simple loop to make learning sticky and addictive.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-1 bg-gray-200 border-t-4 border-dotted border-gray-300 z-0" />

                  <StepCard 
                      num="1" 
                      icon={<Play size={32} className="text-white ml-1" />}
                      title="Play Simulators"
                      desc="Run virtual lemonade stands, pizza shops, and tech startups."
                      color="bg-blue-500"
                  />
                  <StepCard 
                      num="2" 
                      icon={<Brain size={32} className="text-white" />}
                      title="Learn Concepts"
                      desc="Bite-sized lessons explain the 'Why' behind the money."
                      color="bg-purple-500"
                  />
                  <StepCard 
                      num="3" 
                      icon={<Trophy size={32} className="text-white" />}
                      title="Earn & Upgrade"
                      desc="Get XP, unlock cool avatars, and build your dream HQ."
                      color="bg-yellow-500"
                  />
              </div>
          </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div className="order-2 md:order-1">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-4 mt-8">
                              <div className="h-48 bg-yellow-100 rounded-3xl w-full flex flex-col items-center justify-center text-center p-4 border-4 border-yellow-200">
                                  <div className="text-5xl mb-2">🍋</div>
                                  <div className="font-black text-yellow-800">Tycoon Mode</div>
                              </div>
                              <div className="h-64 bg-blue-100 rounded-3xl w-full flex flex-col items-center justify-center text-center p-4 border-4 border-blue-200">
                                  <div className="text-5xl mb-2">🍕</div>
                                  <div className="font-black text-blue-800">Pizza Rush</div>
                              </div>
                          </div>
                          <div className="space-y-4">
                              <div className="h-64 bg-pink-100 rounded-3xl w-full flex flex-col items-center justify-center text-center p-4 border-4 border-pink-200">
                                  <div className="text-5xl mb-2">🎨</div>
                                  <div className="font-black text-pink-800">Brand Builder</div>
                              </div>
                              <div className="h-48 bg-green-100 rounded-3xl w-full flex flex-col items-center justify-center text-center p-4 border-4 border-green-200">
                                  <div className="text-5xl mb-2">📈</div>
                                  <div className="font-black text-green-800">Stock Market</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="flex-1 order-1 md:order-2">
                      <span className="text-kid-secondary font-black uppercase tracking-widest text-sm mb-2 block">The Arcade</span>
                      <h2 className="text-4xl font-black text-gray-800 mb-6">Real Business Simulations</h2>
                      <p className="text-lg text-gray-500 font-medium mb-8 leading-relaxed">
                          Kids don't just read about business; they <strong>run</strong> them. Our simulation engine adapts to their skill level, teaching supply & demand, profit margins, and customer service in real-time.
                      </p>
                      <ul className="space-y-4">
                          <FeatureItem text="Dynamic Weather & Market Conditions" />
                          <FeatureItem text="Hire Managers & Automate Income" />
                          <FeatureItem text="Design Logos & Marketing Campaigns" />
                      </ul>
                      <button onClick={onGetStarted} className="mt-8 text-kid-secondary font-black text-lg flex items-center gap-2 hover:gap-4 transition-all">
                          Explore the Arcade <ArrowRight strokeWidth={4} />
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
          {/* Background Patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <h2 className="text-5xl font-black mb-6">Ready to launch your startup?</h2>
              <p className="text-xl text-gray-400 font-medium mb-10">Join for free today. No credit card required.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={onRegister}
                    className="px-10 py-5 bg-kid-primary text-yellow-900 font-black text-xl rounded-2xl shadow-[0_6px_0_0_rgba(202,138,4,1)] btn-juicy hover:bg-yellow-400 transition-all"
                  >
                      Get Started Now
                  </button>
                  <button onClick={onViewPricing} className="px-10 py-5 bg-white/10 text-white font-bold text-xl rounded-2xl hover:bg-white/20 transition-all">
                      View Plans
                  </button>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                  <div className="w-8 h-8 bg-kid-secondary rounded-lg flex items-center justify-center text-white font-black">K</div>
                  <span className="font-bold text-gray-600">KidCap HQ</span>
              </div>
              <div className="text-sm text-gray-400 font-medium">
                  © 2024 KidCap HQ Inc. All rights reserved. Made with ❤️ for future leaders.
              </div>
              <div className="flex gap-6 text-gray-400">
                  <Users size={20} className="hover:text-kid-secondary cursor-pointer transition-colors"/>
                  <Globe size={20} className="hover:text-kid-secondary cursor-pointer transition-colors"/>
              </div>
          </div>
      </footer>

    </div>
  );
};

const ReviewCard = ({ name, role, text }: any) => (
    <div className="bg-gray-50 p-8 rounded-3xl text-left border-2 border-gray-100 hover:border-kid-primary hover:shadow-lg transition-all">
        <div className="flex text-yellow-400 gap-1 mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={16} />)}
        </div>
        <p className="text-gray-700 font-medium mb-6 leading-relaxed">"{text}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                {name[0]}
            </div>
            <div>
                <div className="font-black text-gray-900 text-sm">{name}</div>
                <div className="text-xs font-bold text-gray-400 uppercase">{role}</div>
            </div>
        </div>
    </div>
);

const StepCard = ({ num, icon, title, desc, color }: any) => (
    <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-3xl ${color} flex items-center justify-center shadow-lg mb-6 transform hover:scale-110 transition-transform`}>
            {icon}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center font-black text-gray-400">
                {num}
            </div>
        </div>
        <h3 className="text-xl font-black text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
);

const FeatureItem = ({ text }: { text: string }) => (
    <li className="flex items-center gap-3 font-bold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
        <div className="bg-green-100 p-1 rounded-full text-green-600">
            <Check size={16} strokeWidth={4} />
        </div>
        {text}
    </li>
);

export default LandingPage;
