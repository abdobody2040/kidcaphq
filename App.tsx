
import React, { useState, useEffect } from 'react';
import { useAppStore, SHOP_ITEMS } from './store';
import { UserRole } from './types';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import KidMap from './components/KidMap';
import UniversalLessonEngine from './components/UniversalLessonEngine';
import LemonadeStand from './components/LemonadeStand';
import BrandBuilder from './components/BrandBuilder';
import PizzaDelivery from './components/PizzaDelivery';
import CoffeeCart from './components/CoffeeCart';
import GameEngine from './components/GameEngine';
import GameMenu from './components/GameMenu';
import BizStore from './components/BizStore';
import Leaderboard from './components/Leaderboard';
import LevelUpModal from './components/LevelUpModal';
import ParentDashboard from './components/ParentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import JoinClassModal from './components/JoinClassModal';
import Headquarters from './components/Headquarters';
import SkillTree from './components/SkillTree';
import Portfolio from './components/Portfolio';
import CurriculumPage from './components/CurriculumPage';
import PricingPage from './components/PricingPage';
import FeaturesPage from './components/FeaturesPage';
import DynamicPage from './components/DynamicPage';
import OllieChat from './components/OllieChat';
import StudentAssignmentDashboard from './components/StudentAssignmentDashboard'; 
import { Check, Rocket, Pizza, Star, Smile, Lightbulb, Coffee, Music, Camera, Globe, Anchor, Cpu, Car, Zap } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  rocket: Rocket,
  pizza: Pizza,
  star: Star,
  smile: Smile,
  bulb: Lightbulb,
  coffee: Coffee,
  music: Music,
  camera: Camera,
  globe: Globe,
  anchor: Anchor,
  cpu: Cpu,
  car: Car,
  zap: Zap
};

