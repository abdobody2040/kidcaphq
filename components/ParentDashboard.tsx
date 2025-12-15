
import React, { useState } from 'react';
import { useAppStore, SKILLS_DB, SHOP_ITEMS, MOCK_LEADERBOARD } from '../store';
import { manageSubscription } from '../services/stripeService';
import { Clock, BookOpen, Flame, Bell, Music, CreditCard, RefreshCw, Check, Loader2, UserPlus, Zap, TrendingUp, Award, Brain, Briefcase, CheckCircle } from 'lucide-react';
import StripePaymentPage from './StripePaymentPage';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../types';

const ParentDashboard: React.FC = () => {
  const { user, users, updateUserSettings, upgradeSubscription, library } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { t } = useTranslation();

  if (!user) return null;

  // Determine Subject: Is this a Parent looking at a Child, or a Kid looking at themselves?
  let subject = user;
  if (user.role === UserRole.PARENT && user.linkedChildId) {
      const child = users.find(u => u.id === user.linkedChildId);
      if (child) subject = child;
  }

  // Fallback for parent with no link
  if (user.role === UserRole.PARENT && !user.linkedChildId) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                  <UserPlus size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">No Child Account Linked</h2>
              <p className="text-gray-500 font-medium max-w-md mb-8">
                  It looks like you haven't linked a student account yet. Please contact support or have your child join a class to sync data.
              </p>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700 font-bold">
                  Demo Mode: Sign up a new Kid account named "Leo" to see this dashboard populate automatically.
              </div>
          </div>
      );
  }

  const isPremium = user.subscriptionStatus === 'PREMIUM';

  // --- CALCULATE STATS ---
  
  // 1. Net Worth (Coins + Inventory Value + Business Value)
  const inventoryValue = subject.inventory.reduce((sum, id) => {
      const item = SHOP_ITEMS.find(i => i.id === id);
      return sum + (item?.cost || 0);
  }, 0);
  const businessValue = subject.portfolio.reduce((sum, p) => sum + (p.managerLevel * 1000), 0);
  const netWorth = subject.bizCoins + (inventoryValue * 0.5) + businessValue;

  // 1b. Dynamic Percentile Calculation
  // Add current user to leaderboard mock for calc (if not present)
  const allScores = [...MOCK_LEADERBOARD.map(e => e.xp), subject.xp].sort((a,b) => a - b);
  const rankIndex = allScores.indexOf(subject.xp);
  const percentile = Math.round(((rankIndex + 1) / allScores.length) * 100);
  const rankLabel = percentile >= 90 ? "Top 10%" : percentile >= 50 ? "Top 50%" : "Rising Star";

  // 2. Strongest Skill (Dynamic with Empty State)
  const skillCounts: Record<string, number> = { CHARISMA: 0, EFFICIENCY: 0, WISDOM: 0 };
  subject.unlockedSkills.forEach(id => {
      const skill = SKILLS_DB.find(s => s.id === id);
      if (skill) skillCounts[skill.category]++;
  });
  
  let strongestSkill = "NONE";
  if (subject.unlockedSkills.length > 0) {
      strongestSkill = Object.keys(skillCounts).reduce((a, b) => skillCounts[a] > skillCounts[b] ? a : b);
  }
  
  // 3. Books Read
  const booksRead = (subject.readBookIds || []).map(id => library.find(b => b.id === id)).filter(Boolean);

  // Mock graph data based on XP
  const xpGraphData = [
       { day: 'Mon', xp: Math.max(0, subject.xp - 300) },
       { day: 'Tue', xp: Math.max(0, subject.xp - 250) },
       { day: 'Wed', xp: Math.max(0, subject.xp - 180) },
       { day: 'Thu', xp: Math.max(0, subject.xp - 100) },
       { day: 'Fri', xp: Math.max(0, subject.xp - 50) },
       { day: 'Sat', xp: subject.xp }, // Today
       { day: 'Sun', xp: 0 },
  ];
  
  const displayGraph = xpGraphData.map((d, i, arr) => {
      const prev = i > 0 ? arr[i-1].xp : 0;
      return { day: d.day, xp: Math.max(0, d.xp - prev) };
  });
  displayGraph[5].xp = 50; 

  const maxXP = Math.max(...displayGraph.map(d => d.xp), 100);

  const handleUpgradeClick = () => {
      setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
      // Default to highest tier for Pro upgrade button for now
      upgradeSubscription('tycoon');
      setShowPayment(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleManage = async () => {
      setIsProcessing(true);
      const url = await manageSubscription();
      alert(`Opening Billing Portal... \n(Simulated: ${url})`);
      setIsProcessing(false);
  };

  return (
    <>
    {/* PAYMENT OVERLAY */}
    <AnimatePresence>
        {showPayment && (
            <StripePaymentPage 
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPayment(false)}
                planName="KidCap Pro (Monthly)"
                price={9.99}
            />
        )}
    </AnimatePresence>

    {/* SUCCESS TOAST */}
    <AnimatePresence>
        {showSuccessToast && (
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-4 border-green-400"
            >
                <div className="bg-white text-green-600 rounded-full p-1"><Check size={24} strokeWidth={4} /></div>
                <div>
                    <h4 className="font-black text-lg">Welcome to Premium!</h4>
                    <p className="font-medium text-sm text-green-100">Your account has been upgraded.</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>

    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-white">
                {user.role === UserRole.KID ? "CEO Report Card" : t('parent.title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
                {user.role === UserRole.KID ? "Track your empire's growth." : t('parent.monitoring')} 
                <span className="text-kid-accent font-bold ml-1">{subject.name}</span>
            </p>
          </div>
          {user.role === UserRole.PARENT && (
              <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                 <RefreshCw size={18} /> {t('parent.sync')}
              </button>
          )}
      </div>

      {/* CEO REPORT CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award size={150} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {/* Net Worth */}
              <div className="space-y-2">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Est. Net Worth</div>
                  <div className="text-4xl font-black text-green-600 dark:text-green-400">${Math.floor(netWorth).toLocaleString()}</div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <TrendingUp size={12} className={percentile > 50 ? "text-green-500" : "text-yellow-500"} /> {rankLabel}
                  </div>
              </div>

              {/* CEO Level */}
              <div className="space-y-2">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">CEO Rank</div>
                  <div className="text-4xl font-black text-gray-800 dark:text-white">Level {subject.level}</div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-3/4"></div>
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{subject.xp} XP Earned</div>
              </div>

              {/* Strongest Skill */}
              <div className="space-y-2">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Top Skill</div>
                  <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${strongestSkill === 'NONE' ? 'bg-gray-100 text-gray-400' : strongestSkill === 'CHARISMA' ? 'bg-pink-100 text-pink-600' : strongestSkill === 'EFFICIENCY' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {strongestSkill === 'NONE' ? <Zap size={24} /> : strongestSkill === 'CHARISMA' ? <Zap size={24} /> : strongestSkill === 'EFFICIENCY' ? <Clock size={24} /> : <Brain size={24} />}
                      </div>
                      <div className="text-2xl font-black text-gray-800 dark:text-white">{strongestSkill === 'NONE' ? "None Yet" : strongestSkill}</div>
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      {subject.unlockedSkills.length} Skills Unlocked
                  </div>
              </div>

              {/* Reading Stats */}
              <div className="space-y-2">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Library</div>
                  <div className="text-4xl font-black text-yellow-500">{booksRead.length}</div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">Books Completed</div>
              </div>
          </div>
      </div>

      {/* Books Read List */}
      {booksRead.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-3xl p-6">
              <h3 className="text-lg font-black text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                  <BookOpen size={20} /> CEO Reading List
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {booksRead.map((book: any) => (
                      <div key={book.id} className="min-w-[200px] bg-white dark:bg-gray-800 p-3 rounded-xl border border-amber-100 dark:border-gray-700 shadow-sm flex gap-3 items-center">
                          <img src={book.coverUrl} alt="Cover" className="w-10 h-14 object-cover rounded bg-gray-200" />
                          <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-800 dark:text-white text-sm truncate">{book.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{book.author}</div>
                          </div>
                          <div className="text-green-500"><CheckCircle size={16} /></div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Stats Cards (Legacy) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Clock className="text-blue-500"/>} label={t('parent.stat_xp')} value={subject.xp.toString()} color="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard icon={<Briefcase className="text-green-500"/>} label={t('parent.stat_lessons')} value={subject.completedLessonIds.length.toString()} color="bg-green-50 dark:bg-green-900/20" />
        <StatCard icon={<Flame className="text-orange-500"/>} label={t('parent.stat_streak')} value={`${subject.streak} ${t('stats.days')}`} color="bg-orange-50 dark:bg-orange-900/20" />
      </div>

      {/* Activity Graph */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
         <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">{t('parent.graph_title')}</h3>
         <div className="h-64 flex items-end justify-between gap-4" dir="ltr">
            {displayGraph.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex justify-end flex-col h-full rounded-t-xl overflow-hidden bg-gray-50 dark:bg-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
                        <div 
                           className="w-full bg-kid-primary rounded-t-xl transition-all duration-1000 ease-out relative group-hover:opacity-80"
                           style={{ height: `${(d.xp / maxXP) * 100}%` }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {d.xp}xp
                            </div>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{d.day}</span>
                </div>
            ))}
         </div>
      </div>

      {/* Settings Control Panel (Only if viewing as Parent or if user is owner) */}
      {user.role === UserRole.PARENT && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                 <span>⚙️</span> {t('parent.settings_title')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                      <div>
                          <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('parent.label_goal')}</label>
                          <select 
                            value={subject.settings.dailyGoalMinutes}
                            onChange={(e) => updateUserSettings({ dailyGoalMinutes: parseInt(e.target.value) })}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 font-bold text-gray-700 dark:text-white focus:border-kid-accent outline-none"
                          >
                              <option value={10}>10 Min</option>
                              <option value={15}>15 Min</option>
                              <option value={30}>30 Min</option>
                          </select>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300"><Bell size={20} /></div>
                              <span className="font-bold text-gray-700 dark:text-gray-200">{t('parent.label_sound')}</span>
                          </div>
                          <Toggle 
                             checked={subject.settings.soundEnabled} 
                             onChange={() => updateUserSettings({ soundEnabled: !subject.settings.soundEnabled })} 
                          />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-300"><Music size={20} /></div>
                              <span className="font-bold text-gray-700 dark:text-gray-200">{t('parent.label_music')}</span>
                          </div>
                          <Toggle 
                             checked={subject.settings.musicEnabled} 
                             onChange={() => updateUserSettings({ musicEnabled: !subject.settings.musicEnabled })} 
                          />
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="p-4 rounded-xl border-l-4 border-red-400 bg-red-50 dark:bg-red-900/20">
                          <h4 className="font-bold text-red-700 dark:text-red-400 mb-1">{t('parent.danger_zone')}</h4>
                          <p className="text-xs text-red-500 dark:text-red-300 mb-4">{t('parent.danger_desc')}</p>
                          <button className="text-sm bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold py-2 px-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                              {t('parent.reset_pwd')}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
    </>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
    <div className={`${color} p-6 rounded-2xl flex items-center gap-4`}>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">{icon}</div>
        <div>
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">{label}</div>
            <div className="text-2xl font-black text-gray-800 dark:text-white">{value}</div>
        </div>
    </div>
);

const Toggle = ({ checked, onChange }: any) => (
    <button 
      onClick={onChange}
      className={`w-14 h-8 rounded-full p-1 transition-colors ${checked ? 'bg-kid-secondary' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

export default ParentDashboard;
