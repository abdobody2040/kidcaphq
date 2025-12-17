
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  User, UserRole, LemonadeState, ShopItem, LeaderboardEntry, Classroom, UserSettings, 
  BusinessLogo, Skill, HQLevel, PortfolioItem, UniversalLessonUnit, BusinessSimulation,
  StudentGroup, Rubric, Assignment, Submission, CMSContent, Book, SubscriptionTier
} from './types';
import { ALL_LESSONS } from './data/curriculum';
import { GAMES_DB } from './data/games';
import { INITIAL_LIBRARY } from './data/libraryBooks';
import { SoundService } from './services/SoundService';

// Constants
export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 5000];
export const MAX_LOCAL_USERS = 50; // Safety limit for LocalStorage

export const SUBSCRIPTION_PLANS = [
  {
    id: 'intern',
    name: 'Intern',
    price: 0,
    interval: 'mo',
    description: 'For curious kids just starting out.',
    features: ['Limited Energy', 'Standard Lessons', 'Ads'],
    color: 'bg-white border-gray-200',
    buttonColor: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    tier: 'intern' as SubscriptionTier
  },
  {
    id: 'founder',
    name: 'Founder',
    price: 9.99,
    interval: 'mo',
    description: 'Serious about building an empire.',
    features: ['Unlimited Energy', 'Offline Mode', 'Custom HQ'],
    color: 'bg-blue-50 border-blue-200',
    buttonColor: 'bg-blue-600 text-white hover:bg-blue-700',
    tier: 'founder' as SubscriptionTier,
    recommended: true
  },
  {
    id: 'board',
    name: 'Board Member',
    price: 119,
    interval: 'yr',
    description: 'For the whole family.',
    features: ['6 Family Accounts', 'Parent Dashboard', 'All Founder Perks'],
    color: 'bg-purple-50 border-purple-200',
    buttonColor: 'bg-purple-600 text-white hover:bg-purple-700',
    tier: 'board' as SubscriptionTier
  },
  {
    id: 'tycoon',
    name: 'Tycoon',
    price: 169,
    interval: 'yr',
    description: 'The ultimate VIP experience.',
    features: ['Ollie AI Consultant', 'Negotiation Battles', 'All Board Perks'],
    color: 'bg-yellow-50 border-yellow-400 ring-4 ring-yellow-400/20',
    buttonColor: 'bg-kid-primary text-yellow-900 hover:bg-yellow-400',
    tier: 'tycoon' as SubscriptionTier
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  // Apparel
  { id: 'item_sunglasses', name: 'Cool Shades', description: 'Look like a boss.', cost: 50, type: 'AVATAR', icon: '🕶️' },
  { id: 'item_hat', name: 'Top Hat', description: 'Classy business attire.', cost: 80, type: 'AVATAR', icon: '🎩' },
  { id: 'item_suit', name: 'CEO Suit', description: 'Dress for success.', cost: 150, type: 'AVATAR', icon: '👔' },
  { id: 'item_crown', name: 'Royal Crown', description: 'King of the market.', cost: 500, type: 'AVATAR', icon: '👑' },
  { id: 'item_cape', name: 'Hero Cape', description: 'Super CEO!', cost: 300, type: 'AVATAR', icon: '🦸' },
  { id: 'item_monocle', name: 'Fancy Monocle', description: 'Very sophisticated.', cost: 250, type: 'AVATAR', icon: '🧐' },
  { id: 'item_bow', name: 'Bow Tie', description: 'Dapper style.', cost: 120, type: 'AVATAR', icon: '🎀' },
  { id: 'item_astro', name: 'Astro Helmet', description: 'To the moon!', cost: 600, type: 'AVATAR', icon: '👩‍🚀' },
  { id: 'item_chef', name: 'Chef Hat', description: 'Cooking up profits.', cost: 100, type: 'AVATAR', icon: '👨‍🍳' },
  { id: 'item_beret', name: 'Artist Beret', description: 'Creative genius.', cost: 90, type: 'AVATAR', icon: '🎨' },
  
  // Powerups
  { id: 'item_freeze', name: 'Streak Freeze', description: 'Miss a day without losing your streak!', cost: 200, type: 'POWERUP', icon: '❄️' },
  
  // Consumables (New)
  { id: 'cons_consultant', name: 'The Consultant', description: 'Removes 2 wrong answers in a quiz.', cost: 30, type: 'CONSUMABLE', icon: '🕵️‍♂️', effectType: 'HINT' },
  { id: 'cons_bailout', name: 'Bailout Potion', description: 'Continue a game after failing.', cost: 50, type: 'CONSUMABLE', icon: '🧪', effectType: 'SECOND_LIFE' },
  { id: 'cons_boom', name: 'Market Boom', description: 'Double income for 15 mins.', cost: 100, type: 'CONSUMABLE', icon: '📈', effectType: 'INCOME_BOOST' },
  { id: 'cons_xp_small', name: 'XP Snack', description: '+50 XP instantly.', cost: 40, type: 'CONSUMABLE', icon: '🍫', effectType: 'INCOME_BOOST' },
  { id: 'cons_xp_large', name: 'XP Feast', description: '+200 XP instantly.', cost: 150, type: 'CONSUMABLE', icon: '🍱', effectType: 'INCOME_BOOST' },
  { id: 'cons_lucky', name: 'Lucky Clover', description: 'Better events for 1 day.', cost: 75, type: 'CONSUMABLE', icon: '🍀', effectType: 'INCOME_BOOST' },
];

export const HQ_LEVELS: HQLevel[] = [
  { id: 'hq_garage', name: 'Messy Garage', cost: 0, description: 'Where every great idea starts.', icon: '🏚️' },
  { id: 'hq_office', name: 'Shared Office', cost: 5000, description: 'A proper desk and a coffee machine.', icon: '🏢' },
  { id: 'hq_highrise', name: 'High-Rise Floor', cost: 50000, description: 'Glass windows with a city view.', icon: '🏙️' },
  { id: 'hq_island', name: 'Private Island', cost: 1000000, description: 'The ultimate status symbol.', icon: '🏝️' },
];

export const SKILLS_DB: Skill[] = [
  // Charisma Branch
  { id: 'skl_silver_tongue', name: 'Silver Tongue', category: 'CHARISMA', description: 'Customers pay 5% more.', cost: 200, effect: { type: 'PASSIVE_PRICE', value: 0.05 } },
  { id: 'skl_negotiator', name: 'Negotiator', category: 'CHARISMA', description: 'Supplier costs reduced by 10%.', cost: 500, effect: { type: 'PASSIVE_COST', value: 0.10 } },
  { id: 'skl_famous', name: 'Local Celebrity', category: 'CHARISMA', description: 'Can charge 15% more for everything.', cost: 1500, effect: { type: 'PASSIVE_PRICE', value: 0.15 } },
  
  // Efficiency Branch
  { id: 'skl_fast_hands', name: 'Fast Hands', category: 'EFFICIENCY', description: 'Click/Swipe actions are 10% faster.', cost: 200, effect: { type: 'ACTIVE_CLICK', value: 0.10 } },
  { id: 'skl_multitasker', name: 'Multitasker', category: 'EFFICIENCY', description: 'Game timers run 15% slower.', cost: 500, effect: { type: 'PASSIVE_SPEED', value: 0.15 } },
  { id: 'skl_robotics', name: 'Robotic Workers', category: 'EFFICIENCY', description: 'Operational costs reduced by 20%.', cost: 1500, effect: { type: 'PASSIVE_COST', value: 0.20 } },

  // Wisdom Branch
  { id: 'skl_fast_learner', name: 'Fast Learner', category: 'WISDOM', description: 'Earn +20% XP from lessons.', cost: 300, effect: { type: 'PASSIVE_XP', value: 0.20 } },
  { id: 'skl_tycoon', name: 'Tycoon Mindset', category: 'WISDOM', description: 'Portfolio earns 10% more income.', cost: 800, effect: { type: 'PASSIVE_PRICE', value: 0.10 } },
  { id: 'skl_guru', name: 'Business Guru', category: 'WISDOM', description: 'Earn +50% XP from everything.', cost: 2000, effect: { type: 'PASSIVE_XP', value: 0.50 } },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u1', name: 'BizWhiz', xp: 5200, avatar: '🦊' },
  { id: 'u2', name: 'RocketCEO', xp: 4800, avatar: '🚀' },
  { id: 'u3', name: 'MoneyMaker', xp: 3500, avatar: '🦁' },
  { id: 'u4', name: 'DiamondHands', xp: 2100, avatar: '💎' },
  { id: 'kid_1', name: 'Leo', xp: 1250, avatar: '🐼', isCurrentUser: true },
];

// Helper: Calculate Level
const getLevel = (xp: number) => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return level;
};

