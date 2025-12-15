
import React from 'react';

interface PublicNavbarProps {
  onHome: () => void;
  onFeatures: () => void;
  onCurriculum: () => void;
  onPricing: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({ 
  onHome, onFeatures, onCurriculum, onPricing, onLogin, onRegister 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
              <div className="w-10 h-10 bg-kid-secondary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_4px_0_0_rgba(21,128,61,1)]">
                  K
              </div>
              <span className="text-2xl font-black text-gray-800 tracking-tight">KidCap HQ</span>
          </div>
          <div className="hidden md:flex gap-8 font-bold text-gray-500">
              <button onClick={onFeatures} className="hover:text-kid-secondary transition-colors">Features</button>
              <button onClick={onCurriculum} className="hover:text-kid-secondary transition-colors">Curriculum</button>
              <button onClick={onPricing} className="hover:text-kid-secondary transition-colors">Pricing</button>
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
  );
};

export default PublicNavbar;
