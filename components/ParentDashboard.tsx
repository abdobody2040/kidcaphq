
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { createCheckoutSession, manageSubscription } from '../services/stripeService';
import { Clock, BookOpen, Flame, Bell, Music, CreditCard, RefreshCw, Check, Loader2 } from 'lucide-react';

const ParentDashboard: React.FC = () => {
  const { user, users, updateUserSettings, upgradeSubscription } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user || !user.linkedChildId) return null;

  // FETCH REAL CHILD DATA
  const child = users.find(u => u.id === user.linkedChildId);

  if (!child) return <div className="p-8 text-center font-bold text-gray-500">Child account not found.</div>;

  const isPremium = user.subscriptionStatus === 'PREMIUM';

  // Calculate Stats
  const completedModulesCount = child.completedLessonIds.length > 0 
    ? new Set(child.completedLessonIds.map(id => id.split('_')[0])).size // Approximate module count by prefix logic or just raw count
    : 0;

  // Mock graph data based on XP (since we don't have historical daily XP in User model yet)
  // We will simulate a graph based on current XP
  const xpGraphData = [
       { day: 'Mon', xp: Math.max(0, child.xp - 300) },
       { day: 'Tue', xp: Math.max(0, child.xp - 250) },
       { day: 'Wed', xp: Math.max(0, child.xp - 180) },
       { day: 'Thu', xp: Math.max(0, child.xp - 100) },
       { day: 'Fri', xp: Math.max(0, child.xp - 50) },
       { day: 'Sat', xp: child.xp }, // Today
       { day: 'Sun', xp: 0 },
  ];
  
  // Normalize for display (show daily gain, not cumulative, loosely approximated)
  const displayGraph = xpGraphData.map((d, i, arr) => {
      const prev = i > 0 ? arr[i-1].xp : 0;
      return { day: d.day, xp: Math.max(0, d.xp - prev) };
  });
  // Fix the last day (Sat) to just show a value
  displayGraph[5].xp = 50; 

  const maxXP = Math.max(...displayGraph.map(d => d.xp), 100);

  const handleUpgrade = async () => {
      setIsProcessing(true);
      try {
          const response = await createCheckoutSession('monthly_plan');
          if (response.success && response.redirectUrl) {
              // Simulate redirection
              alert(`Redirecting to Stripe... \n(Simulated: ${response.redirectUrl})`);
              
              // In this demo, we auto-upgrade after "payment"
              setTimeout(() => {
                  upgradeSubscription('PREMIUM');
                  setIsProcessing(false);
                  alert("Welcome to Premium! (Simulation Complete)");
              }, 1500);
          } else {
              alert("Checkout failed: " + response.error);
              setIsProcessing(false);
          }
      } catch (e) {
          console.error(e);
          setIsProcessing(false);
      }
  };

  const handleManage = async () => {
      setIsProcessing(true);
      const url = await manageSubscription();
      alert(`Opening Billing Portal... \n(Simulated: ${url})`);
      setIsProcessing(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-800">Parent Dashboard</h2>
            <p className="text-gray-500 font-medium">Monitoring: <span className="text-kid-accent font-bold">{child.name}</span></p>
          </div>
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2">
             <RefreshCw size={18} /> Sync Data
          </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Clock className="text-blue-500"/>} label="Total XP" value={child.xp.toString()} color="bg-blue-50" />
        <StatCard icon={<BookOpen className="text-green-500"/>} label="Lessons Done" value={child.completedLessonIds.length.toString()} color="bg-green-50" />
        <StatCard icon={<Flame className="text-orange-500"/>} label="Current Streak" value={`${child.streak} Days`} color="bg-orange-50" />
      </div>

      {/* Activity Graph */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
         <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Activity (Est. XP Earned)</h3>
         <div className="h-64 flex items-end justify-between gap-4">
            {displayGraph.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex justify-end flex-col h-full rounded-t-xl overflow-hidden bg-gray-50 group-hover:bg-gray-100 transition-colors">
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

      {/* SUBSCRIPTION & BILLING */}
      <div className={`rounded-3xl p-8 shadow-sm border-2 relative overflow-hidden ${isPremium ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white border-transparent' : 'bg-white border-gray-200'}`}>
          {isPremium ? (
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                          <Check size={20} strokeWidth={3} />
                          <span className="font-black tracking-widest text-xs uppercase">Premium Active</span>
                      </div>
                      <h3 className="text-2xl font-black mb-1">KidCap Pro</h3>
                      <p className="text-gray-400 text-sm">Next billing date: July 15, 2025</p>
                  </div>
                  <button 
                    onClick={handleManage}
                    disabled={isProcessing}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
                  >
                      {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                      Manage Subscription
                  </button>
              </div>
          ) : (
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-800 mb-2">Unlock Full Potential</h3>
                      <p className="text-gray-500 font-medium mb-4">Get unlimited access to all 30+ business simulations, AI tutoring, and advanced analytics.</p>
                      <div className="flex gap-4 text-sm font-bold text-gray-600">
                          <span className="flex items-center gap-1"><Check size={16} className="text-green-500"/> No Ads</span>
                          <span className="flex items-center gap-1"><Check size={16} className="text-green-500"/> All Games</span>
                          <span className="flex items-center gap-1"><Check size={16} className="text-green-500"/> AI Tutor</span>
                      </div>
                  </div>
                  <div className="text-center">
                      <div className="text-3xl font-black text-gray-800 mb-2">$9.99<span className="text-base text-gray-400 font-bold">/mo</span></div>
                      <button 
                        onClick={handleUpgrade}
                        disabled={isProcessing}
                        className="bg-kid-primary text-yellow-900 px-8 py-3 rounded-xl font-black shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy hover:bg-yellow-400 flex items-center gap-2"
                      >
                          {isProcessing ? <Loader2 className="animate-spin" /> : "Upgrade Now"}
                      </button>
                  </div>
              </div>
          )}
      </div>

      {/* Settings Control Panel */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
             <span>⚙️</span> Child Settings & Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                  <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Daily Goal</label>
                      <select 
                        value={child.settings.dailyGoalMinutes}
                        onChange={(e) => updateUserSettings({ dailyGoalMinutes: parseInt(e.target.value) })}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 focus:border-kid-accent outline-none"
                      >
                          <option value={10}>10 Minutes / Day (Light)</option>
                          <option value={15}>15 Minutes / Day (Recommended)</option>
                          <option value={30}>30 Minutes / Day (Intense)</option>
                      </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Bell size={20} /></div>
                          <span className="font-bold text-gray-700">Sound Effects</span>
                      </div>
                      <Toggle 
                         checked={child.settings.soundEnabled} 
                         onChange={() => updateUserSettings({ soundEnabled: !child.settings.soundEnabled })} 
                      />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Music size={20} /></div>
                          <span className="font-bold text-gray-700">Background Music</span>
                      </div>
                      <Toggle 
                         checked={child.settings.musicEnabled} 
                         onChange={() => updateUserSettings({ musicEnabled: !child.settings.musicEnabled })} 
                      />
                  </div>
              </div>

              <div className="space-y-4">
                  <div className="p-4 rounded-xl border-l-4 border-red-400 bg-red-50">
                      <h4 className="font-bold text-red-700 mb-1">Danger Zone</h4>
                      <p className="text-xs text-red-500 mb-4">Resetting passwords cannot be undone.</p>
                      <button className="text-sm bg-white border border-red-200 text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-100">
                          Reset Password
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
    <div className={`${color} p-6 rounded-2xl flex items-center gap-4`}>
        <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
        <div>
            <div className="text-sm font-bold text-gray-500 uppercase">{label}</div>
            <div className="text-2xl font-black text-gray-800">{value}</div>
        </div>
    </div>
);

const Toggle = ({ checked, onChange }: any) => (
    <button 
      onClick={onChange}
      className={`w-14 h-8 rounded-full p-1 transition-colors ${checked ? 'bg-kid-secondary' : 'bg-gray-300'}`}
    >
        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

export default ParentDashboard;