// Helper: Date string YYYY-MM-DD
const getToday = () => new Date().toISOString().split('T')[0];
const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoalMinutes: 15,
  soundEnabled: true,
  musicEnabled: true,
  themeColor: 'green',
  themeMode: 'light' // Added
};

const DEFAULT_CMS_CONTENT: CMSContent = {
  landing: {
    heroTitle: "Don't just play games.\nBuild an Empire.",
    heroSubtitle: "KidCap HQ turns screen time into real-world business skills. Learn finance, leadership, and marketing through addictive mini-games.",
    heroCta: "Play Now - It's Free!",
    heroImage: "/images/hero/hero.jpg",
    featuresTitle: "How KidCap Works",
    featuresSubtitle: "We use a simple loop to make learning sticky and addictive.",
    arcadeTitle: "Real Business Simulations",
    arcadeDesc: "Kids don't just read about business; they run them. Our simulation engine adapts to their skill level, teaching supply & demand, profit margins, and customer service in real-time.",
    ctaTitle: "Ready to launch your startup?",
    ctaSubtitle: "Join for free today. No credit card required.",
    extraSections: [] // Initialize empty
  },
  features: {
    learningTitle: "Interactive Learning Engine",
    learningDesc: "Forget boring textbooks. Our curriculum is broken down into bite-sized, gamified lessons that cover everything from Bartering to Blockchain.",
    learningImage: "/images/features/learning.jpg",
    arcadeTitle: "Business Arcade",
    arcadeDesc: "Theory is good, practice is better. Kids run virtual companies, manage budgets, and react to market changes in real-time.",
    arcadeImage: "/images/features/arcade.jpg",
    progressionTitle: "RPG Progression",
    progressionDesc: "We use game mechanics to keep kids engaged. As they learn, they level up, earn badges, and upgrade their virtual headquarters.",
    progressionImage: "/images/features/progression.jpg",
    safetyTitle: "Safe & Secure",
    safetyDesc: "A worry-free environment for parents. We prioritize privacy, safety, and positive reinforcement.",
    safetyImage: "/images/features/safety.jpg"
  },
  customPages: [] // Initialize empty
};

