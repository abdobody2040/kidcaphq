
import React from 'react';
import { Check, Crown, Star, Shield, Users, Rocket } from 'lucide-react';
import { useAppStore, SUBSCRIPTION_PLANS } from '../store';
import { useTranslation } from 'react-i18next';
import PublicNavbar from './PublicNavbar';

interface PricingPageProps {
  onHome: () => void;
  onFeatures: () => void;
  onCurriculum: () => void;
  onPricing: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onGetStarted: () => void; // Kept for the buttons inside cards
}

// Map Plan IDs to Translation Keys for Features
const PLAN_FEATURES_KEYS: Record<string, string[]> = {
    intern: ['feat_limited_energy', 'feat_standard_lessons', 'feat_ads'],
    founder: ['feat_unlimited', 'feat_offline', 'feat_custom_hq'],
    board: ['feat_family', 'feat_parent_dash', 'feat_founder_perks'],
    tycoon: ['feat_ai_consultant', 'feat_negotiation', 'feat_board_perks']
};

const PricingPage: React.FC<PricingPageProps> = ({ 
  onHome, onFeatures, onCurriculum, onPricing, onLogin, onRegister, onGetStarted 
}) => {
  const { t } = useTranslation();

  const getButtonText = (planId: string, price: number) => {
      if (price === 0) return t('pricing.btn_start_free');
      if (planId === 'founder') return `${t('pricing.btn_get_funded')}`;
      if (planId === 'board') return `${t('pricing.btn_start_family')}`;
      if (planId === 'tycoon') return `${t('pricing.btn_hire_ollie')}`;
      return `${t('pricing.btn_select')} ${t(`pricing.tier_${planId}`)}`;
  };

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

      <div className="bg-gradient-to-b from-blue-50 to-white p-8 border-b border-blue-100 pt-32">
          <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto py-10">
                  <h1 className="text-5xl font-black mb-6 text-gray-900">{t('pricing.title')}</h1>
                  <p className="text-xl text-gray-500 font-medium">{t('pricing.subtitle')}</p>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {SUBSCRIPTION_PLANS.map((plan) => {
                  const isRecommended = plan.recommended;
                  const Icon = getPlanIcon(plan.id);
                  const featureKeys = PLAN_FEATURES_KEYS[plan.id] || [];

                  return (
                      <div 
                        key={plan.id} 
                        className={`relative rounded-3xl p-6 flex flex-col h-full transition-all duration-300
                            ${plan.color} ${isRecommended ? 'shadow-xl scale-105 z-10 border-2' : 'border shadow-sm hover:shadow-md'}
                        `}
                      >
                          {isRecommended && (
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                                  {t('pricing.most_popular')}
                              </div>
                          )}

                          <div className="flex items-center gap-3 mb-4">
                              <div className={`p-2 rounded-xl bg-white shadow-sm text-gray-700`}>
                                  {Icon}
                              </div>
                              <h3 className="text-xl font-black text-gray-800">{t(`pricing.tier_${plan.id}`)}</h3>
                          </div>

                          <div className="mb-2">
                              <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                              {plan.price > 0 && <span className="text-gray-500 font-bold">{t(`pricing.per_${plan.interval}`)}</span>}
                          </div>
                          
                          <p className="text-sm text-gray-500 font-medium mb-6 min-h-[40px]">
                              {t(`pricing.desc_${plan.id}`)}
                          </p>

                          <div className="space-y-3 mb-8 flex-1">
                              {featureKeys.map((key) => (
                                  <div key={key} className="flex items-start gap-2 text-sm font-bold text-gray-700">
                                      <Check size={16} className="text-green-500 shrink-0 mt-0.5" strokeWidth={3} />
                                      {t(`pricing.${key}`)}
                                  </div>
                              ))}
                          </div>

                          <button 
                            onClick={onGetStarted}
                            className={`w-full py-3 rounded-xl font-black transition-all shadow-sm ${plan.buttonColor}`}
                          >
                              {getButtonText(plan.id, plan.price)}
                          </button>
                      </div>
                  );
              })}

          </div>
      </div>
    </div>
  );
};

// Helper to get icon based on ID
const getPlanIcon = (id: string) => {
    switch (id) {
        case 'intern': return <Shield size={24} />;
        case 'founder': return <Rocket size={24} className="text-blue-500" />;
        case 'board': return <Users size={24} className="text-purple-500" />;
        case 'tycoon': return <Crown size={24} className="text-yellow-500" />;
        default: return <Star size={24} />;
    }
};

export default PricingPage;
