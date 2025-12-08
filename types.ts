

// User & Auth
export enum UserRole {
  KID = 'KID',
  PARENT = 'PARENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface UserSettings {
  dailyGoalMinutes: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  themeColor: 'blue' | 'green' | 'purple';
}

export interface BusinessLogo {
  companyName: string;
  backgroundColor: string;
  icon: 'rocket' | 'pizza' | 'star' | 'smile' | 'bulb' | 'coffee' | 'music' | 'camera' | 'globe' | 'anchor' | 'cpu' | 'car' | 'zap';
  iconColor: string;
  shape: 'circle' | 'square' | 'rounded';
}

export interface Skill {
  id: string;
  name: string;
  category: 'CHARISMA' | 'EFFICIENCY' | 'WISDOM';
  description: string;
  cost: number;
  effect: {
    type: 'PASSIVE_PRICE' | 'PASSIVE_COST' | 'PASSIVE_XP' | 'ACTIVE_CLICK' | 'PASSIVE_SPEED';
    value: number; 
  };
}

export interface HQLevel {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
}

export interface PortfolioItem {
  businessId: string;
  managerLevel: number;
  lastCollected: string; // ISO Date
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string; // ISO Date YYYY-MM-DD
  bizCoins: number;
  currentModuleId: string;
  completedLessonIds: string[];
  badges: string[];
  inventory: string[]; // IDs of bought items
  
  // New Fields for Phase 3
  classId?: string; // Linked Class
  settings: UserSettings;
  linkedChildId?: string; // For Parent
  
  // Phase 4
  businessLogo?: BusinessLogo;

  // Phase 5: Progression
  hqLevel: string;
  unlockedSkills: string[];
  portfolio: PortfolioItem[];
  equippedItems: string[]; // IDs of currently worn items

  // Phase 6: SaaS / Subscription
  subscriptionStatus: 'FREE' | 'PREMIUM';
  billingCycle?: 'MONTHLY' | 'YEARLY';
}

export interface Classroom {
  id: string;
  name: string;
  code: string; // 6-digit alphanumeric
  teacherId: string;
  studentIds: string[];
  lockedModules: string[]; // Modules teacher has restricted
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'AVATAR' | 'POWERUP' | 'CONSUMABLE';
  icon: string;
  effectType?: 'HINT' | 'SECOND_LIFE' | 'INCOME_BOOST';
}

export interface LeaderboardEntry {
  id: string;
  name: string; // Masked name e.g. "Cool Panda"
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

// --- LEGACY LESSON TYPES (For LessonPlayer.tsx) ---
export enum SlideType {
  INTRO = 'INTRO',
  INFO = 'INFO',
  QUIZ = 'QUIZ',
  REWARD = 'REWARD'
}

export interface Slide {
  id: string;
  type: SlideType;
  content: string;
  imagePlaceholder?: string;
  options?: string[];
  correctAnswer?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  xpReward: number;
  slides: Slide[];
}

// --- LEMONADE GAME TYPES (For LemonadeStand.tsx) ---
export interface LemonadeState {
  day: number;
  funds: number;
  inventory: {
    lemons: number;
    sugar: number;
    cups: number;
  };
  recipe: {
    lemonsPerCup: number;
    sugarPerCup: number;
    pricePerCup: number;
  };
  history: Array<{
    day: number;
    weather: string;
    cupsSold: number;
    profit: number;
    feedback: string;
  }>;
}

// --- UNIVERSAL JSON SCHEMA (Game Engine V2) ---
export interface UniversalLessonUnit {
  id: string;
  topic_tag: string;
  difficulty: number;
  lesson_payload: {
    headline: string;
    body_text: string;
    key_term?: string; // Optional now
  };
  challenge_payload: {
    question_text: string;
    correct_answer: string;
    distractors: string[];
  };
  game_rewards: {
    base_xp: number;
    currency_value: number;
  };
  flavor_text: string;
}

// --- DYNAMIC GAME ENGINE TYPES ---

export type GameType = 'simulation_tycoon' | 'clicker_idle' | 'sorting_game' | 'driving_game' | 'matching_game' | 'rhythm_game';

export interface VisualConfig {
  theme: 'eco' | 'neon' | 'pastel' | 'realistic' | 'dark' | 'light';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  background_type?: 'gradient' | 'image' | 'solid';
  icon?: string;
}

export interface GameEntity {
  id: string;
  type: 'item' | 'obstacle' | 'target' | 'resource';
  name: string;
  emoji?: string; 
  value?: number;
  behavior?: 'fall' | 'static' | 'move_random';
}

export interface ScoringConfig {
  base_points: number;
  win_threshold?: number; // Score needed to win/pass day
  time_limit?: number; // Seconds
}

export interface BusinessUpgrade {
  id: string;
  name: string;
  effect: string; // Description
  cost: number;
  modifier_target?: string; // e.g., 'click_value', 'revenue_multiplier'
  modifier_value?: number;
}

export interface BusinessEvent {
  event_name: string;
  effect: string;
  duration: string;
  modifier_target?: string;
  modifier_value?: number;
}

export interface BusinessSimulation {
  business_id: string;
  name: string;
  category: string;
  description: string;
  game_type: GameType;
  
  // Visuals
  visual_config?: VisualConfig;

  // For Tycoon/Simulation Games
  variables?: {
    resources: string[];
    dynamic_factors: string[];
    player_inputs: string[]; // Keys for sliders
  };
  
  // For Arcade/Clicker Games
  game_mechanics?: {
    click_value?: number;
    auto_click_rate?: number;
    spawn_rate?: number;
    lanes?: number; // For sorting/driving
  };

  entities?: GameEntity[];
  scoring?: ScoringConfig;

  // Progression
  upgrade_tree: BusinessUpgrade[];
  event_triggers: {
    positive: BusinessEvent;
    negative: BusinessEvent;
  };
}