// Mock Data
const MOCK_USER: User = {
  id: 'kid_1',
  name: 'Leo',
  username: 'leo',
  password: '123',
  role: UserRole.KID,
  xp: 1250,
  level: 5,
  streak: 3,
  lastActivityDate: getYesterday(),
  bizCoins: 1500,
  currentModuleId: 'mod_1',
  completedLessonIds: [],
  readBookIds: ['rich-dad-poor-dad', 'shoe-dog'],
  badges: ['First Sale', 'Bookworm'],
  inventory: ['item_sunglasses'],
  settings: DEFAULT_SETTINGS,
  businessLogo: {
      companyName: 'Leo Corp',
      backgroundColor: '#FFC800',
      icon: 'rocket',
      iconColor: '#FFFFFF',
      shape: 'circle'
  },
  hqLevel: 'hq_garage',
  unlockedSkills: ['skl_silver_tongue', 'skl_fast_hands'],
  portfolio: [{ businessId: 'BIZ_01_LEMONADE', managerLevel: 1, lastCollected: new Date().toISOString() }],
  equippedItems: ['item_sunglasses'],
  subscriptionStatus: 'FREE',
  subscriptionTier: 'intern',
  energy: 5,
  lastEnergyRefill: Date.now(),
  classId: 'class_1' // Part of the mock classroom
};

const MOCK_PARENT: User = {
  ...MOCK_USER,
  id: 'parent_1',
  username: 'mom',
  password: '123',
  role: UserRole.PARENT,
  name: 'Mom',
  linkedChildId: 'kid_1',
  subscriptionStatus: 'FREE',
  subscriptionTier: 'intern',
};

const MOCK_TEACHER: User = {
  ...MOCK_USER,
  id: 'teacher_1',
  username: 'teacher',
  password: '123',
  role: UserRole.TEACHER,
  name: 'Mr. Stark',
  classId: 'class_1',
  subscriptionStatus: 'PREMIUM',
  subscriptionTier: 'tycoon',
};

const MOCK_ADMIN: User = {
  ...MOCK_USER,
  id: 'admin_1',
  username: 'admin',
  password: '123',
  role: UserRole.ADMIN,
  name: 'Super Admin',
  subscriptionStatus: 'PREMIUM',
  subscriptionTier: 'tycoon',
};

const MOCK_CLASSROOM: Classroom = {
  id: 'class_1',
  name: 'Future Founders 101',
  code: 'BIZ101',
  teacherId: 'teacher_1',
  studentIds: ['kid_1', 'kid_2', 'kid_3'],
  lockedModules: []
};

// --- MOCK TEACHER DATA (New) ---
const MOCK_STUDENT_GROUPS: StudentGroup[] = [
  { id: 'grp_1', classId: 'class_1', name: 'Advanced Math', studentIds: ['kid_1'], color: '#dbeafe' },
  { id: 'grp_2', classId: 'class_1', name: 'Need Support', studentIds: ['kid_2', 'kid_3'], color: '#fef3c7' }
];

const MOCK_RUBRICS: Rubric[] = [
  {
    id: 'rubric_1',
    teacherId: 'teacher_1',
    title: 'Standard Business Pitch',
    criteria: [
      { id: 'crit_1', title: 'Clarity', description: 'Was the business idea easy to understand?', maxScore: 5 },
      { id: 'crit_2', title: 'Creativity', description: 'Was the logo and name unique?', maxScore: 5 },
      { id: 'crit_3', title: 'Feasibility', description: 'Could this business actually work?', maxScore: 5 }
    ]
  }
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign_1',
    classId: 'class_1',
    lessonId: 'MB_01', // Linking to the Barter System lesson
    title: 'Barter System Challenge',
    description: 'Read the lesson on the Barter System. Then, find 3 items in your house you would trade for a new video game. List them in your submission.',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    status: 'PUBLISHED',
    maxPoints: 100,
    createdAt: new Date().toISOString()
  },
  {
    id: 'assign_2',
    classId: 'class_1',
    lessonId: 'ENT_14', // Linking to Logo lesson
    title: 'Design Your Logo (Advanced)',
    description: 'Use the Brand Builder tool to create a logo. Submit a screenshot or describe your color choices here.',
    studentGroupId: 'grp_1', // Only for Advanced group
    rubricId: 'rubric_1', // Uses rubric
    status: 'PUBLISHED',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    maxPoints: 15, // Rubric max
    createdAt: new Date().toISOString()
  }
];

const MOCK_SUBMISSIONS: Submission[] = [];

const INITIAL_LEMONADE_STATE: LemonadeState = {
  day: 1,
  funds: 20.00,
  inventory: { lemons: 0, sugar: 0, cups: 0 },
  recipe: { lemonsPerCup: 1, sugarPerCup: 1, pricePerCup: 1.00 },
  history: []
};

interface AppState {
  user: User | null;
  lemonadeState: LemonadeState;
  showLevelUpModal: boolean;
  levelUpData: { level: number, xp: number } | null;
  
  // Classrooms
  classroom: Classroom | null; // Active classroom
  classrooms: Classroom[]; // All classrooms (for persistence)
  
