
import React, { useEffect, useState } from 'react';
import { useAppStore, LEVEL_THRESHOLDS } from '../store';
import { UserRole } from '../types';
import { Trophy, Flame, Coins, Map as MapIcon, Gamepad2, LayoutDashboard, LogOut, ShoppingBag, Medal, School, Settings, Building2, Brain, Briefcase, Snowflake, Shield, Menu, X, ClipboardList, Book, UserCheck, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundService } from '../services/SoundService';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';
import InvestorPitchModal from './InvestorPitchModal';
import EnergyBar from './EnergyBar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {
  const { user, logout } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
      const handleClick = () => {
          if (user?.settings.soundEnabled) SoundService.playClick();
      };
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, [user?.settings.soundEnabled]);

  if (!user) return <>{children}</>;

  const isKid = user.role === UserRole.KID;
  const isParent = user.role === UserRole.PARENT;
  const isTeacher = user.role === UserRole.TEACHER;
  const isAdmin = user.role === UserRole.ADMIN;
  
  const safeLevel = typeof user.level === 'number' ? user.level : 1;
  const safeXP = typeof user.xp === 'number' ? user.xp : 0;
  const safeStreak = typeof user.streak === 'number' ? user.streak : 0;
  const safeCoins = typeof user.bizCoins === 'number' ? user.bizCoins : 0;

  const currentLevelBase = LEVEL_THRESHOLDS[safeLevel - 1] || 0;
  const nextLevelThreshold = LEVEL_THRESHOLDS[safeLevel] || safeXP * 1.5;
  const progressPercent = Math.min(100, Math.max(0, ((safeXP - currentLevelBase) / (nextLevelThreshold - currentLevelBase)) * 100));

  const hasFreeze = user.inventory.includes('item_freeze');
  const isIntern = user.subscriptionTier === 'intern';

  const handleNav = (tab: string) => {
      onNavigate(tab);
      setMobileMenuOpen(false);
  };

  const handleParentDashboardClick = () => {
      if (['board', 'tycoon'].includes(user.subscriptionTier)) {
          handleNav('parent_dashboard');
      } else {
          setShowPaywall(true);
      }
  };

  const NavContent = () => (
      <>
        {/* Header - Hidden on Mobile */}
        <div className="flex items-center justify-between mb-8 px-2 md:block hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-kid-secondary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_4px_0_0_rgba(21,128,61,1)]">K</div>
            <div>
                <h1 className="text-2xl font-black text-kid-secondary tracking-tight">{t('auth.title')}</h1>
                <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded w-fit
                    ${user.subscriptionTier === 'tycoon' ? 'bg-yellow-400 text-yellow-900' :
                      user.subscriptionTier === 'board' ? 'bg-purple-100 text-purple-800' :
                      user.subscriptionTier === 'founder' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}
                `}>
                    {user.subscriptionTier} Plan
                </div>
            </div>
          </div>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar px-1">
          {isKid && (
            <>
              <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-4 mb-2">{t('nav.section_learn')}</div>
              <NavItem icon={<MapIcon size={24} />} label={t('nav.map')} active={activeTab === 'map'} onClick={() => handleNav('map')} />
              <NavItem icon={<ClipboardList size={24} />} label={t('nav.assignments')} active={activeTab === 'assignments'} onClick={() => handleNav('assignments')} />
              <NavItem icon={<Gamepad2 size={24} />} label={t('nav.games')} active={activeTab === 'games'} onClick={() => handleNav('games')} />
              <NavItem icon={<Book size={24} />} label={t('nav.library')} active={activeTab === 'library'} onClick={() => handleNav('library')} />
              
              <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-6 mb-2">{t('nav.section_empire')}</div>
              <NavItem icon={<Building2 size={24} />} label={t('nav.hq')} active={activeTab === 'hq'} onClick={() => handleNav('hq')} />
              <NavItem icon={<Brain size={24} />} label={t('nav.skills')} active={activeTab === 'skills'} onClick={() => handleNav('skills')} />
              <NavItem icon={<Briefcase size={24} />} label={t('nav.portfolio')} active={activeTab === 'portfolio'} onClick={() => handleNav('portfolio')} />

              <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-6 mb-2">{t('nav.section_social')}</div>
              <NavItem icon={<ShoppingBag size={24} />} label={t('nav.store')} active={activeTab === 'store'} onClick={() => handleNav('store')} />
              <NavItem icon={<Medal size={24} />} label={t('nav.leaderboard')} active={activeTab === 'leaderboard'} onClick={() => handleNav('leaderboard')} />
              <NavItem icon={<Trophy size={24} />} label={t('nav.profile')} active={activeTab === 'profile'} onClick={() => handleNav('profile')} />
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <NavItem icon={<UserCheck size={24} />} label="For Parents" active={activeTab === 'parent_dashboard'} onClick={handleParentDashboardClick} />
              </div>
            </>
          )}

          {isParent && <NavItem icon={<LayoutDashboard size={24} />} label={t('nav.overview')} active={activeTab === 'parent_dashboard'} onClick={() => handleNav('parent_dashboard')} />}
          {isTeacher && <NavItem icon={<School size={24} />} label={t('nav.classroom')} active={activeTab === 'teacher_dashboard'} onClick={() => handleNav('teacher_dashboard')} />}
          {isAdmin && <NavItem icon={<Shield size={24} />} label={t('nav.admin')} active={activeTab === 'admin_dashboard'} onClick={() => handleNav('admin_dashboard')} />}
        </div>

        {/* Stats - Desktop Only */}
        {isKid && (
          <div className="mb-4 space-y-3 px-2 mt-4 hidden md:block shrink-0">
             <div className="flex justify-center pb-2"><EnergyBar /></div>
             <div className="flex items-center justify-between text-orange-500 font-bold p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl relative overflow-hidden">
                <div className="flex items-center gap-2 relative z-10"><Flame size={20} className="fill-current" /> {t('stats.streak')}</div>
                <span className="relative z-10">{safeStreak} {t('stats.days')}</span>
                {hasFreeze && <div className="absolute end-0 top-0 bottom-0 bg-blue-100 dark:bg-blue-900/30 w-8 flex items-center justify-center border-s border-blue-200 dark:border-blue-800"><Snowflake size={16} className="text-blue-500" /></div>}
             </div>
             <div className="flex items-center justify-between text-yellow-600 dark:text-yellow-400 font-bold p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="flex items-center gap-2"><Coins size={20} className="fill-yellow-400" /> {t('stats.bizcoins')}</div>
                <span>{safeCoins}</span>
             </div>
             <div className="space-y-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center justify-between text-blue-500 font-bold text-sm">
                    <div className="flex items-center gap-2">{t('stats.level')} {safeLevel}</div>
                    <span>{safeXP} XP</span>
                </div>
                <div className="h-3 w-full bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden" dir="ltr">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-blue-500 rounded-full" />
                </div>
             </div>
          </div>
        )}

        {/* Sticky Footer (Logout) */}
        <div className="border-t dark:border-gray-700 pt-4 mt-auto shrink-0 pb-safe">
             {isTeacher && <div className="px-4 py-2 mb-2 text-sm font-bold text-gray-500">{t('nav.teacher_mode')}</div>}
             {isAdmin && <div className="px-4 py-2 mb-2 text-sm font-bold text-red-500">{t('nav.admin_mode')}</div>}
            
            <div className="flex items-center justify-between px-4 mb-2">
                <ThemeToggle />
                <LanguageToggle />
            </div>

            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors">
                <LogOut size={24} /> {t('nav.signout')}
            </button>
        </div>
      </>
  );

  return (
    <div className="h-screen bg-green-50 dark:bg-gray-900 flex flex-col md:flex-row font-sans overflow-hidden transition-colors duration-200">
      <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* MOBILE TOP BAR */}
      <div className="md:hidden h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between shrink-0 z-30 fixed top-0 start-0 end-0 w-full">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-kid-secondary rounded-lg flex items-center justify-center text-white font-black text-lg">K</div>
            <span className="font-black text-gray-800 dark:text-white text-lg">KidCap</span>
         </div>
         <div className="flex items-center gap-3">
             <EnergyBar />
             <ThemeToggle />
             <LanguageToggle />
             {isKid && (
                 <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs font-bold text-yellow-800 dark:text-yellow-300">
                     <Coins size={14} className="fill-yellow-500 text-yellow-600 dark:text-yellow-400" /> {safeCoins}
                 </div>
             )}
             <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300"><Menu /></button>
         </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <nav className={`hidden md:flex w-64 bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700 p-4 flex-col h-full overflow-hidden z-20 ${isIntern ? 'pb-16' : ''}`}>
        <NavContent />
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween' }}
                className="fixed inset-0 z-[200] bg-white dark:bg-gray-800 flex flex-col p-4 md:hidden h-[100dvh]"
            >
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h2 className="text-xl font-black text-gray-800 dark:text-white">{t('common.menu')}</h2>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"><X /></button>
                </div>
                <NavContent />
            </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className={`flex-1 p-4 md:p-8 overflow-y-auto relative scroll-smooth pt-20 pb-36 md:pt-8 h-full bg-green-50 dark:bg-gray-900 transition-colors duration-200 ${isIntern ? 'md:pb-24' : 'md:pb-8'}`}>
        <div className="max-w-4xl mx-auto h-full">
           {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 flex justify-around items-center shrink-0 z-30 fixed bottom-0 start-0 end-0 pb-safe transition-colors duration-200">
           <MobileNavItem icon={<MapIcon size={24} />} label={t('nav.map')} active={activeTab === 'map'} onClick={() => handleNav('map')} />
           <MobileNavItem icon={<Gamepad2 size={24} />} label={t('nav.games')} active={activeTab === 'games'} onClick={() => handleNav('games')} />
           <MobileNavItem icon={<Book size={24} />} label={t('nav.library')} active={activeTab === 'library'} onClick={() => handleNav('library')} />
           <MobileNavItem icon={<Trophy size={24} />} label={t('nav.profile')} active={activeTab === 'profile'} onClick={() => handleNav('profile')} />
      </div>

      {isIntern && (
          <div className="fixed bottom-20 md:bottom-0 left-0 right-0 h-12 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 z-40 border-t border-gray-300 dark:border-gray-700">
              Ads support free learning. Upgrade to remove.
          </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-extrabold text-lg transition-all border-b-4 text-start
      ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'bg-transparent text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'}`}
  >
    {icon}
    {label}
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${active ? 'text-kid-secondary' : 'text-gray-400 dark:text-gray-500'}`}>
    <div className={`p-1 rounded-xl transition-all ${active ? 'bg-green-50 dark:bg-green-900/20 -translate-y-1' : ''}`}>{icon}</div>
    <span className="text-[10px] font-bold uppercase truncate max-w-[60px]">{label}</span>
  </button>
);

export default Layout;
