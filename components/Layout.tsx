
import React, { useEffect } from 'react';
import { useAppStore, LEVEL_THRESHOLDS } from '../store';
import { UserRole } from '../types';
import { Trophy, Flame, Coins, Map as MapIcon, Gamepad2, LayoutDashboard, LogOut, ShoppingBag, Medal, School, Settings, Building2, Brain, Briefcase, Snowflake, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { SoundService } from '../services/SoundService';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {
  const { user, logout } = useAppStore();

  // Global Click Sound
  useEffect(() => {
      const handleClick = () => {
          if (user?.settings.soundEnabled) {
              SoundService.playClick();
          }
      };
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, [user?.settings.soundEnabled]);

  if (!user) return <>{children}</>;

  const isKid = user.role === UserRole.KID;
  const isParent = user.role === UserRole.PARENT;
  const isTeacher = user.role === UserRole.TEACHER;
  const isAdmin = user.role === UserRole.ADMIN;
  
  // Defensive checks for potential object contamination in local storage
  const safeLevel = typeof user.level === 'number' ? user.level : 1;
  const safeXP = typeof user.xp === 'number' ? user.xp : 0;
  const safeStreak = typeof user.streak === 'number' ? user.streak : 0;
  const safeCoins = typeof user.bizCoins === 'number' ? user.bizCoins : 0;

  const currentLevelBase = LEVEL_THRESHOLDS[safeLevel - 1] || 0;
  const nextLevelThreshold = LEVEL_THRESHOLDS[safeLevel] || safeXP * 1.5;
  const progressPercent = Math.min(100, Math.max(0, ((safeXP - currentLevelBase) / (nextLevelThreshold - currentLevelBase)) * 100));

  const hasFreeze = user.inventory.includes('item_freeze');

  return (
    <div className="min-h-screen bg-green-50 flex flex-col md:flex-row font-sans">
      <nav className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex flex-col md:h-screen sticky top-0 z-20 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-kid-secondary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_4px_0_0_rgba(21,128,61,1)]">
            K
          </div>
          <h1 className="text-2xl font-black text-kid-secondary tracking-tight">KidCap HQ</h1>
        </div>

        <div className="flex-1 space-y-2">
          {isKid && (
            <>
              <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-4 mb-2">Learn & Play</div>
              <NavItem 
                icon={<MapIcon size={24} />} 
                label="Adventure Map" 
                active={activeTab === 'map'} 
                onClick={() => onNavigate('map')} 
              />
              <NavItem 
                icon={<Gamepad2 size={24} />} 
                label="Games" 
                active={activeTab === 'games'} 
                onClick={() => onNavigate('games')} 
              />
              
              <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-6 mb-2">My Empire</div>
              <NavItem 
                icon={<Building2 size={24} />} 
                label="Headquarters" 
                active={activeTab === 'hq'} 
                onClick={() => onNavigate('hq')} 
              />
              <NavItem 
                icon={<Brain size={24} />} 
                label="MBA Skills" 
                active={activeTab === 'skills'} 
                onClick={() => onNavigate('skills')} 
              />
              <NavItem 
                icon={<Briefcase size={24} />} 
                label="Portfolio" 
                active={activeTab === 'portfolio'} 
                onClick={() => onNavigate('portfolio')} 
              />

              <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-6 mb-2">Social</div>
              <NavItem 
                icon={<ShoppingBag size={24} />} 
                label="Biz Store" 
                active={activeTab === 'store'} 
                onClick={() => onNavigate('store')} 
              />
              <NavItem 
                icon={<Medal size={24} />} 
                label="Leaderboard" 
                active={activeTab === 'leaderboard'} 
                onClick={() => onNavigate('leaderboard')} 
              />
              <NavItem 
                icon={<Trophy size={24} />} 
                label="My Profile" 
                active={activeTab === 'profile'} 
                onClick={() => onNavigate('profile')} 
              />
            </>
          )}

          {isParent && (
             <>
                <NavItem 
                    icon={<LayoutDashboard size={24} />} 
                    label="Overview" 
                    active={activeTab === 'parent_dashboard'} 
                    onClick={() => onNavigate('parent_dashboard')} 
                />
             </>
          )}

          {isTeacher && (
             <>
                <NavItem 
                    icon={<School size={24} />} 
                    label="Classroom" 
                    active={activeTab === 'teacher_dashboard'} 
                    onClick={() => onNavigate('teacher_dashboard')} 
                />
             </>
          )}

          {isAdmin && (
             <>
                <div className="text-xs font-bold text-red-400 uppercase px-4 mt-4 mb-2">System</div>
                <NavItem 
                    icon={<Shield size={24} />} 
                    label="Admin Dashboard" 
                    active={activeTab === 'admin_dashboard'} 
                    onClick={() => onNavigate('admin_dashboard')} 
                />
             </>
          )}
        </div>

        {/* User Stats (Kid only) */}
        {isKid && (
          <div className="mb-6 space-y-3 px-2 mt-4">
             {/* Streak */}
            <div className="flex items-center justify-between text-orange-500 font-bold p-2 bg-orange-50 rounded-xl relative overflow-hidden">
              <div className="flex items-center gap-2 relative z-10"><Flame size={20} className="fill-current" /> Streak</div>
              <span className="relative z-10">{safeStreak} days</span>
              
              {/* Freeze Indicator */}
              {hasFreeze && (
                  <div className="absolute right-0 top-0 bottom-0 bg-blue-100 w-8 flex items-center justify-center border-l border-blue-200" title="Streak Protected">
                      <Snowflake size={16} className="text-blue-500" />
                  </div>
              )}
            </div>

            {/* Coins */}
            <div className="flex items-center justify-between text-yellow-600 font-bold p-2 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-2"><Coins size={20} className="fill-yellow-400 text-yellow-600" /> BizCoins</div>
              <motion.span 
                 key={safeCoins}
                 initial={{ scale: 1.5, color: '#16a34a' }}
                 animate={{ scale: 1, color: '#ca8a04' }}
              >
                  {safeCoins}
              </motion.span>
            </div>

            {/* XP / Level */}
            <div className="space-y-1 p-2 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between text-blue-500 font-bold text-sm">
                    <div className="flex items-center gap-2">Lvl {safeLevel}</div>
                    <span>{safeXP} XP</span>
                </div>
                <div className="h-3 w-full bg-blue-200 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-blue-500 rounded-full"
                    />
                </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
             {isTeacher && <div className="px-4 py-2 mb-2 text-sm font-bold text-gray-500">Teacher Mode</div>}
             {isAdmin && <div className="px-4 py-2 mb-2 text-sm font-bold text-red-500">Admin Mode</div>}
             
            <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-colors"
            >
            <LogOut size={24} />
            Sign Out
            </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-extrabold text-lg transition-all border-b-4 
      ${active 
        ? 'bg-blue-50 text-blue-500 border-blue-200' 
        : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'}`}
  >
    {icon}
    {label}
  </button>
);

export default Layout;