  // Content State
  lessons: UniversalLessonUnit[];
  games: BusinessSimulation[];
  users: User[];
  cmsContent: CMSContent; // CMS Data
  library: Book[];
  isAdminMode: boolean;
  
  // Teacher Feature State (New)
  studentGroups: StudentGroup[];
  rubrics: Rubric[];
  assignments: Assignment[];
  submissions: Submission[];
  
  // Actions
  login: (role: UserRole) => void; 
  loginWithCredentials: (username: string, password: string) => boolean;
  impersonateUser: (userId: string) => void; // New Admin Action
  registerUser: (name: string, username: string, password: string, role: UserRole) => string | undefined;
  logout: () => void;
  checkStreak: () => void;
  completeLesson: (lessonId: string, xpReward?: number, coinReward?: number) => void;
  readBook: (bookId: string) => void;
  buyItem: (item: ShopItem) => void;
  toggleEquipItem: (itemId: string) => void;
  closeLevelUpModal: () => void;
  updateLemonadeState: (newState: Partial<LemonadeState>) => void;
  
  // SaaS / Admin Actions
  joinClass: (code: string) => boolean;
  toggleModuleLock: (moduleId: string) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateBusinessLogo: (logo: BusinessLogo) => void;
  completeGame: (score: number, xpReward: number) => void;
  upgradeHQ: (hqId: string) => void;
  unlockSkill: (skillId: string) => void;
  hireManager: (businessId: string) => void;
  collectIdleIncome: (businessId: string) => number;
  collectAllIdleIncome: () => void;
  getSkillModifiers: () => { xpMultiplier: number, costMultiplier: number, priceMultiplier: number };
  upgradeSubscription: (tier: SubscriptionTier) => void;
  hasUnlimitedEnergy: () => boolean;
  hasAiAccess: () => boolean;
  consumeEnergy: () => boolean; // NEW: Robust energy consumption action

  // Content CRUD
  addLesson: (lesson: UniversalLessonUnit) => void;
  updateLesson: (id: string, updates: Partial<UniversalLessonUnit>) => void;
  deleteLesson: (id: string) => void;
  addGame: (game: BusinessSimulation) => void;
  updateGame: (id: string, updates: Partial<BusinessSimulation>) => void;
  deleteGame: (id: string) => void;
  syncGames: () => void;
  
