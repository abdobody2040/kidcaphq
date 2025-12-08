
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { UserRole, User, BusinessSimulation } from '../types';
import { Trash2, Edit, Plus, Save, X, BookOpen, Gamepad2, Users, AlertTriangle, Play } from 'lucide-react';
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

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setEditJson(val);
      try {
          JSON.parse(val);
          setJsonError(null);
      } catch (err: any) {
          setJsonError(err.message);
      }
  };

  const handleSaveContent = () => {
      if (jsonError) return;
      try {
          const parsed = JSON.parse(editJson);
          if (activeTab === 'LESSONS') {
              if (lessons.find(l => l.id === editingId)) updateLesson(editingId!, parsed);
              else addLesson(parsed);
          } else if (activeTab === 'GAMES') {
              if (games.find(g => g.business_id === editingId)) updateGame(editingId!, parsed);
              else addGame(parsed);
          }
          setEditingId(null);
          setEditJson('');
          alert("Content saved successfully.");
      } catch (e) {
          alert("Invalid JSON format");
      }
  };

  const handleDeleteContent = (e: React.MouseEvent, id: string) => {
      e.stopPropagation(); 
      if (activeTab === 'LESSONS') {
          deleteLesson(id);
          alert("Lesson deleted.");
      }
      if (activeTab === 'GAMES') {
          deleteGame(id);
          alert("Game deleted.");
      }
  };

  const createNewContent = () => {
      const templateGame: BusinessSimulation = {
          business_id: `BIZ_NEW_${Date.now()}`,
          name: "New Game",
          category: "Retail & Food",
          game_type: "simulation_tycoon",
          description: "Description...",
          visual_config: {
              theme: "light",
              colors: { primary: "#FFC800", secondary: "#F59E0B", accent: "#10B981", background: "#FFF" }
          },
          variables: { resources: ["a", "b"], dynamic_factors: ["x", "y"], player_inputs: ["i1"] },
          upgrade_tree: [],
          event_triggers: { positive: { event_name: "Good", effect: "Bonus", duration: "1d" }, negative: { event_name: "Bad", effect: "Loss", duration: "1d" } }
      };

      const template = activeTab === 'LESSONS' ? {
          id: `NEW_LESSON_${Date.now()}`,
          topic_tag: "New Topic",
          difficulty: 1,
          lesson_payload: { headline: "New Lesson", body_text: "Content here..." },
          challenge_payload: { question_text: "Question?", correct_answer: "Yes", distractors: ["No"] },
          game_rewards: { base_xp: 10, currency_value: 5 },
          flavor_text: "Good job!"
      } : templateGame;

      setEditingId('NEW');
      setEditJson(JSON.stringify(template, null, 2));
      setJsonError(null);
  };

  // --- USER MANAGEMENT ---
  const openUserModal = (targetUser?: User) => {
      if (targetUser) {
          setEditingUser({ ...targetUser });
      } else {
          // New User Template
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
      
      const existing = users.find(u => u.id === editingUser.id);
      if (existing) {
          updateUser(existing.id, editingUser);
          alert("User updated successfully!");
      } else {
          addUser(editingUser as User);
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
      deleteUser(id);
      alert("User deleted.");
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-3xl">
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
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
                  {/* ... User Form (Same as before) ... */}
                  <h3 className="text-2xl font-black text-gray-800 mb-6">{users.find(u => u.id === editingUser.id) ? 'Edit User' : 'Create User'}</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-500 mb-1">Display Name</label>
                          <input 
                              type="text" 
                              value={editingUser.name}
                              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-500 mb-1">Role</label>
                          <select 
                              value={editingUser.role}
                              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold bg-white"
                          >
                              <option value={UserRole.KID}>Kid</option>
                              <option value={UserRole.PARENT}>Parent</option>
                              <option value={UserRole.TEACHER}>Teacher</option>
                              <option value={UserRole.ADMIN}>Admin</option>
                          </select>
                      </div>
                      <div className="flex gap-3 mt-8">
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
              {/* ... Lesson List ... */}
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
                              <div className="font-bold text-gray-800">{l.lesson_payload.headline}</div>
                              <div className="text-xs text-gray-400 font-mono">{l.id} • {l.topic_tag}</div>
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
                                  <span className="text-2xl">{g.visual_config?.icon || '🎮'}</span>
                                  <div className="font-bold text-gray-800">{g.name}</div>
                              </div>
                              <div className="text-xs text-gray-400 font-mono ml-8">{g.game_type} • {g.category}</div>
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

      {/* ... Users Tab (Same as before) ... */}
      {activeTab === 'USERS' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              {/* User list logic is preserved from previous version */}
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <span className="font-bold text-gray-500">{users.length} Registered Users</span>
                  <button onClick={() => openUserModal()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                      <Plus size={16} /> Create User
                  </button>
              </div>
              {/* Table logic same as previous version */}
              <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead className="bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase">
                          <tr>
                              <th className="p-4">User</th>
                              <th className="p-4">Role</th>
                              <th className="p-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {users.map(u => (
                              <tr key={u.id} className="hover:bg-gray-50">
                                  <td className="p-4 font-bold">{u.name}</td>
                                  <td className="p-4 text-sm">{u.role}</td>
                                  <td className="p-4 text-right">
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
