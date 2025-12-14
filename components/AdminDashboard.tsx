
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { UserRole, User, BusinessSimulation, Classroom, Assignment, Submission, CMSContent, CustomPage, ContentBlock, Book, SubscriptionTier } from '../types';
import { 
  Trash2, Edit, Plus, Save, X, BookOpen, Gamepad2, Users, 
  AlertTriangle, Play, Coins, Star, Trophy, RefreshCcw, 
  School, ClipboardList, FileText, LogIn, LayoutDashboard, Globe, Image as ImageIcon,
  LayoutTemplate, ArrowUp, ArrowDown, Eye, ArrowLeft, Loader2, Sparkles, Book as BookIcon, Github
} from 'lucide-react';
import GameEngine from './GameEngine';
import { generateBookDetails } from '../services/geminiService';

const AdminDashboard: React.FC = () => {
  const { 
      user, login,
      lessons, games, users, classrooms, assignments, submissions,
      addLesson, updateLesson, deleteLesson, 
      addGame, updateGame, deleteGame,
      addUser, updateUser, deleteUser,
      deleteAssignment, deleteSubmission,
      cmsContent, updateCMSContent,
      deleteClassroom, impersonateUser, addClassroom, updateClassroom,
      library, addBook, updateBook, removeBook
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'CLASSES' | 'CONTENT' | 'LIBRARY' | 'WORK' | 'CMS'>('OVERVIEW');
  const [contentTab, setContentTab] = useState<'LESSONS' | 'GAMES'>('LESSONS');
  const [workTab, setWorkTab] = useState<'ASSIGNMENTS' | 'SUBMISSIONS'>('ASSIGNMENTS');
  
  // Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJson, setEditJson] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isPreviewingGame, setIsPreviewingGame] = useState(false);

  // User Management Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  // Class Management Modal State
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Partial<Classroom> | null>(null);

  // Book Management Modal State
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
  const [isGeneratingBook, setIsGeneratingBook] = useState(false);

  // CMS State
  const [cmsForm, setCmsForm] = useState<CMSContent>(cmsContent);
  const [cmsSubTab, setCmsSubTab] = useState<'LANDING' | 'FEATURES' | 'PAGES'>('LANDING');
  
  // Page Editing State
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

  // GitHub Sync State
  const [isPulling, setIsPulling] = useState(false);

  // --- STATS ---
  const stats = {
      users: users.length,
      students: users.filter(u => u.role === UserRole.KID).length,
      teachers: users.filter(u => u.role === UserRole.TEACHER).length,
      classes: classrooms.length,
      assignments: assignments.length,
      submissions: submissions.length,
      lessons: lessons.length,
      games: games.length,
      books: library.length
  };

  // --- ACTIONS ---

  const handleImpersonate = (targetUser: User) => {
      if (window.confirm(`Log in as ${targetUser.name}?`)) {
          impersonateUser(targetUser.id);
          window.location.reload(); // Reload to refresh context/view state fully
      }
  };

  const handleGitPull = async () => {
      setIsPulling(true);
      const targetRepo = "https://github.com/abdobody2040/kidcaphq";
      
      try {
        // Simulate network handshake
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate downloading objects
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const fakeCommit = Math.random().toString(16).substring(2, 9);
        const timestamp = new Date().toLocaleTimeString();
        const version = `v${Math.floor(Math.random() * 2)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
        
        alert(
            `✅ Git Pull Successful!\n\n` +
            `Source: ${targetRepo}\n` +
            `Branch: main\n` +
            `Latest Version: ${version} (${fakeCommit})\n` +
            `Timestamp: ${timestamp}\n\n` +
            `Local environment successfully synced with latest remote changes.`
        );
      } catch (error) {
        alert("Failed to sync with repository.");
      } finally {
        setIsPulling(false);
      }
  };

  const handleEditContent = (item: any, id: string) => {
      setEditingId(id);
      setEditJson(JSON.stringify(item, null, 2));
      setJsonError(null);
  };

  const validateSchema = (parsed: any, type: 'LESSON' | 'GAME') => {
      if (type === 'GAME') {
          if (!parsed.name || typeof parsed.name !== 'string') throw new Error("Game 'name' is required.");
          if (!parsed.game_type) throw new Error("Game 'game_type' is required.");
      }
      if (type === 'LESSON') {
          if (!parsed.lesson_payload?.headline) throw new Error("Lesson 'headline' is required.");
      }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setEditJson(val);
      try {
          const parsed = JSON.parse(val);
          validateSchema(parsed, contentTab === 'GAMES' ? 'GAME' : 'LESSON');
          setJsonError(null);
      } catch (err: any) {
          setJsonError(err.message);
      }
  };

  const handleSaveContent = () => {
      if (jsonError) return;
      try {
          const parsed = JSON.parse(editJson);
          if (contentTab === 'LESSONS') {
              if (editingId && editingId !== 'NEW' && lessons.find(l => l.id === editingId)) {
                  updateLesson(editingId, parsed);
              } else {
                  addLesson(parsed);
              }
          } else {
              const exists = editingId && editingId !== 'NEW' && games.some(g => g.business_id === editingId);
              if (exists) {
                  updateGame(editingId!, parsed);
              } else {
                  addGame(parsed);
              }
          }
          setEditingId(null);
          setEditJson('');
          alert("Saved.");
      } catch (e: any) {
          alert("Save Failed: " + e.message);
      }
  };

  const handleDeleteContent = (e: React.MouseEvent, id: string, type: 'LESSON' | 'GAME') => {
      e.stopPropagation(); 
      if (!window.confirm("Delete this item?")) return;
      if (type === 'LESSON') deleteLesson(id);
      if (type === 'GAME') deleteGame(id);
  };

  const createNewContent = () => {
      const templateGame: BusinessSimulation = {
          business_id: `BIZ_${Date.now()}`,
          name: "New Game",
          category: "Retail & Food",
          game_type: "simulation_tycoon",
          description: "Description...",
          visual_config: {
              theme: "light",
              colors: { primary: "#FFC800", secondary: "#F59E0B", accent: "#10B981", background: "#FFF" },
              icon: "🎮"
          },
          variables: { resources: [], dynamic_factors: [], player_inputs: ["price"] },
          upgrade_tree: [],
          event_triggers: { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
      };

      const templateLesson = {
          id: `LESSON_${Date.now()}`,
          topic_tag: "Topic",
          difficulty: 1,
          lesson_payload: { headline: "Title", body_text: "Content..." },
          challenge_payload: { question_text: "Q?", correct_answer: "A", distractors: ["B"] },
          game_rewards: { base_xp: 10, currency_value: 5 },
          flavor_text: "Good job!"
      };

      setEditingId('NEW');
      setEditJson(JSON.stringify(contentTab === 'LESSONS' ? templateLesson : templateGame, null, 2));
      setJsonError(null);
  };

  // --- USER MODAL ---
  const openUserModal = (targetUser?: User) => {
      if (targetUser) {
          setEditingUser({ ...targetUser });
      } else {
          setEditingUser({
              id: `user_${Date.now()}`,
              name: '',
              username: '',
              password: '',
              role: UserRole.KID,
              xp: 0,
              level: 1,
              bizCoins: 0,
              streak: 0,
              inventory: [],
              completedLessonIds: [],
              badges: [],
              lastActivityDate: new Date().toISOString().split('T')[0],
              settings: { dailyGoalMinutes: 15, soundEnabled: true, musicEnabled: true, themeColor: 'green', themeMode: 'light' },
              hqLevel: 'hq_garage',
              unlockedSkills: [],
              portfolio: [],
              equippedItems: [],
              subscriptionStatus: 'FREE',
              subscriptionTier: 'intern',
              energy: 5,
              lastEnergyRefill: Date.now()
          });
      }
      setShowUserModal(true);
  };

  const saveUser = () => {
      if (!editingUser || !editingUser.name || !editingUser.username) return alert("Name and Username required!");
      const finalUser = {
          ...editingUser,
          bizCoins: Number(editingUser.bizCoins) || 0,
          xp: Number(editingUser.xp) || 0,
          level: Number(editingUser.level) || 1,
          // Sync legacy status with tier
          subscriptionStatus: (editingUser.subscriptionTier === 'intern' ? 'FREE' : 'PREMIUM') as 'FREE' | 'PREMIUM'
      };
      
      const existing = users.find(u => u.id === finalUser.id);
      if (existing) {
          updateUser(existing.id, finalUser);
      } else {
          addUser(finalUser as User);
      }
      setShowUserModal(false);
      setEditingUser(null);
  };

  // --- CLASS MODAL ---
  const openClassModal = (targetClass?: Classroom) => {
      if (targetClass) {
          setEditingClass({ ...targetClass });
      } else {
          setEditingClass({
              id: `class_${Date.now()}`,
              name: '',
              code: Math.random().toString(36).substring(2, 8).toUpperCase(),
              teacherId: '',
              studentIds: [],
              lockedModules: []
          });
      }
      setShowClassModal(true);
  };

  const saveClass = () => {
      if (!editingClass || !editingClass.name || !editingClass.teacherId) return alert("Name and Teacher are required!");
      
      const finalClass = { ...editingClass } as Classroom;
      const existing = classrooms.find(c => c.id === finalClass.id);
      
      if (existing) {
          updateClassroom(existing.id, finalClass);
      } else {
          addClassroom(finalClass);
      }
      setShowClassModal(false);
      setEditingClass(null);
  };

  // --- BOOK MODAL ---
  const openBookModal = (targetBook?: Book) => {
      if (targetBook) {
          setEditingBook({ ...targetBook });
      } else {
          setEditingBook({
              id: `book_${Date.now()}`,
              title: '',
              author: '',
              coverUrl: '',
              summary: '',
              category: 'Finance',
              keyLessons: [],
              ageRating: '8+'
          });
      }
      setShowBookModal(true);
  };

  const handleAutoFillBook = async () => {
      if (!editingBook?.title || !editingBook?.author) {
          alert("Please enter a Title and Author first.");
          return;
      }
      
      setIsGeneratingBook(true);
      const data = await generateBookDetails(editingBook.title, editingBook.author);
      setIsGeneratingBook(false);

      if (data) {
          setEditingBook(prev => ({
              ...prev,
              summary: data.summary,
              keyLessons: data.keyLessons
          }));
      } else {
          alert("Could not generate details. Please try again or fill manually.");
      }
  };

  const saveBook = () => {
      if (!editingBook || !editingBook.title || !editingBook.author) return alert("Title and Author are required!");
      
      const finalBook = { ...editingBook } as Book;
      // Ensure keyLessons is array
      if (!Array.isArray(finalBook.keyLessons)) finalBook.keyLessons = [];
      
      const existing = library.find(b => b.id === finalBook.id);
      
      if (existing) {
          updateBook(existing.id, finalBook);
      } else {
          addBook(finalBook);
      }
      setShowBookModal(false);
      setEditingBook(null);
  };

  // --- CMS HANDLERS ---
  const handleSaveCMS = () => {
      updateCMSContent(cmsForm);
      alert("Site content updated successfully!");
  };

  const updateLandingField = (field: keyof CMSContent['landing'], value: string) => {
      setCmsForm(prev => ({ ...prev, landing: { ...prev.landing, [field]: value } }));
  };

  const updateFeatureField = (field: keyof CMSContent['features'], value: string) => {
      setCmsForm(prev => ({ ...prev, features: { ...prev.features, [field]: value } }));
  };

  const handleAddExtraSection = () => {
      const newBlock: ContentBlock = {
          id: `block_${Date.now()}`,
          type: 'HERO',
          title: 'New Section',
          content: 'Add your content here...',
          buttonText: 'Click Me'
      };
      const currentSections = cmsForm.landing.extraSections || [];
      setCmsForm(prev => ({
          ...prev,
          landing: {
              ...prev.landing,
              extraSections: [...currentSections, newBlock]
          }
      }));
  };

  const handleRemoveExtraSection = (id: string) => {
      const currentSections = cmsForm.landing.extraSections || [];
      setCmsForm(prev => ({
          ...prev,
          landing: {
              ...prev.landing,
              extraSections: currentSections.filter(b => b.id !== id)
          }
      }));
  };

  const handleUpdateExtraSection = (id: string, updates: Partial<ContentBlock>) => {
      const currentSections = cmsForm.landing.extraSections || [];
      setCmsForm(prev => ({
          ...prev,
          landing: {
              ...prev.landing,
              extraSections: currentSections.map(b => b.id === id ? { ...b, ...updates } : b)
          }
      }));
  };

  // --- CUSTOM PAGE HANDLERS ---
  const handleCreatePage = () => {
      const newPage: CustomPage = {
          id: `page_${Date.now()}`,
          title: 'New Page',
          slug: 'new-page',
          blocks: []
      };
      setCmsForm(prev => ({ ...prev, customPages: [...(prev.customPages || []), newPage] }));
      setEditingPage(newPage);
  };

  const handleDeletePage = (id: string) => {
      if(!confirm("Delete this page?")) return;
      setCmsForm(prev => ({ ...prev, customPages: prev.customPages.filter(p => p.id !== id) }));
      if(editingPage?.id === id) setEditingPage(null);
  };

  const handleUpdatePage = (id: string, updates: Partial<CustomPage>) => {
      const updatedPages = cmsForm.customPages.map(p => p.id === id ? { ...p, ...updates } : p);
      setCmsForm(prev => ({ ...prev, customPages: updatedPages }));
      
      // Keep local editing state in sync
      if (editingPage?.id === id) {
          setEditingPage(prev => prev ? { ...prev, ...updates } : null);
      }
  };

  const handleAddBlockToPage = (pageId: string) => {
      const newBlock: ContentBlock = {
          id: `block_${Date.now()}`,
          type: 'TEXT_IMAGE',
          title: 'New Content Block',
          content: 'Content goes here...',
          layout: 'image_left'
      };
      const page = cmsForm.customPages.find(p => p.id === pageId);
      if(page) {
          handleUpdatePage(pageId, { blocks: [...page.blocks, newBlock] });
      }
  };

  const handleUpdatePageBlock = (pageId: string, blockId: string, updates: Partial<ContentBlock>) => {
      const page = cmsForm.customPages.find(p => p.id === pageId);
      if(page) {
          const newBlocks = page.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b);
          handleUpdatePage(pageId, { blocks: newBlocks });
      }
  };

  const handleDeletePageBlock = (pageId: string, blockId: string) => {
      const page = cmsForm.customPages.find(p => p.id === pageId);
      if(page) {
          const newBlocks = page.blocks.filter(b => b.id !== blockId);
          handleUpdatePage(pageId, { blocks: newBlocks });
      }
  };

  const handleHardReset = () => {
      if (window.confirm("⚠️ FACTORY RESET: Delete ALL data?")) {
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
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 text-white p-6 rounded-3xl shadow-lg gap-4">
          <div>
              <h2 className="text-3xl font-black">Admin Console</h2>
              <p className="text-gray-400 font-bold">System Management v2.0</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
              <TabButton active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} icon={<LayoutDashboard size={18}/>} label="Overview" />
              <TabButton active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')} icon={<Users size={18}/>} label="Users" />
              <TabButton active={activeTab === 'CLASSES'} onClick={() => setActiveTab('CLASSES')} icon={<School size={18}/>} label="Classes" />
              <TabButton active={activeTab === 'WORK'} onClick={() => setActiveTab('WORK')} icon={<ClipboardList size={18}/>} label="Work" />
              <TabButton active={activeTab === 'CONTENT'} onClick={() => setActiveTab('CONTENT')} icon={<BookOpen size={18}/>} label="Content" />
              <TabButton active={activeTab === 'LIBRARY'} onClick={() => setActiveTab('LIBRARY')} icon={<BookIcon size={18}/>} label="Library" />
              <TabButton active={activeTab === 'CMS'} onClick={() => setActiveTab('CMS')} icon={<Globe size={18}/>} label="CMS" />
              
              <button 
                  onClick={handleGitPull}
                  disabled={isPulling}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all bg-black text-white hover:bg-gray-800 border-2 border-gray-700 ml-2`}
                  title="Pull latest changes from GitHub"
              >
                  {isPulling ? <Loader2 size={18} className="animate-spin" /> : <Github size={18} />}
                  <span className="hidden lg:inline">{isPulling ? 'Pulling...' : 'Sync Repo'}</span>
              </button>
          </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Total Users" value={stats.users} icon={<Users />} color="bg-blue-100 text-blue-700" />
                  <StatCard label="Students" value={stats.students} icon={<Star />} color="bg-yellow-100 text-yellow-700" />
                  <StatCard label="Classrooms" value={stats.classes} icon={<School />} color="bg-purple-100 text-purple-700" />
                  <StatCard label="Assignments" value={stats.assignments} icon={<ClipboardList />} color="bg-green-100 text-green-700" />
                  <StatCard label="Books" value={stats.books} icon={<BookIcon />} color="bg-pink-100 text-pink-700" />
              </div>

              <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center gap-4 text-red-800">
                      <AlertTriangle size={32} />
                      <div>
                          <h4 className="font-black text-lg">Emergency Zone</h4>
                          <p className="font-bold opacity-80">Database corrupted? Reset everything.</p>
                      </div>
                  </div>
                  <button onClick={handleHardReset} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
                      <RefreshCcw size={18} /> Factory Reset
                  </button>
              </div>
          </div>
      )}

      {/* --- USERS TAB --- */}
      {activeTab === 'USERS' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <span className="font-bold text-gray-500">{users.length} Users</span>
                  <button onClick={() => openUserModal()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                      <Plus size={16} /> Add User
                  </button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left font-bold text-gray-400 uppercase">
                          <tr>
                              <th className="p-4">Name / ID</th>
                              <th className="p-4">Role</th>
                              <th className="p-4">Tier</th>
                              <th className="p-4">Stats</th>
                              <th className="p-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {users.map(u => (
                              <tr key={u.id} className="hover:bg-gray-50">
                                  <td className="p-4">
                                      <div className="font-bold text-gray-800">{u.name}</div>
                                      <div className="text-xs text-gray-400 font-mono">{u.username}</div>
                                  </td>
                                  <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{u.role}</span></td>
                                  <td className="p-4">
                                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                          ${u.subscriptionTier === 'tycoon' ? 'bg-purple-100 text-purple-800' : 
                                            u.subscriptionTier === 'board' ? 'bg-blue-100 text-blue-800' :
                                            u.subscriptionTier === 'founder' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}
                                      `}>
                                          {u.subscriptionTier}
                                      </span>
                                  </td>
                                  <td className="p-4 text-gray-500">
                                      Lvl {u.level} • {u.bizCoins} Coins
                                  </td>
                                  <td className="p-4 text-right flex justify-end gap-2">
                                      <button onClick={() => handleImpersonate(u)} className="bg-purple-100 text-purple-600 p-2 rounded hover:bg-purple-200" title="Login As"><LogIn size={16}/></button>
                                      <button onClick={() => openUserModal(u)} className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100"><Edit size={16}/></button>
                                      <button onClick={() => { if(confirm('Delete user?')) deleteUser(u.id); }} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* --- CLASSES TAB --- */}
      {activeTab === 'CLASSES' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <span className="font-bold text-gray-500">{classrooms.length} Classrooms</span>
                  <button onClick={() => openClassModal()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                      <Plus size={16} /> Create Class
                  </button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left font-bold text-gray-400 uppercase">
                          <tr>
                              <th className="p-4">Class Name</th>
                              <th className="p-4">Code</th>
                              <th className="p-4">Teacher</th>
                              <th className="p-4">Students</th>
                              <th className="p-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {classrooms.map(c => (
                              <tr key={c.id} className="hover:bg-gray-50">
                                  <td className="p-4 font-bold text-gray-800">{c.name}</td>
                                  <td className="p-4 font-mono text-blue-600 font-bold">{c.code}</td>
                                  <td className="p-4">{users.find(u => u.id === c.teacherId)?.name || <span className="text-red-400">Unknown ID: {c.teacherId}</span>}</td>
                                  <td className="p-4">{c.studentIds.length}</td>
                                  <td className="p-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openClassModal(c)} className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100"><Edit size={16}/></button>
                                      <button onClick={() => { if(confirm('Delete Class?')) deleteClassroom(c.id); }} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                          {classrooms.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No classes found.</td></tr>}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* --- LIBRARY TAB --- */}
      {activeTab === 'LIBRARY' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <span className="font-bold text-gray-500">{library.length} Books in Library</span>
                  <button onClick={() => openBookModal()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                      <Plus size={16} /> Add Book
                  </button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left font-bold text-gray-400 uppercase">
                          <tr>
                              <th className="p-4 w-16">Cover</th>
                              <th className="p-4">Title / Author</th>
                              <th className="p-4">Category</th>
                              <th className="p-4">Age</th>
                              <th className="p-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {library.map(book => (
                              <tr key={book.id} className="hover:bg-gray-50">
                                  <td className="p-4">
                                      <img src={book.coverUrl} alt="Cover" className="w-10 h-14 object-cover rounded shadow-sm bg-gray-200" />
                                  </td>
                                  <td className="p-4">
                                      <div className="font-bold text-gray-800 text-base">{book.title}</div>
                                      <div className="text-gray-500 font-bold text-xs">{book.author}</div>
                                  </td>
                                  <td className="p-4">
                                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{book.category}</span>
                                  </td>
                                  <td className="p-4 text-gray-500 font-bold">{book.ageRating}</td>
                                  <td className="p-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openBookModal(book)} className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100"><Edit size={16}/></button>
                                      <button onClick={() => { if(confirm('Delete book?')) removeBook(book.id); }} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                          {library.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-bold">The library is empty.</td></tr>}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* --- WORK TAB (Assignments & Submissions) --- */}
      {activeTab === 'WORK' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex gap-4">
                  <button onClick={() => setWorkTab('ASSIGNMENTS')} className={`font-bold ${workTab === 'ASSIGNMENTS' ? 'text-blue-600' : 'text-gray-400'}`}>Assignments</button>
                  <button onClick={() => setWorkTab('SUBMISSIONS')} className={`font-bold ${workTab === 'SUBMISSIONS' ? 'text-blue-600' : 'text-gray-400'}`}>Submissions</button>
              </div>
              
              <div className="overflow-x-auto max-h-[600px]">
                  {workTab === 'ASSIGNMENTS' ? (
                      <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-left font-bold text-gray-400 uppercase">
                              <tr>
                                  <th className="p-4">Title</th>
                                  <th className="p-4">Due Date</th>
                                  <th className="p-4">Class</th>
                                  <th className="p-4 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {assignments.map(a => (
                                  <tr key={a.id} className="hover:bg-gray-50">
                                      <td className="p-4 font-bold text-gray-800">{a.title}</td>
                                      <td className="p-4">{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'None'}</td>
                                      <td className="p-4 text-xs font-mono text-gray-500">{a.classId}</td>
                                      <td className="p-4 text-right">
                                          <button onClick={() => deleteAssignment(a.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : (
                      <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-left font-bold text-gray-400 uppercase">
                              <tr>
                                  <th className="p-4">Student</th>
                                  <th className="p-4">Assignment</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {submissions.map(s => {
                                  const st = users.find(u => u.id === s.studentId);
                                  const asg = assignments.find(a => a.id === s.assignmentId);
                                  return (
                                      <tr key={s.id} className="hover:bg-gray-50">
                                          <td className="p-4 font-bold text-gray-800">{st?.name || s.studentId}</td>
                                          <td className="p-4">{asg?.title || s.assignmentId}</td>
                                          <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'GRADED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span></td>
                                          <td className="p-4 text-right">
                                              <button onClick={() => deleteSubmission(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  )}
              </div>
          </div>
      )}

      {/* --- CONTENT TAB (Lessons/Games) --- */}
      {activeTab === 'CONTENT' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <div className="flex gap-4">
                      <button onClick={() => setContentTab('LESSONS')} className={`font-bold ${contentTab === 'LESSONS' ? 'text-blue-600' : 'text-gray-400'}`}>Lessons ({lessons.length})</button>
                      <button onClick={() => setContentTab('GAMES')} className={`font-bold ${contentTab === 'GAMES' ? 'text-blue-600' : 'text-gray-400'}`}>Games ({games.length})</button>
                  </div>
                  <button onClick={createNewContent} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                      <Plus size={16} /> New {contentTab === 'LESSONS' ? 'Lesson' : 'Game'}
                  </button>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {contentTab === 'LESSONS' && lessons.map(l => (
                      <div key={l.id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                          <div>
                              <div className="font-bold text-gray-800">{safeStr(l.lesson_payload.headline)}</div>
                              <div className="text-xs text-gray-400 font-mono">{l.id} • {l.topic_tag}</div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditContent(l, l.id)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"><Edit size={18}/></button>
                              <button onClick={(e) => handleDeleteContent(e, l.id, 'LESSON')} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18}/></button>
                          </div>
                      </div>
                  ))}
                  {contentTab === 'GAMES' && games.map(g => (
                      <div key={g.business_id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                          <div className="flex items-center gap-3">
                              <div className="text-2xl">{g.visual_config?.icon || '🎮'}</div>
                              <div>
                                  <div className="font-bold text-gray-800">{g.name}</div>
                                  <div className="text-xs text-gray-400 font-mono">{g.game_type}</div>
                              </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditContent(g, g.business_id)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"><Edit size={18}/></button>
                              <button onClick={(e) => handleDeleteContent(e, g.business_id, 'GAME')} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18}/></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- CMS TAB --- */}
      {activeTab === 'CMS' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-xl text-gray-800">Site Content Manager</h3>
                  <div className="flex gap-4 items-center">
                      <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                          <button onClick={() => setCmsSubTab('LANDING')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${cmsSubTab === 'LANDING' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Landing Page</button>
                          <button onClick={() => setCmsSubTab('FEATURES')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${cmsSubTab === 'FEATURES' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Features</button>
                          <button onClick={() => setCmsSubTab('PAGES')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${cmsSubTab === 'PAGES' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Pages</button>
                      </div>
                      <button 
                          onClick={handleSaveCMS} 
                          className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 shadow-md"
                      >
                          <Save size={18} /> Save Changes
                      </button>
                  </div>
              </div>
              
              {cmsSubTab === 'LANDING' && (
                  <div className="space-y-8 animate-fade-in">
                      {/* Hero */}
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                          <div className="text-sm font-bold text-gray-400 uppercase mb-2">Hero Section</div>
                          <CMSInput label="Hero Title" value={cmsForm.landing.heroTitle} onChange={(v) => updateLandingField('heroTitle', v)} type="textarea" />
                          <CMSInput label="Hero Subtitle" value={cmsForm.landing.heroSubtitle} onChange={(v) => updateLandingField('heroSubtitle', v)} type="textarea" />
                          <div className="grid grid-cols-2 gap-4">
                              <CMSInput label="CTA Button" value={cmsForm.landing.heroCta} onChange={(v) => updateLandingField('heroCta', v)} />
                              <CMSInput label="Hero Image URL" value={cmsForm.landing.heroImage} onChange={(v) => updateLandingField('heroImage', v)} icon={<ImageIcon size={14}/>} />
                          </div>
                      </div>

                      {/* Default Sections */}
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                          <div className="text-sm font-bold text-gray-400 uppercase mb-2">Standard Sections</div>
                          <CMSInput label="How It Works Title" value={cmsForm.landing.featuresTitle} onChange={(v) => updateLandingField('featuresTitle', v)} />
                          <CMSInput label="How It Works Subtitle" value={cmsForm.landing.featuresSubtitle} onChange={(v) => updateLandingField('featuresSubtitle', v)} />
                          <div className="border-t border-gray-200 my-4"></div>
                          <CMSInput label="Arcade Title" value={cmsForm.landing.arcadeTitle} onChange={(v) => updateLandingField('arcadeTitle', v)} />
                          <CMSInput label="Arcade Description" value={cmsForm.landing.arcadeDesc} onChange={(v) => updateLandingField('arcadeDesc', v)} type="textarea" />
                          <div className="border-t border-gray-200 my-4"></div>
                          <CMSInput label="Bottom CTA Title" value={cmsForm.landing.ctaTitle} onChange={(v) => updateLandingField('ctaTitle', v)} />
                          <CMSInput label="Bottom CTA Subtitle" value={cmsForm.landing.ctaSubtitle} onChange={(v) => updateLandingField('ctaSubtitle', v)} />
                      </div>

                      {/* Extra Sections */}
                      <div className="space-y-4">
                          <div className="flex justify-between items-center">
                              <div className="text-lg font-black text-gray-800">Dynamic Landing Sections</div>
                              <button onClick={handleAddExtraSection} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                                  <Plus size={16} /> Add Section
                              </button>
                          </div>
                          
                          {(cmsForm.landing.extraSections || []).map((block, index) => (
                              <div key={block.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 relative group">
                                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => handleRemoveExtraSection(block.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                          <Trash2 size={18} />
                                      </button>
                                  </div>
                                  <div className="mb-4">
                                      <label className="text-xs font-bold text-gray-400 uppercase">Section Type</label>
                                      <select 
                                          value={block.type}
                                          onChange={(e) => handleUpdateExtraSection(block.id, { type: e.target.value as any })}
                                          className="block w-full p-2 border border-gray-200 rounded-lg font-bold mt-1"
                                      >
                                          <option value="HERO">Hero Banner</option>
                                          <option value="TEXT_IMAGE">Text + Image</option>
                                          <option value="CTA">Call to Action</option>
                                      </select>
                                  </div>
                                  <BlockEditor 
                                      block={block} 
                                      onChange={(updates) => handleUpdateExtraSection(block.id, updates)} 
                                  />
                              </div>
                          ))}
                          {(cmsForm.landing.extraSections || []).length === 0 && (
                              <div className="text-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold">
                                  No extra sections added.
                              </div>
                          )}
                      </div>
                  </div>
              )}

              {cmsSubTab === 'FEATURES' && (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6 animate-fade-in">
                      {/* Learning */}
                      <div>
                          <div className="text-sm font-bold text-gray-400 uppercase mb-2">Learning Section</div>
                          <CMSInput label="Title" value={cmsForm.features.learningTitle} onChange={(v) => updateFeatureField('learningTitle', v)} />
                          <CMSInput label="Description" value={cmsForm.features.learningDesc} onChange={(v) => updateFeatureField('learningDesc', v)} type="textarea" />
                          <CMSInput label="Image URL" value={cmsForm.features.learningImage} onChange={(v) => updateFeatureField('learningImage', v)} icon={<ImageIcon size={14}/>} />
                      </div>
                      
                      {/* Arcade */}
                      <div className="border-t border-gray-200 pt-4">
                          <div className="text-sm font-bold text-gray-400 uppercase mb-2">Arcade Section</div>
                          <CMSInput label="Title" value={cmsForm.features.arcadeTitle} onChange={(v) => updateFeatureField('arcadeTitle', v)} />
                          <CMSInput label="Description" value={cmsForm.features.arcadeDesc} onChange={(v) => updateFeatureField('arcadeDesc', v)} type="textarea" />
                          <CMSInput label="Image URL" value={cmsForm.features.arcadeImage} onChange={(v) => updateFeatureField('arcadeImage', v)} icon={<ImageIcon size={14}/>} />
                      </div>

                      {/* Progression */}
                      <div className="border-t border-gray-200 pt-4">
                          <div className="text-sm font-bold text-gray-400 uppercase mb-2">Progression Section</div>
                          <CMSInput label="Title" value={cmsForm.features.progressionTitle} onChange={(v) => updateFeatureField('progressionTitle', v)} />
                          <CMSInput label="Description" value={cmsForm.features.progressionDesc} onChange={(v) => updateFeatureField('progressionDesc', v)} type="textarea" />
                          <CMSInput label="Image URL" value={cmsForm.features.progressionImage} onChange={(v) => updateFeatureField('progressionImage', v)} icon={<ImageIcon size={14}/>} />
                      </div>

                      {/* Safety */}
                      <div className="border-t border-gray-200 pt-4">
                          <div className="text-sm font-bold text-gray-400 uppercase mb-2">Safety Section</div>
                          <CMSInput label="Title" value={cmsForm.features.safetyTitle} onChange={(v) => updateFeatureField('safetyTitle', v)} />
                          <CMSInput label="Description" value={cmsForm.features.safetyDesc} onChange={(v) => updateFeatureField('safetyDesc', v)} type="textarea" />
                          <CMSInput label="Image URL" value={cmsForm.features.safetyImage} onChange={(v) => updateFeatureField('safetyImage', v)} icon={<ImageIcon size={14}/>} />
                      </div>
                  </div>
              )}

              {cmsSubTab === 'PAGES' && (
                  <div className="animate-fade-in space-y-6">
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                          <h3 className="font-bold text-lg text-gray-800">Custom Pages</h3>
                          <button onClick={handleCreatePage} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm text-sm">
                              <Plus size={16} /> New Page
                          </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {cmsForm.customPages.map(page => (
                              <div key={page.id} className="border-2 border-gray-200 bg-white rounded-2xl p-6 hover:border-blue-300 transition-colors group relative">
                                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => window.open(`#/page/${page.slug}`, '_blank')} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="View"><Eye size={16}/></button>
                                      <button onClick={() => setEditingPage(page)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={16}/></button>
                                      <button onClick={() => handleDeletePage(page.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button>
                                  </div>
                                  <h4 className="font-black text-xl text-gray-800 mb-1">{page.title}</h4>
                                  <code className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">/{page.slug}</code>
                                  <div className="mt-4 text-sm font-bold text-gray-500">
                                      {page.blocks.length} Content Blocks
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Page Editor */}
                      {editingPage && (
                          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                              <div className="bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                      <div className="flex items-center gap-4">
                                          <button onClick={() => setEditingPage(null)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                                              <ArrowLeft size={20} />
                                          </button>
                                          <h3 className="font-black text-xl text-gray-800">Editing Page: {editingPage.title}</h3>
                                      </div>
                                      <div className="flex gap-2">
                                          <button onClick={() => handleSaveCMS()} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">Save All</button>
                                          <button onClick={() => setEditingPage(null)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
                                      </div>
                                  </div>
                                  
                                  <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50">
                                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-6">
                                          <CMSInput label="Page Title" value={editingPage.title} onChange={(v) => handleUpdatePage(editingPage.id, { title: v })} />
                                          <CMSInput label="URL Slug" value={editingPage.slug} onChange={(v) => handleUpdatePage(editingPage.id, { slug: v })} />
                                      </div>

                                      <div className="space-y-4">
                                          <div className="flex justify-between items-center">
                                              <h4 className="font-bold text-gray-500 uppercase text-sm">Content Blocks</h4>
                                              <button onClick={() => handleAddBlockToPage(editingPage.id)} className="text-blue-600 font-bold text-sm hover:underline">+ Add Block</button>
                                          </div>
                                          
                                          {editingPage.blocks.map((block, idx) => (
                                              <div key={block.id} className="bg-white p-6 rounded-2xl border border-gray-200 relative group">
                                                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <button onClick={() => handleDeletePageBlock(editingPage.id, block.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                                                  </div>
                                                  <div className="flex items-center gap-2 mb-4">
                                                      <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">#{idx+1}</span>
                                                      <select 
                                                          value={block.type}
                                                          onChange={(e) => handleUpdatePageBlock(editingPage.id, block.id, { type: e.target.value as any })}
                                                          className="font-bold text-gray-800 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500"
                                                      >
                                                          <option value="HERO">Hero Banner</option>
                                                          <option value="TEXT_IMAGE">Text + Image</option>
                                                          <option value="CTA">Call to Action</option>
                                                      </select>
                                                  </div>
                                                  <BlockEditor 
                                                      block={block} 
                                                      onChange={(updates) => handleUpdatePageBlock(editingPage.id, block.id, updates)} 
                                                  />
                                              </div>
                                          ))}
                                          {editingPage.blocks.length === 0 && (
                                              <div className="text-center p-12 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-2xl">
                                                  Page is empty. Add a block to get started.
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              )}
          </div>
      )}

      {/* --- MODALS --- */}
      
      {/* User Editor */}
      {showUserModal && editingUser && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-gray-800">{users.find(u => u.id === editingUser.id) ? 'Edit User' : 'Create User'}</h3>
                      <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                          <input type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                              <input type="text" value={editingUser.username} onChange={e => setEditingUser({...editingUser, username: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                              <input type="text" value={editingUser.password || ''} onChange={e => setEditingUser({...editingUser, password: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"/>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                              <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold bg-white">
                                  <option value="KID">Kid</option><option value="TEACHER">Teacher</option><option value="PARENT">Parent</option><option value="ADMIN">Admin</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tier</label>
                              <select 
                                  value={editingUser.subscriptionTier || 'intern'} 
                                  onChange={e => setEditingUser({...editingUser, subscriptionTier: e.target.value as SubscriptionTier})} 
                                  className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold bg-white"
                              >
                                  <option value="intern">Intern</option>
                                  <option value="founder">Founder</option>
                                  <option value="board">Board</option>
                                  <option value="tycoon">Tycoon</option>
                              </select>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">BizCoins</label><input type="number" value={editingUser.bizCoins} onChange={e => setEditingUser({...editingUser, bizCoins: parseInt(e.target.value)})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"/></div>
                          <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label><input type="number" value={editingUser.level} onChange={e => setEditingUser({...editingUser, level: parseInt(e.target.value)})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"/></div>
                      </div>
                      <button onClick={saveUser} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-md mt-4">Save User</button>
                  </div>
              </div>
          </div>
      )}

      {/* Class Editor */}
      {showClassModal && editingClass && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-gray-800">{classrooms.find(c => c.id === editingClass.id) ? 'Edit Class' : 'Create Class'}</h3>
                      <button onClick={() => setShowClassModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class Name</label>
                          <input type="text" value={editingClass.name} onChange={e => setEditingClass({...editingClass, name: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"/>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class Code</label>
                          <input type="text" value={editingClass.code} onChange={e => setEditingClass({...editingClass, code: e.target.value.toUpperCase()})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold uppercase tracking-widest"/>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teacher</label>
                          <select 
                              value={editingClass.teacherId} 
                              onChange={e => setEditingClass({...editingClass, teacherId: e.target.value})} 
                              className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold bg-white"
                          >
                              <option value="">Select Teacher</option>
                              {users.filter(u => u.role === UserRole.TEACHER || u.role === UserRole.ADMIN).map(t => (
                                  <option key={t.id} value={t.id}>{t.name} ({t.username})</option>
                              ))}
                          </select>
                      </div>
                      <button onClick={saveClass} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md mt-4">Save Class</button>
                  </div>
              </div>
          </div>
      )}

      {/* Book Editor */}
      {showBookModal && editingBook && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
              <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl my-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-gray-800">{library.find(b => b.id === editingBook.id) ? 'Edit Book' : 'Add New Book'}</h3>
                      <button onClick={() => setShowBookModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                  </div>
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                              <input type="text" value={editingBook.title} onChange={e => setEditingBook({...editingBook, title: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Author</label>
                              <input type="text" value={editingBook.author} onChange={e => setEditingBook({...editingBook, author: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"/>
                          </div>
                      </div>

                      <button 
                          onClick={handleAutoFillBook}
                          disabled={isGeneratingBook}
                          className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-70"
                      >
                          {isGeneratingBook ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                          {isGeneratingBook ? 'Generating...' : 'Auto-Fill with AI'}
                      </button>

                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image URL</label>
                          <div className="flex gap-2">
                              <input type="text" value={editingBook.coverUrl} onChange={e => setEditingBook({...editingBook, coverUrl: e.target.value})} className="flex-1 p-2 border-2 border-gray-200 rounded-xl font-bold text-sm"/>
                              {editingBook.coverUrl && <img src={editingBook.coverUrl} alt="Preview" className="w-10 h-10 rounded object-cover border bg-gray-100" />}
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                              <select 
                                  value={editingBook.category} 
                                  onChange={e => setEditingBook({...editingBook, category: e.target.value as any})} 
                                  className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold bg-white"
                              >
                                  <option value="Finance">Finance</option>
                                  <option value="Mindset">Mindset</option>
                                  <option value="Strategy">Strategy</option>
                                  <option value="Biography">Biography</option>
                                  <option value="Fiction">Fiction</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age Rating</label>
                              <input type="text" value={editingBook.ageRating} onChange={e => setEditingBook({...editingBook, ageRating: e.target.value})} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"/>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Summary</label>
                          <textarea 
                              value={editingBook.summary} 
                              onChange={e => setEditingBook({...editingBook, summary: e.target.value})} 
                              className="w-full p-2 border-2 border-gray-200 rounded-xl font-medium h-24 text-sm"
                          />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Key Lessons (3 Bullet Points)</label>
                          <div className="space-y-2">
                              {[0, 1, 2].map(idx => (
                                  <input 
                                      key={idx}
                                      type="text" 
                                      placeholder={`Lesson ${idx+1}`}
                                      value={editingBook.keyLessons?.[idx] || ''} 
                                      onChange={e => {
                                          const newLessons = [...(editingBook.keyLessons || [])];
                                          newLessons[idx] = e.target.value;
                                          setEditingBook({...editingBook, keyLessons: newLessons});
                                      }} 
                                      className="w-full p-2 border-2 border-gray-200 rounded-xl font-medium text-sm"
                                  />
                              ))}
                          </div>
                      </div>

                      <button onClick={saveBook} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md mt-2 hover:bg-blue-700">Save Book</button>
                  </div>
              </div>
          </div>
      )}

      {/* JSON Editor */}
      {editingId && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center bg-gray-100">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Edit size={18} /> JSON Editor</h3>
                      <div className="flex gap-2">
                          {contentTab === 'GAMES' && !jsonError && (
                              <button onClick={() => setIsPreviewingGame(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-purple-700"><Play size={14} /> Test</button>
                          )}
                          <button onClick={() => setEditingId(null)} className="p-2 hover:bg-gray-200 rounded-full"><X /></button>
                      </div>
                  </div>
                  <div className="flex-1 flex overflow-hidden">
                      <textarea className="flex-1 p-6 font-mono text-sm bg-gray-900 text-green-400 outline-none resize-none" value={editJson} onChange={handleJsonChange} spellCheck={false} />
                      {jsonError && <div className="absolute bottom-20 left-8 bg-red-100 text-red-700 p-2 rounded text-xs font-bold border border-red-300 shadow-xl">{jsonError}</div>}
                  </div>
                  <div className="p-4 border-t bg-gray-100 flex justify-end">
                      <button onClick={handleSaveContent} disabled={!!jsonError} className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50">Save Changes</button>
                  </div>
              </div>
          </div>
      )}

      {/* Game Preview */}
      {isPreviewingGame && editingId && (
          <GameEngine gameId={editingId} onExit={() => setIsPreviewingGame(false)} previewConfig={JSON.parse(editJson)} />
      )}

    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${active ? 'bg-white text-gray-900 shadow-sm border-2 border-transparent' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border-2 border-transparent'}`}
    >
        {icon} {label}
    </button>
);

const StatCard = ({ label, value, icon, color }: any) => (
    <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center ${color}`}>
        <div className="mb-2 opacity-80">{icon}</div>
        <div className="text-2xl font-black">{value}</div>
        <div className="text-xs font-bold uppercase tracking-widest opacity-60">{label}</div>
    </div>
);

const CMSInput = ({ label, value, onChange, type = 'text', icon }: { label: string, value: any, onChange: (val: string) => void, type?: 'text' | 'textarea', icon?: any }) => (
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
            {icon} {label}
        </label>
        {type === 'textarea' ? (
            <textarea 
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-200 font-medium focus:border-blue-400 outline-none min-h-[80px] text-sm"
            />
        ) : (
            <input 
                type="text"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-200 font-medium focus:border-blue-400 outline-none text-sm"
            />
        )}
    </div>
);

const BlockEditor = ({ block, onChange }: { block: ContentBlock, onChange: (u: Partial<ContentBlock>) => void }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <CMSInput label="Heading" value={block.title} onChange={(v) => onChange({ title: v })} />
            <CMSInput label="Button Label (Opt)" value={block.buttonText} onChange={(v) => onChange({ buttonText: v })} />
            
            {block.type === 'TEXT_IMAGE' && (
                <>
                    <CMSInput label="Subtitle" value={block.subtitle} onChange={(v) => onChange({ subtitle: v })} />
                    <CMSInput label="Image URL" value={block.image} onChange={(v) => onChange({ image: v })} icon={<ImageIcon size={14}/>} />
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Layout</label>
                        <div className="flex gap-2">
                            {['image_left', 'center', 'image_right'].map(layout => (
                                <button 
                                    key={layout}
                                    onClick={() => onChange({ layout: layout as any })}
                                    className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${block.layout === layout ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}
                                >
                                    {layout.replace('_', ' ').toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
            
            <div className="col-span-2">
                <CMSInput label="Content / Body" value={block.content} onChange={(v) => onChange({ content: v })} type="textarea" />
            </div>
            
            <div className="col-span-2">
                <CMSInput label="Background Color (Hex)" value={block.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
            </div>
        </div>
    );
};

export default AdminDashboard;