  // Library CRUD
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Book>) => void; // Added this
  removeBook: (id: string) => void;
  toggleAdminMode: () => void;

  // User CRUD
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Teacher Feature Actions (New)
  addStudentGroup: (group: StudentGroup) => void;
  updateStudentGroup: (id: string, updates: Partial<StudentGroup>) => void;
  deleteStudentGroup: (id: string) => void;
  
  addRubric: (rubric: Rubric) => void;
  updateRubric: (id: string, updates: Partial<Rubric>) => void;
  deleteRubric: (id: string) => void;
  
  addAssignment: (assignment) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  
  addSubmission: (submission: Submission) => void;
  updateSubmission: (id: string, updates: Partial<Submission>) => void;
  deleteSubmission: (id: string) => void; // New Action

  addClassroom: (classroom: Classroom) => void; // Admin Action
  updateClassroom: (id: string, updates: Partial<Classroom>) => void; // Admin Action
  deleteClassroom: (id: string) => void; // Admin Action
  updateCMSContent: (updates: Partial<CMSContent>) => void; // Admin Action
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      lemonadeState: INITIAL_LEMONADE_STATE,
      showLevelUpModal: false,
      levelUpData: null,
      classroom: null,
      classrooms: [MOCK_CLASSROOM],
      lessons: ALL_LESSONS,
      games: GAMES_DB,
      users: [MOCK_USER, MOCK_PARENT, MOCK_TEACHER, MOCK_ADMIN],
      cmsContent: DEFAULT_CMS_CONTENT,
      library: INITIAL_LIBRARY,
      isAdminMode: false,
      
      // Initialize Teacher Feature Data
      studentGroups: MOCK_STUDENT_GROUPS,
      rubrics: MOCK_RUBRICS,
      assignments: MOCK_ASSIGNMENTS,
      submissions: MOCK_SUBMISSIONS,

      // Deprecated simple login
      login: (role: UserRole) => {
        const currentUser = get().user;
        if (currentUser && currentUser.role === role) return;

        const targetUser = get().users.find(u => u.role === role);
        let user = null;
        let classroom = null;
        
        if (targetUser) {
            user = { ...targetUser };
            if (role === UserRole.TEACHER) classroom = { ...MOCK_CLASSROOM };
        } else {
            if (role === UserRole.KID) user = { ...MOCK_USER };
            if (role === UserRole.PARENT) user = { ...MOCK_PARENT };
            if (role === UserRole.TEACHER) user = { ...MOCK_TEACHER };
            if (role === UserRole.ADMIN) user = { ...MOCK_ADMIN };
        }

        set({ user, classroom });
        if (role === UserRole.KID) get().checkStreak();
      },

      loginWithCredentials: (username, password) => {
          const { users, classrooms } = get();
          const matchedUser = users.find(u => u.username === username && u.password === password);
          
          if (matchedUser) {
              let activeClassroom = null;
              
              // Correctly load the teacher's classroom
              if (matchedUser.role === UserRole.TEACHER) {
                  activeClassroom = classrooms.find(c => c.teacherId === matchedUser.id) || null;
              }
              
              // Load student's classroom if linked
              if (matchedUser.role === UserRole.KID && matchedUser.classId) {
                  activeClassroom = classrooms.find(c => c.id === matchedUser.classId) || null;
              }
              
              set({ user: matchedUser, classroom: activeClassroom });
              if (matchedUser.role === UserRole.KID) get().checkStreak();
              return true;
          }
          return false;
      },

      // Admin Impersonation Action
      impersonateUser: (userId: string) => {
          const { users, classrooms } = get();
          const matchedUser = users.find(u => u.id === userId);
          if (matchedUser) {
              let activeClassroom = null;
              if (matchedUser.role === UserRole.TEACHER) {
                  activeClassroom = classrooms.find(c => c.teacherId === matchedUser.id) || null;
              }
              if (matchedUser.role === UserRole.KID && matchedUser.classId) {
                  activeClassroom = classrooms.find(c => c.id === matchedUser.classId) || null;
              }
              set({ user: matchedUser, classroom: activeClassroom });
          }
      },

      registerUser: (name, username, password, role) => {
          const state = get();
          const currentUsers = state.users;
          
          if (currentUsers.length >= MAX_LOCAL_USERS) {
              return `Device limit reached! This device can only hold ${MAX_LOCAL_USERS} accounts.`;
          }

          if (currentUsers.some(u => u.username === username)) {
              return "Username already taken. Please choose another.";
          }

          const newUser: User = {
              id: `user_${Date.now()}`,
              name,
              username,
              password,
              role,
              xp: 0,
              level: 1,
              streak: 1,
              lastActivityDate: getToday(),
              bizCoins: 100, // Sign up bonus
              currentModuleId: 'mod_1',
              completedLessonIds: [],
              readBookIds: [],
              badges: ['Newbie'],
              inventory: [],
              settings: DEFAULT_SETTINGS,
              hqLevel: 'hq_garage',
              unlockedSkills: [],
              portfolio: [],
              equippedItems: [],
              subscriptionStatus: 'FREE',
              subscriptionTier: 'intern',
              energy: 5,
              lastEnergyRefill: Date.now()
          };

          let newClassroom: Classroom | null = null;
          let updatedClassrooms = state.classrooms;

          if (role === UserRole.KID) {
              newUser.businessLogo = {
                  companyName: `${name}'s Biz`,
                  backgroundColor: '#3B82F6',
                  icon: 'rocket',
                  iconColor: '#FFFFFF',
                  shape: 'circle'
              };
          }

          if (role === UserRole.TEACHER) {
              newClassroom = {
                  id: `class_${newUser.id}`,
                  name: `${name}'s Class`,
                  code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                  teacherId: newUser.id,
                  studentIds: [],
                  lockedModules: []
              };
              updatedClassrooms = [...state.classrooms, newClassroom];
          }

          if (role === UserRole.PARENT) {
              const demoKid = currentUsers.find(u => u.role === UserRole.KID);
              if (demoKid) {
                  newUser.linkedChildId = demoKid.id;
              }
          }

          set((state) => ({ 
              users: [...state.users, newUser],
              user: newUser,
              classroom: newClassroom, 
              classrooms: updatedClassrooms
          }));
          return undefined; // Success
      },
      
      logout: () => set({ user: null, classroom: null }),

      checkStreak: () => set((state) => {
        if (!state.user) return {};
        const today = getToday();
        const yesterday = getYesterday();
        
        if (state.user.lastActivityDate === today) return {}; 

        let newStreak = state.user.streak;
        let newInventory = [...state.user.inventory];
        
        if (state.user.lastActivityDate === yesterday) {
          newStreak += 1; 
        } else {
          const freezeIndex = newInventory.indexOf('item_freeze');
          if (freezeIndex !== -1) {
             console.log("Streak Freeze Activated!");
             newInventory.splice(freezeIndex, 1);
          } else {
             newStreak = 1; 
          }
        }

        const updatedUser = { 
            ...state.user, 
            lastActivityDate: today,
            streak: newStreak,
            inventory: newInventory
        };

        const updatedUsers = state.users.map(u => u.id === state.user!.id ? updatedUser : u);

        return { user: updatedUser, users: updatedUsers };
      }),

      completeLesson: (lessonId, xpReward, coinReward) => {
        const state = get();
        if (!state.user) return;
        if (state.user.completedLessonIds.includes(lessonId)) return;

        const modifiers = state.getSkillModifiers();
        const baseXp = xpReward !== undefined ? xpReward : 50;
        const baseCoins = coinReward !== undefined ? coinReward : 20;

        const newXp = state.user.xp + Math.round(baseXp * modifiers.xpMultiplier);
        const oldLevel = state.user.level;
        const newLevel = getLevel(newXp);
        const leveledUp = newLevel > oldLevel;
        
        if (leveledUp && state.user.settings.soundEnabled) SoundService.playLevelUp();
        else if (state.user.settings.soundEnabled) SoundService.playSuccess();

        const updatedUser = {
            ...state.user,
            completedLessonIds: [...state.user.completedLessonIds, lessonId],
            xp: newXp,
            level: newLevel,
            bizCoins: state.user.bizCoins + baseCoins
        };

        set({
          user: updatedUser,
          users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u), 
          showLevelUpModal: leveledUp,
          levelUpData: leveledUp ? { level: newLevel, xp: newXp } : null
        });
      },

      readBook: (bookId: string) => set((state) => {
        if (!state.user) return {};
        // Use empty array fallback if readBookIds is undefined
        const currentBooks = state.user.readBookIds || [];
        if (currentBooks.includes(bookId)) return {};

        const updatedUser = { 
            ...state.user, 
            readBookIds: [...currentBooks, bookId] 
        };
        
        return { 
            user: updatedUser, 
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) 
        };
      }),

      buyItem: (item) => set((state) => {
        if (!state.user) return {};
        if (state.user.bizCoins < item.cost) {
            if (state.user.settings.soundEnabled) SoundService.playError();
            return {}; 
        }
        
        const isUnique = item.type === 'AVATAR';
        if (isUnique && state.user.inventory.includes(item.id)) return {};

        if (state.user.settings.soundEnabled) SoundService.playCoin();

        const updatedUser = {
            ...state.user,
            bizCoins: state.user.bizCoins - item.cost,
            inventory: [...state.user.inventory, item.id]
        };

        return {
          user: updatedUser,
          users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
      }),

      toggleEquipItem: (itemId: string) => set((state) => {
        if (!state.user) return {};
        if (state.user.settings.soundEnabled) SoundService.playClick();
        
        const isEquipped = state.user.equippedItems.includes(itemId);
        let newEquipped = [...state.user.equippedItems];

        // Slot Definition
        const getSlot = (id: string) => {
            if (id.includes('hat') || id.includes('crown') || id.includes('helmet') || id.includes('cap') || id.includes('beret') || id.includes('tiara')) return 'head';
            if (id.includes('sunglasses') || id.includes('monocle')) return 'eyes';
            if (id.includes('suit') || id.includes('cape') || id.includes('gear')) return 'body';
            return 'misc';
        };

        if (isEquipped) {
            newEquipped = newEquipped.filter(id => id !== itemId);
        } else {
            const targetSlot = getSlot(itemId);
            newEquipped = newEquipped.filter(id => getSlot(id) !== targetSlot);
            newEquipped.push(itemId);
        }

        const updatedUser = { ...state.user, equippedItems: newEquipped };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
      }),

      closeLevelUpModal: () => set({ showLevelUpModal: false, levelUpData: null }),

      updateLemonadeState: (newState) => set((state) => ({
        lemonadeState: { ...state.lemonadeState, ...newState }
      })),

      joinClass: (code) => {
        const { classrooms } = get();
        const targetClass = classrooms.find(c => c.code === code);
        
        if (targetClass) {
          set((state) => {
             if(!state.user) return {};
             const updatedUser = { ...state.user, classId: targetClass.id };
             return {
                 user: updatedUser,
                 users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
                 classroom: targetClass
             };
          });
          return true;
        }
        return false;
      },

      toggleModuleLock: (moduleId) => set((state) => {
          if (!state.classroom) return {};
          const isLocked = state.classroom.lockedModules.includes(moduleId);
          const newLocked = isLocked 
            ? state.classroom.lockedModules.filter(id => id !== moduleId)
            : [...state.classroom.lockedModules, moduleId];
            
          const updatedClassroom = { ...state.classroom, lockedModules: newLocked };
          return { 
              classroom: updatedClassroom,
              classrooms: state.classrooms.map(c => c.id === updatedClassroom.id ? updatedClassroom : c)
          };
      }),

      updateUserSettings: (newSettings) => set((state) => {
          if (!state.user) return {};
          const updatedUser = { ...state.user, settings: { ...state.user.settings, ...newSettings }};
          return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
      }),

      updateBusinessLogo: (logo) => set((state) => {
        if (!state.user) return {};
        const updatedUser = { ...state.user, businessLogo: logo };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
      }),

      completeGame: (score, xpReward) => {
          const state = get();
          if (!state.user) return;
          
          const modifiers = state.getSkillModifiers();
          const newXp = state.user.xp + Math.round(xpReward * modifiers.xpMultiplier);
          const oldLevel = state.user.level;
          const newLevel = getLevel(newXp);
          const leveledUp = newLevel > oldLevel;
          const coinReward = Math.floor(xpReward / 5);

          if (leveledUp && state.user.settings.soundEnabled) SoundService.playLevelUp();
          else if (state.user.settings.soundEnabled) SoundService.playSuccess();

          const updatedUser = {
              ...state.user,
              xp: newXp,
              level: newLevel,
              bizCoins: state.user.bizCoins + coinReward
          };

          set({
              user: updatedUser,
              users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
              showLevelUpModal: leveledUp,
              levelUpData: leveledUp ? { level: newLevel, xp: newXp } : null
          });
      },

      upgradeHQ: (hqId) => set((state) => {
        if (!state.user) return {};
        const hq = HQ_LEVELS.find(h => h.id === hqId);
        if (!hq) return {};
        if (state.user.bizCoins < hq.cost) {
            if (state.user.settings.soundEnabled) SoundService.playError();
            return {};
        }
        if (state.user.settings.soundEnabled) SoundService.playSuccess();

        const updatedUser = { ...state.user, bizCoins: state.user.bizCoins - hq.cost, hqLevel: hqId };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
      }),

      unlockSkill: (skillId) => set((state) => {
        if (!state.user) return {};
        const skill = SKILLS_DB.find(s => s.id === skillId);
        if (!skill) return {};
        if (state.user.bizCoins < skill.cost) {
            if (state.user.settings.soundEnabled) SoundService.playError();
            return {};
        }
        if (state.user.unlockedSkills.includes(skillId)) return {};
        if (state.user.settings.soundEnabled) SoundService.playSuccess();

        const updatedUser = {
          ...state.user,
          bizCoins: state.user.bizCoins - skill.cost,
          unlockedSkills: [...state.user.unlockedSkills, skillId]
        };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
      }),

      hireManager: (businessId) => set((state) => {
        if (!state.user) return {};
        const hireCost = 500;
        if (state.user.bizCoins < hireCost) return {};
        if (state.user.portfolio.some(p => p.businessId === businessId)) return {};
        if (state.user.settings.soundEnabled) SoundService.playCoin();

        const newItem: PortfolioItem = { businessId, managerLevel: 1, lastCollected: new Date().toISOString() };
        const updatedUser = {
          ...state.user,
          bizCoins: state.user.bizCoins - hireCost,
          portfolio: [...state.user.portfolio, newItem]
        };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
      }),

      collectIdleIncome: (businessId) => {
        const state = get();
        if (!state.user) return 0;
        const itemIndex = state.user.portfolio.findIndex(p => p.businessId === businessId);
        if (itemIndex === -1) return 0;

        const item = state.user.portfolio[itemIndex];
        const last = new Date(item.lastCollected);
        
        // FIX: NaN Safety Check
        if (isNaN(last.getTime())) {
            console.warn("Found corrupted date in portfolio, resetting timestamp.");
            const updatedPortfolio = [...state.user.portfolio];
            updatedPortfolio[itemIndex] = { ...item, lastCollected: new Date().toISOString() };
            set({ user: { ...state.user, portfolio: updatedPortfolio }});
            return 0; 
        }

        const now = new Date();
        const diffMs = now.getTime() - last.getTime();
        const diffMinutes = Math.min(1440, diffMs / (1000 * 60));
        const hourlyRate = 10 * item.managerLevel;
        const earned = Math.floor((hourlyRate / 60) * diffMinutes);

        if (earned <= 0) return 0;
        if (state.user.settings.soundEnabled) SoundService.playCoin();

        const updatedPortfolio = [...state.user.portfolio];
        updatedPortfolio[itemIndex] = { ...item, lastCollected: now.toISOString() };
        const updatedUser = { ...state.user, bizCoins: state.user.bizCoins + earned, portfolio: updatedPortfolio };

        set({ user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) });
        return earned;
      },

      collectAllIdleIncome: () => set((state) => {
          if (!state.user) return {};
          let totalEarned = 0;
          const now = new Date();
          const updatedPortfolio = state.user.portfolio.map(item => {
              const last = new Date(item.lastCollected);
              
              // FIX: NaN Safety Check Loop
              if (isNaN(last.getTime())) {
                  return { ...item, lastCollected: now.toISOString() };
              }

              const diffMs = now.getTime() - last.getTime();
              const diffMinutes = Math.min(1440, diffMs / (1000 * 60));
              const hourlyRate = 10 * item.managerLevel;
              const earned = Math.floor((hourlyRate / 60) * diffMinutes);
              if (earned > 0) {
                  totalEarned += earned;
                  return { ...item, lastCollected: now.toISOString() };
              }
              return item;
          });

          if (totalEarned > 0) {
              if (state.user.settings.soundEnabled) SoundService.playCoin();
              const updatedUser = {
                  ...state.user,
                  bizCoins: state.user.bizCoins + totalEarned,
                  portfolio: updatedPortfolio
              };
              return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
          }
          return {};
      }),

      getSkillModifiers: () => {
        const state = get();
        const mods = { xpMultiplier: 1, costMultiplier: 1, priceMultiplier: 1 };
        if (!state.user) return mods;
        state.user.unlockedSkills.forEach(skillId => {
          const skill = SKILLS_DB.find(s => s.id === skillId);
          if (skill) {
            if (skill.effect.type === 'PASSIVE_XP') mods.xpMultiplier += skill.effect.value;
            if (skill.effect.type === 'PASSIVE_COST') mods.costMultiplier -= skill.effect.value;
            if (skill.effect.type === 'PASSIVE_PRICE') mods.priceMultiplier += skill.effect.value;
          }
        });
        return mods;
      },

      upgradeSubscription: (tier) => set((state) => {
          if (!state.user) return {};
          if (state.user.settings.soundEnabled) SoundService.playLevelUp();
          const updatedUser = { 
              ...state.user, 
              subscriptionTier: tier,
              subscriptionStatus: (tier === 'intern' ? 'FREE' : 'PREMIUM') as 'FREE' | 'PREMIUM'
          };
          return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
      }),

      hasUnlimitedEnergy: () => {
          const user = get().user;
          if (!user) return false;
          // IMPORTANT: If tier is missing or undefined, assume intern (false)
          return ['founder', 'board', 'tycoon'].includes(user.subscriptionTier || 'intern');
      },

      hasAiAccess: () => {
          const user = get().user;
          if (!user) return false;
          return user.subscriptionTier === 'tycoon';
      },

      consumeEnergy: () => {
          const state = get();
          if (!state.user) return false;
          
          const isUnlimited = ['founder', 'board', 'tycoon'].includes(state.user.subscriptionTier || 'intern');
          if (isUnlimited) return true;

          if (state.user.energy > 0) {
              const newEnergy = state.user.energy - 1;
              const updates: Partial<User> = { energy: newEnergy };
              
              // If we are consuming from MAX, set the timestamp to start refill timer
              if (state.user.energy === 5) {
                  updates.lastEnergyRefill = Date.now();
              }
              
              // Directly update state to ensure consistency
              const updatedUser = { ...state.user, ...updates };
              set({
                  user: updatedUser,
                  users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
              });
              return true;
          }
          return false;
      },

      // --- ADMIN ACTIONS ---
      addLesson: (lesson) => set((state) => ({ lessons: [...state.lessons, lesson] })),
      updateLesson: (id, updates) => set((state) => ({ lessons: state.lessons.map(l => l.id === id ? { ...l, ...updates } : l) })),
      deleteLesson: (id) => set((state) => ({ lessons: [...state.lessons.filter(l => l.id !== id)] })),
      addGame: (game) => set((state) => ({ games: [...state.games, game] })),
      updateGame: (id, updates) => set((state) => ({ games: state.games.map(g => g.business_id === id ? { ...g, ...updates } : g) })),
      deleteGame: (id) => set((state) => ({ games: [...state.games.filter(g => g.business_id !== id)] })),
      
      syncGames: () => set((state) => {
          const currentGames = state.games || [];
          const staticIds = new Set(GAMES_DB.map(g => g.business_id));
          const customGames = currentGames.filter(g => !staticIds.has(g.business_id));
          return { games: [...GAMES_DB, ...customGames] };
      }),

      // LIBRARY ACTIONS
      addBook: (book) => set((state) => ({ library: [...state.library, book] })),
      updateBook: (id, updates) => set((state) => ({ library: state.library.map(b => b.id === id ? { ...b, ...updates } : b) })),
      removeBook: (id) => set((state) => ({ library: state.library.filter(b => b.id !== id) })),
      toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),

      // USER ACTIONS
      addUser: (newUser) => set((state) => {
          if (state.users.length >= MAX_LOCAL_USERS) {
              alert(`Cannot add user: Device limit of ${MAX_LOCAL_USERS} reached.`);
              return {};
          }
          return { users: [...state.users, newUser] };
      }),
      updateUser: (id, updates) => set((state) => {
          const updatedUsers = state.users.map(u => u.id === id ? { ...u, ...updates } : u);
          const updatedCurrentUser = state.user && state.user.id === id ? { ...state.user, ...updates } : state.user;
          return { users: updatedUsers, user: updatedCurrentUser };
      }),
      deleteUser: (id) => set((state) => ({ users: [...state.users.filter(u => u.id !== id)] })),

      // TEACHER FEATURE ACTIONS
      addStudentGroup: (group) => set((state) => ({ studentGroups: [...state.studentGroups, group] })),
      updateStudentGroup: (id, updates) => set((state) => ({ studentGroups: state.studentGroups.map(g => g.id === id ? { ...g, ...updates } : g) })),
      deleteStudentGroup: (id) => set((state) => ({ studentGroups: state.studentGroups.filter(g => g.id !== id) })),
      
      addRubric: (rubric) => set((state) => ({ rubrics: [...state.rubrics, rubric] })),
      updateRubric: (id, updates) => set((state) => ({ rubrics: state.rubrics.map(r => r.id === id ? { ...r, ...updates } : r) })),
      deleteRubric: (id) => set((state) => ({ rubrics: state.rubrics.filter(r => r.id !== id) })),
      
      addAssignment: (assignment) => set((state) => ({ assignments: [...state.assignments, assignment] })),
      updateAssignment: (id, updates) => set((state) => ({ assignments: state.assignments.map(a => a.id === id ? { ...a, ...updates } : a) })),
      deleteAssignment: (id) => set((state) => ({ assignments: state.assignments.filter(a => a.id !== id) })),
      
      addSubmission: (submission) => set((state) => ({ submissions: [...state.submissions, submission] })),
      updateSubmission: (id, updates) => set((state) => ({ submissions: state.submissions.map(s => s.id === id ? { ...s, ...updates } : s) })),
      deleteSubmission: (id) => set((state) => ({ submissions: state.submissions.filter(s => s.id !== id) })),

      // --- ADMIN ONLY ACTIONS (Added) ---
      addClassroom: (classroom) => set((state) => ({ classrooms: [...state.classrooms, classroom] })),
      updateClassroom: (id, updates) => set((state) => ({ classrooms: state.classrooms.map(c => c.id === id ? { ...c, ...updates } : c) })),
      deleteClassroom: (id) => set((state) => ({ classrooms: state.classrooms.filter(c => c.id !== id) })),
      
      updateCMSContent: (updates) => set((state) => ({ cmsContent: { ...state.cmsContent, ...updates } })),
    }),
    {
      name: 'kidcap-storage-v6', // CHANGED VERSION TO FORCE RESET
      partialize: (state) => ({ 
        user: state.user,
        lemonadeState: state.lemonadeState,
        lessons: state.lessons, 
        games: state.games,
        users: state.users,
        classrooms: state.classrooms, 
        studentGroups: state.studentGroups,
        rubrics: state.rubrics,
        assignments: state.assignments,
        submissions: state.submissions,
        cmsContent: state.cmsContent,
        library: state.library,
        isAdminMode: state.isAdminMode
      }),
    }
  )
);