const App = () => {
  const { user, toggleEquipItem, lessons, syncGames, cmsContent } = useAppStore();
  const [activeTab, setActiveTab] = useState('map');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [showJoinClass, setShowJoinClass] = useState(false);
  
  const [viewState, setViewState] = useState<'LANDING' | 'AUTH_LOGIN' | 'AUTH_REGISTER' | 'CURRICULUM' | 'PRICING' | 'FEATURES' | 'CUSTOM_PAGE'>('LANDING');
  const [activePageSlug, setActivePageSlug] = useState<string | null>(null);

  // Initialize Data on Mount
  useEffect(() => {
      syncGames();
  }, [syncGames]);

  useEffect(() => {
    if (user?.role === UserRole.PARENT) setActiveTab('parent_dashboard');
    if (user?.role === UserRole.TEACHER) setActiveTab('teacher_dashboard');
    if (user?.role === UserRole.ADMIN) setActiveTab('admin_dashboard');
    if (user?.role === UserRole.KID) setActiveTab('map');
  }, [user?.role]);

  if (!user) {
      if (viewState === 'LANDING') {
          return <LandingPage 
                    onGetStarted={() => setViewState('AUTH_REGISTER')} 
                    onLogin={() => setViewState('AUTH_LOGIN')}
                    onRegister={() => setViewState('AUTH_REGISTER')}
                    onViewCurriculum={() => setViewState('CURRICULUM')}
                    onViewPricing={() => setViewState('PRICING')}
                    onViewFeatures={() => setViewState('FEATURES')}
                    onNavigateToPage={(slug) => {
                        setActivePageSlug(slug);
                        setViewState('CUSTOM_PAGE');
                    }}
                 />;
      }
      if (viewState === 'CURRICULUM') {
          return <CurriculumPage onBack={() => setViewState('LANDING')} />;
      }
      if (viewState === 'PRICING') {
          return <PricingPage 
                    onBack={() => setViewState('LANDING')} 
                    onGetStarted={() => setViewState('AUTH_REGISTER')}
                 />;
      }
      if (viewState === 'FEATURES') {
          return <FeaturesPage onBack={() => setViewState('LANDING')} />;
      }
      if (viewState === 'CUSTOM_PAGE' && activePageSlug) {
          const page = cmsContent.customPages.find(p => p.slug === activePageSlug);
          if (page) {
              return <DynamicPage page={page} onBack={() => setViewState('LANDING')} />;
          }
          // Fallback if page not found
          return <div className="p-10 text-center">Page not found. <button onClick={() => setViewState('LANDING')} className="text-blue-500 underline">Go Home</button></div>;
      }
      return <Auth 
                onBack={() => setViewState('LANDING')} 
                initialMode={viewState === 'AUTH_REGISTER' ? 'REGISTER' : 'LOGIN'}
             />;
  }

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setActiveLessonId(null);
    setActiveGameId(null);
  };

  const renderGame = () => {
      // Legacy Custom Games
      if (activeGameId === 'lemonade') return <LemonadeStand />;
      if (activeGameId === 'brand') return <BrandBuilder onBack={() => setActiveGameId(null)} />;
      if (activeGameId === 'pizza') return <PizzaDelivery onBack={() => setActiveGameId(null)} />;
      if (activeGameId === 'coffee') return <CoffeeCart onBack={() => setActiveGameId(null)} />;
      
      // Dynamic Game Engine
      if (activeGameId && activeGameId.startsWith('BIZ_')) {
          return <GameEngine gameId={activeGameId} onExit={() => setActiveGameId(null)} />;
      }

      return <GameMenu onSelectGame={setActiveGameId} />;
  };

  const getActiveBatch = () => {
      if (!activeLessonId) return [];
      const targetLesson = lessons.find(l => l.id === activeLessonId);
      if (!targetLesson) return [];
      return lessons.filter(l => l.topic_tag === targetLesson.topic_tag);
  };

  const activeUnits = getActiveBatch();
  const LogoIcon = user.businessLogo ? ICON_MAP[user.businessLogo.icon] || Rocket : Rocket;

  return (
    <>
        <Layout activeTab={activeTab} onNavigate={handleNavigate}>
        {activeLessonId && activeUnits.length > 0 ? (
            <UniversalLessonEngine 
                units={activeUnits} 
                onExit={() => setActiveLessonId(null)} 
            />
        ) : (
            <>
            {user.role === UserRole.KID && (
                <>
                    {activeTab === 'map' && <KidMap onStartLesson={(id) => setActiveLessonId(id)} />}
                    {activeTab === 'assignments' && <StudentAssignmentDashboard />}
                    {activeTab === 'games' && renderGame()}
                    {activeTab === 'store' && <BizStore />}
                    {activeTab === 'leaderboard' && <Leaderboard />}
                    {activeTab === 'hq' && <Headquarters />}
                    {activeTab === 'skills' && <SkillTree />}
                    {activeTab === 'portfolio' && <Portfolio />}
                    {activeTab === 'profile' && (
                        <div className="text-center py-10 space-y-8">
                            <div>
                                {/* AVATAR RENDER */}
                                <div className="relative w-40 h-40 mx-auto mb-6">
                                    {user.businessLogo ? (
                                        <div 
                                            className={`w-full h-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden relative z-0
                                                ${user.businessLogo.shape === 'circle' ? 'rounded-full' : user.businessLogo.shape === 'rounded' ? 'rounded-3xl' : 'rounded-none'}
                                            `}
                                            style={{ backgroundColor: user.businessLogo.backgroundColor }}
                                        >
                                            <LogoIcon 
                                                size={80} 
                                                color={user.businessLogo.iconColor || '#FFF'} 
                                                strokeWidth={2.5}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-6xl shadow-lg border-4 border-white">
                                            🏆
                                        </div>
                                    )}
                                    {user.equippedItems.map(itemId => {
                                        const item = SHOP_ITEMS.find(i => i.id === itemId);
                                        if (!item) return null;
                                        let positionClass = "top-0 left-0";
                                        let scaleClass = "scale-100";
                                        if (item.id.includes('hat') || item.id.includes('crown') || item.id.includes('helmet') || item.id.includes('cap') || item.id.includes('beret') || item.id.includes('tiara')) {
                                            positionClass = "-top-10 left-1/2 -translate-x-1/2 z-20";
                                            scaleClass = "scale-150";
                                        }
                                        if (item.id.includes('sunglasses') || item.id.includes('monocle')) {
                                            positionClass = "top-10 left-1/2 -translate-x-1/2 z-20";
                                            scaleClass = "scale-125";
                                        }
                                        if (item.id.includes('suit') || item.id.includes('cape') || item.id.includes('gear')) {
                                            positionClass = "bottom-0 right-0 z-20";
                                            scaleClass = "scale-75 origin-bottom-right";
                                        }
                                        return (
                                            <div key={itemId} className={`absolute ${positionClass} ${scaleClass} text-5xl drop-shadow-md`}>
                                                {item.icon}
                                            </div>
                                        );
                                    })}
                                </div>

                                <h2 className="text-2xl font-black text-gray-800">My Profile</h2>
                                {user.businessLogo && (
                                    <h3 className="text-xl font-bold text-gray-600 mt-2">{user.businessLogo.companyName}</h3>
                                )}
                                
                                <button onClick={() => setActiveGameId('brand')} className="mt-4 text-sm font-bold text-blue-500 hover:underline">Edit Brand Logo</button>
                            </div>
                            
                            {!user.classId && (
                                <button onClick={() => setShowJoinClass(true)} className="bg-blue-100 text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-200 transition-colors">Join a Class</button>
                            )}

                            {user.classId && <div className="inline-block bg-blue-50 px-6 py-2 rounded-xl text-blue-600 font-bold border border-blue-100">Student of Future Founders 101</div>}

                            <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                                <h3 className="text-gray-500 font-bold mb-4 uppercase text-sm tracking-widest">My Wardrobe</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {user.inventory.filter(itemId => !itemId.startsWith('cons_')).map(itemId => {
                                            const item = SHOP_ITEMS.find(i => i.id === itemId);
                                            if (!item) return null;
                                            const isEquipped = user.equippedItems.includes(itemId);
                                            return (
                                                <button key={itemId} onClick={() => toggleEquipItem(itemId)} className={`p-4 rounded-xl shadow-sm border-2 transition-all relative flex flex-col items-center gap-2 ${isEquipped ? 'bg-green-50 border-green-400 ring-2 ring-green-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                                                    <div className="text-4xl">{item.icon}</div>
                                                    <div className="text-xs font-bold text-gray-600 leading-tight">{item.name}</div>
                                                    {isEquipped && <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-0.5"><Check size={12} strokeWidth={4} /></div>}
                                                </button>
                                            );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {user.role === UserRole.PARENT && activeTab === 'parent_dashboard' && <ParentDashboard />}
            {user.role === UserRole.TEACHER && activeTab === 'teacher_dashboard' && <TeacherDashboard />}
            {user.role === UserRole.ADMIN && activeTab === 'admin_dashboard' && <AdminDashboard />}
            </>
        )}
        </Layout>
        
        <LevelUpModal />
        <OllieChat />
        {showJoinClass && <JoinClassModal onClose={() => setShowJoinClass(false)} />}
    </>
  );
};

export default App;
