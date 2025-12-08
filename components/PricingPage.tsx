
import React from 'react';
import { ArrowLeft, Check, X as XIcon, Crown, Shield, Star } from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onGetStarted }) => {
  return (
    <div className="min-h-screen bg-green-50 font-sans text-gray-900 pb-20">
      <div className="p-8 border-b border-green-100 bg-white">
          <div className="max-w-6xl mx-auto">
              <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-green-600 transition-colors">
                  <ArrowLeft size={20} /> Back
              </button>
              <div className="text-center max-w-3xl mx-auto py-10">
                  <h1 className="text-5xl font-black mb-6 text-gray-900">Invest in Their Future</h1>
                  <p className="text-xl text-gray-500 font-medium">Choose the plan that fits your family. Cancel anytime, risk-free.</p>
              </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Free Tier */}
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><Shield size={24} /></div>
                      <h3 className="text-2xl font-black text-gray-700">Starter</h3>
                  </div>
                  <div className="text-5xl font-black mb-2 text-gray-900">$0<span className="text-xl text-gray-400 font-medium">/mo</span></div>
                  <p className="text-gray-500 mb-8 font-bold">For curious kids just starting out.</p>
                  
                  <button 
                    onClick={onGetStarted}
                    className="w-full py-4 rounded-xl font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors mb-8"
                  >
                      Get Started Free
                  </button>

                  <div className="space-y-4">
                      <Feature text="Access to Module 1 & 2" />
                      <Feature text="Lemonade Stand Game" />
                      <Feature text="Basic Profile" />
                      <Feature text="Advanced Analytics" active={false} />
                      <Feature text="AI Tutoring" active={false} />
                      <Feature text="All 30+ Games" active={false} />
                  </div>
              </div>

              {/* Pro Tier */}
              <div className="bg-white rounded-3xl p-10 border-4 border-kid-secondary relative shadow-xl transform md:scale-105 z-10">
                  <div className="absolute top-0 right-0 bg-kid-secondary text-white text-xs font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                      Recommended
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg text-kid-secondary"><Crown size={24} /></div>
                      <h3 className="text-2xl font-black text-kid-secondary">Future CEO</h3>
                  </div>
                  <div className="text-5xl font-black mb-2 text-gray-900">$9.99<span className="text-xl text-gray-400 font-medium">/mo</span></div>
                  <p className="text-gray-500 mb-8 font-bold">The complete academy experience.</p>
                  
                  <button 
                    onClick={onGetStarted}
                    className="w-full py-4 rounded-xl font-black bg-kid-secondary text-white hover:bg-green-600 shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy transition-all mb-8"
                  >
                      Start Free Trial
                  </button>

                  <div className="space-y-4">
                      <Feature text="Unlimited Access to All Modules" active />
                      <Feature text="Unlock All 30+ Mini-Games" active />
                      <Feature text="AI Tutoring (Owly)" active />
                      <Feature text="Parent Analytics Dashboard" active />
                      <Feature text="Certificate Downloads" active />
                      <Feature text="Priority Support" active />
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

const Feature = ({ text, active = true }: { text: string, active?: boolean }) => (
    <div className={`flex items-center gap-3 font-bold ${active ? 'text-gray-700' : 'text-gray-300 decoration-2'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-green-100 text-kid-secondary' : 'bg-gray-100 text-gray-300'}`}>
            {active ? <Check size={14} strokeWidth={4} /> : <XIcon size={14} strokeWidth={3} />}
        </div>
        {text}
    </div>
);

export default PricingPage;
