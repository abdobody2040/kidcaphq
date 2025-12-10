
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { UserRole, User, BusinessSimulation } from '../types';
import { Trash2, Edit, Plus, Save, X, BookOpen, Gamepad2, Users, AlertTriangle, Play, Coins, Star, Trophy, RefreshCcw } from 'lucide-react';
import GameEngine from './GameEngine';

const AdminDashboard: React.FC = () => {
  const { 
      user, 
      lessons, games, users, 
      addLesson, updateLesson, deleteLesson, 
      addGame, updateGame, deleteGame,
      addUser, updateUser, deleteUser 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'LESSONS' | 'GAMES' | 'USERS'>('LESSONS');
  
  // Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJson, setEditJson] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isPreviewingGame, setIsPreviewingGame] = useState(false);

  // User Management Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  // --- CONTENT MANAGEMENT ---
  const handleEditContent = (item: any, id: string) => {
      setEditingId(id);
      setEditJson(JSON.stringify(item, null, 2));
      setJsonError(null);
  };

  const validateSchema = (parsed: any, type: 'LESSON' | 'GAME') => {
      if (type === 'GAME') {
          if (!parsed.name || typeof parsed.name !== 'string') throw new Error("Game 'name' is required and must be a string.");
          if (!parsed.description || typeof parsed.description !== 'string') throw new Error("Game 'description' is required and must be a string.");
          if (!parsed.game_type || typeof parsed.game_type !== 'string') throw new Error("Game 'game_type' is required.");
          
          // Ensure arrays exist
          if (!Array.isArray(parsed.upgrade_tree)) throw new Error("'upgrade_tree' must be an array (can be empty).");
          if (parsed.entities && !Array.isArray(parsed.entities)) throw new Error("'entities' must be an array.");
          
          // Visual config safety
          if (parsed.visual_config && typeof parsed.visual_config !== 'object') throw new Error("'visual_config' must be an object.");
      }
      
      if (type === 'LESSON') {
          if (!parsed.lesson_payload?.headline || typeof parsed.lesson_payload.headline !== 'string') throw new Error("Lesson 'headline' is required string.");
          if (!parsed.lesson_payload?.body_text || typeof parsed.lesson_payload.body_text !== 'string') throw new Error("Lesson 'body_text' is required string.");
          if (typeof parsed.game_rewards?.base_xp !== 'number') throw new Error("'base_xp' must be a number.");
      }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setEditJson(val);
      try {
          const parsed = JSON.parse(val);
          validateSchema(parsed, activeTab === 'GAMES' ? 'GAME' : 'LESSON');
          setJsonError(null);
      } catch (err: any) {
          setJsonError(err.message);
      }
  };

  const handleSaveContent = () => {
      if (jsonError) return;
      try {
          const parsed = JSON.parse(editJson);
          // Final validation before save
          validateSchema(parsed, activeTab === 'GAMES' ? 'GAME' : 'LESSON');
          
          if (activeTab === 'LESSONS') {
              if (editingId && editingId !== 'NEW' && lessons.find(l => l.id === editingId)) {
                  updateLesson(editingId, parsed);
              } else {
                  addLesson(parsed);
              }
          } else if (activeTab === 'GAMES') {
              const exists = editingId && editingId !== 'NEW' && games.some(g => g.business_id === editingId);
              if (exists) {
                  updateGame(editingId!, parsed);
              } else {
                  addGame(parsed);
              }
          }
          setEditingId(null);
          setEditJson('');
          alert("Content saved successfully.");
      } catch (e: any) {
          console.error(e);
          alert("Save Failed: " + e.message);
      }
  };

  const handleDeleteContent = (e: React.MouseEvent, id: string) => {
      e.stopPropagation(); 
      if (!window.confirm("Are you sure you want to delete this item?")) return;
      
      if (activeTab === 'LESSONS') {
          deleteLesson(id);
      }
      if (activeTab === 'GAMES') {
          deleteGame(id);
      }
  };

  const createNewContent = () => {
      const templateGame: BusinessSimulation = {
          business_id: `BIZ_NEW_${Date.now()}`,
          name: "New Game",
          category: "Retail & Food",
          game_type: "simulation_tycoon",
          description: "A brand new business simulation.",
          visual_config: {
              theme: "light",
              colors: { primary: "#FFC800", secondary: "#F59E0B", accent: "#10B981", background: "#FFF" },
              icon: "🎮"
          },
          variables: { resources: [], dynamic_factors: [], player_inputs: ["price"] },
          upgrade_tree: [],
          event_triggers: { positive: { event_name: "Boom", effect: "Sales up", duration: "1d" }, negative: { event_name: "Bust", effect: "Sales down", duration: "1d" } }
      };

      const templateLesson = {
          id: `NEW_LESSON_${Date.now()}`,
          topic_tag: "New Topic",
          difficulty: 1,
          lesson_payload: { headline: "New Lesson", body_text: "Lesson content goes here..." },
          challenge_payload: { question_text: "Question?", correct_answer: "Yes", distractors: ["No"] },
          game_rewards: { base_xp: 10, currency_value: 5 },
          flavor_text: "Good job!"
      };

      setEditingId('NEW');
      setEditJson(JSON.stringify(activeTab === 'LESSONS' ? templateLesson : templateGame, null, 2));
      setJsonError(null);
  };

  // --- USER MANAGEMENT ---
  const openUserModal = (targetUser?: User) => {
      if (targetUser) {
          setEditingUser({ ...targetUser });
      } else {
          setEditingUser({
              id: `user_${Date.now()}`,
              name: '',
              role: UserRole.KID,
              xp: 0,
              level: 1,
              bizCoins: 0,
              streak: 0,
              inventory: [],
              completedLessonIds: [],
              badges: [],
              lastActivityDate: new Date().toISOString().split('T')[0],
              settings: { dailyGoalMinutes: 15, soundEnabled: true, musicEnabled: true, themeColor: 'green' },
              hqLevel: 'hq_garage',
              unlockedSkills: [],
              portfolio: [],
              equippedItems: [],
              subscriptionStatus: 'FREE'
          });
      }
      setShowUserModal(true);
  };

  const saveUser = () => {
      if (!editingUser || !editingUser.name) {
          alert("Name is required!");
          return;
      }
      // Ensure numerical values are numbers
      const finalUser = {
          ...editingUser,
          bizCoins: Number(editingUser.bizCoins) || 0,
          xp: Number(editingUser.xp) || 0,
          level: Number(editingUser.level) || 1
      };
      
      const existing = users.find(u => u.id === finalUser.id);
      if (existing) {
          updateUser(existing.id, finalUser);
          alert("User updated successfully!");
      } else {
          addUser(finalUser as User);
          alert("User created successfully!");
      }
      setShowUserModal(false);
      setEditingUser(null);
  };

  const handleDeleteUser = (e: React.MouseEvent, id: string) => {
      e.stopPropagation(); 
      if (id === user?.id) {
          alert("You cannot delete your own account!");
          return;
      }
      if (window.confirm("Delete this user? This cannot be undone.")) {
          deleteUser(id);
      }
  };

  const handleHardReset = () => {
      const confirmReset = window.confirm("⚠️ FACTORY RESET WARNING ⚠️\n\nThis will delete ALL data (Users, Custom Games, Progress) and reset the app to its initial state.\n\nAre you sure?");
      if (confirmReset) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const safeStr = (val: any) => {
      if (typeof val === 'string') return val;
      if (typeof val === 'number') return String(val);
      return '';
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-3xl shadow-lg">
          <div>
              <h2 className="text-3xl font-black">Admin Console</h2>
              <p className="text-gray-400 font-bold">System Management</p>
          </div>
          <div className="flex gap-2">
              <TabButton active={activeTab === 'LESSONS'} onClick={() => setActiveTab('LESSONS')} icon={<BookOpen size={18}/>} label="Lessons" />
              <TabButton active={activeTab === 'GAMES'} onClick={() => setActiveTab('GAMES')} icon={<Gamepad2 size={18}/>} label="Games" />
              <TabButton active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')} icon={<Users size={18}/>} label="Users" />
          </div>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex justify-between items-center">
          <div className="flex items-center gap-3 text-red-800">
              <AlertTriangle size={24} />
              <div>
                  <h4 className="font-black">Emergency Reset</h4>
                  <p className="text-xs font-bold opacity-80">Fix "Object not valid" errors by wiping all local data.</p>
              </div>
          </div>
          <button 
            onClick={handleHardReset}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md"
          >
              <RefreshCcw size={18} /> Factory Reset
          </button>
      </div>

      {/* JSON EDITOR MODAL */}
      {editingId && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center bg-gray-100">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Edit size={18} /> JSON Editor</h3>
                      <div className="flex gap-2">
                          {activeTab === 'GAMES' && !jsonError && (
                              <button 
                                onClick={() => setIsPreviewingGame(true)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-purple-700"
                              >
                                  <Play size={14} /> Test Game
                              </button>
                          )}
                          <button onClick={() => setEditingId(null)} className="p-2 hover:bg-gray-200 rounded-full"><X /></button>
                      </div>
                  </div>
                  <div className="flex-1 flex overflow-hidden">
                      <div className="w-1/2 flex flex-col border-r border-gray-200">
                          <textarea 
                              className="flex-1 p-6 font-mono text-sm bg-gray-900 text-green-400 outline-none resize-none"
                              value={editJson}
                              onChange={handleJsonChange}
                              spellCheck={false}
                          />
                          {jsonError && (
                              <div className="bg-red-100 text-red-700 p-2 text-xs font-mono font-bold flex items-center gap-2">
                                  <AlertTriangle size={14} /> {jsonError}
                              </div>
                          )}
                      </div>
                      <div className="w-1/2 bg-gray-50 p-6 overflow-y-auto">
                          <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Live Preview (Structure)</h4>
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                              {jsonError ? "Fix JSON to see preview" : editJson}
                          </pre>
                      </div>
                  </div>
                  <div className="p-4 border-t bg-gray-100 flex justify-end">
                      <button 
                        onClick={handleSaveContent} 
                        disabled={!!jsonError}
                        className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${jsonError ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                      >
                          <Save size={18} /> Save Changes
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* GAME PREVIEW OVERLAY */}
      {isPreviewingGame && editingId && (
          <GameEngine 
              gameId={editingId} 
              onExit={() => setIsPreviewingGame(false)} 
              previewConfig={JSON.parse(editJson)}
          />
      )}

      {/* USER EDITOR MODAL */}
      {showUserModal && editingUser && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-gray-800">{users.find(u => u.id === editingUser.id) ? 'Edit User' : 'Create User'}</h3>
                      <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-500 mb-1">Display Name</label>
                          <input 
                              type="text" 
                              value={safeStr(editingUser.name)}
                              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-500 mb-1">Role</label>
                          <select 
                              value={safeStr(editingUser.role)}
                              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold bg-white"
                          >
                              <option value={UserRole.KID}>Kid</option>
                              <option value={UserRole.PARENT}>Parent</option>
                              <option value={UserRole.TEACHER}>Teacher</option>
                              <option value={UserRole.ADMIN}>Admin</option>
                          </select>
                      </div>

                      {/* Stats Editing */}
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-500 mb-1 flex items-center gap-1"><Coins size={14}/> BizCoins</label>
                              <input 
                                  type="number" 
                                  value={editingUser.bizCoins ?? ''}
                                  onChange={(e) => setEditingUser({ ...editingUser, bizCoins: parseInt(e.target.value) || 0 })}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-500 mb-1 flex items-center gap-1"><Star size={14}/> XP</label>
                              <input 
                                  type="number" 
                                  value={editingUser.xp ?? ''}
                                  onChange={(e) => setEditingUser({ ...editingUser, xp: parseInt(e.target.value) || 0 })}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-500 mb-1 flex items-center gap-1"><Trophy size={14}/> Level</label>
                              <input 
                                  type="number" 
                                  value={editingUser.level ?? 1}
                                  onChange={(e) => setEditingUser({ ...editingUser, level: parseInt(e.target.value) || 1 })}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold"
                              />
                          </div>
                      </div>

                      <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
                          <button onClick={() => setShowUserModal(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
                          <button onClick={saveUser} className="flex-1 py-3 rounded-xl font-bold bg-kid-primary text-yellow-900 hover:bg-yellow-400 shadow-md">Save User</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* CONTENT LISTS */}
      {activeTab === 'LESSONS' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <span className="font-bold text-gray-500">{lessons.length} Lessons Found</span>
                  <button onClick={createNewContent} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                      <Plus size={16} /> Add Lesson
                  </button>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {lessons.map(l => (
                      <div key={l.id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                          <div>
                              <div className="font-bold text-gray-800">{safeStr(l.lesson_payload.headline)}</div>
                              <div className="text-xs text-gray-400 font-mono">{safeStr(l.id)} • {safeStr(l.topic_tag)}</div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditContent(l, l.id)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"><Edit size={18}/></button>
                              <button onClick={(e) => handleDeleteContent(e, l.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18}/></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {activeTab === 'GAMES' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <span className="font-bold text-gray-500">{games.length} Games Found</span>
                  <button onClick={createNewContent} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                      <Plus size={16} /> Add Game
                  </button>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {games.map(g => (
                      <div key={g.business_id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                          <div>
                              <div className="flex items-center gap-2">
                                  <span className="text-2xl">{safeStr(g.visual_config?.icon) || '🎮'}</span>
                                  <div className="font-bold text-gray-800">{safeStr(g.name)}</div>
                              </div>
                              <div className="text-xs text-gray-400 font-mono ml-8">{safeStr(g.game_type)} • {safeStr(g.category)}</div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditContent(g, g.business_id)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"><Edit size={18}/></button>
                              <button onClick={(e) => handleDeleteContent(e, g.business_id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18}/></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {activeTab === 'USERS' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <span className="font-bold text-gray-500">{users.length} Registered Users</span>
                  <button onClick={() => openUserModal()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                      <Plus size={16} /> Create User
                  </button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead className="bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase">
                          <tr>
                              <th className="p-4">User</th>
                              <th className="p-4">Role</th>
                              <th className="p-4">Coins</th>
                              <th className="p-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {users.map(u => (
                              <tr key={u.id} className="hover:bg-gray-50">
                                  <td className="p-4 font-bold">
                                      <div className="flex items-center gap-2">
                                          <span>{safeStr(u.name)}</span>
                                          {user?.id === u.id && <span className="bg-blue-100 text-blue-600 text-xs px-2 rounded-full">YOU</span>}
                                      </div>
                                  </td>
                                  <td className="p-4 text-sm">{safeStr(u.role)}</td>
                                  <td className="p-4 text-sm text-yellow-600 font-bold">{typeof u.bizCoins === 'number' ? u.bizCoins : 'ERROR'}</td>
                                  <td className="p-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openUserModal(u)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                                      <button onClick={(e) => handleDeleteUser(e, u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${active ? 'bg-white text-gray-900 shadow-sm' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
    >
        {icon} {label}
    </button>
);

export default AdminDashboard;
