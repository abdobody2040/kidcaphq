
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, SHOP_ITEMS, LEVEL_THRESHOLDS } from '../store';
import { User, UserRole } from '../types';

// Helper to create a fresh mock user
const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'test_user',
  name: 'Test Kid',
  username: 'test',
  password: '123',
  role: UserRole.KID,
  xp: 0,
  level: 1,
  streak: 1,
  lastActivityDate: new Date().toISOString().split('T')[0],
  bizCoins: 100,
  currentModuleId: 'mod_1',
  completedLessonIds: [],
  badges: [],
  inventory: [],
  settings: {
    dailyGoalMinutes: 15,
    soundEnabled: false, // Disable sound for tests to avoid AudioContext issues
    musicEnabled: false,
    themeColor: 'green'
  },
  hqLevel: 'hq_garage',
  unlockedSkills: [],
  portfolio: [],
  equippedItems: [],
  subscriptionStatus: 'FREE',
  ...overrides
});

describe('Business Logic & Store', () => {
  // Reset store before each test
  beforeEach(() => {
    useAppStore.setState({
      user: createMockUser(),
      users: [createMockUser()],
      lemonadeState: {
        day: 1,
        funds: 0,
        inventory: { lemons: 0, sugar: 0, cups: 0 },
        recipe: { lemonsPerCup: 1, sugarPerCup: 1, pricePerCup: 1 },
        history: []
      },
      showLevelUpModal: false
    });
  });

  describe('Money Management', () => {
    it('should deduct money when buying an item', () => {
      const { buyItem } = useAppStore.getState();
      const item = SHOP_ITEMS[0]; // e.g., Sunglasses cost 50
      
      // Initial: 100 coins
      buyItem(item);
      
      const updatedUser = useAppStore.getState().user;
      expect(updatedUser?.bizCoins).toBe(100 - item.cost);
    });

    it('should NOT allow purchase if balance is too low (prevent negative balance)', () => {
      // Set coins to 0
      useAppStore.setState({ user: createMockUser({ bizCoins: 0 }) });
      
      const { buyItem } = useAppStore.getState();
      const item = SHOP_ITEMS[0]; // Cost 50
      
      buyItem(item);
      
      const updatedUser = useAppStore.getState().user;
      expect(updatedUser?.bizCoins).toBe(0); // Should remain 0
      expect(updatedUser?.inventory).not.toContain(item.id);
    });

    it('should add money when a game is completed', () => {
      const { completeGame } = useAppStore.getState();
      // Earn 50 coins
      completeGame(250, 100); // Score 250 (logic in store: coins = xpReward / 5? actually in store it is bizCoins + coinReward)
      // Checking store.ts: completeGame(score, xpReward) -> coinReward = floor(xpReward / 5)
      
      const updatedUser = useAppStore.getState().user;
      // 100 initial + (100 xp / 5) = 120
      expect(updatedUser?.bizCoins).toBe(120);
    });
  });

  describe('Leveling System', () => {
    it('should increase XP when completing a lesson', () => {
      const { completeLesson } = useAppStore.getState();
      completeLesson('test_lesson', 50, 10);
      
      const updatedUser = useAppStore.getState().user;
      expect(updatedUser?.xp).toBe(50);
    });

    it('should trigger level up when crossing threshold', () => {
      // Thresholds: [0, 100, 250...]
      // Start at 90 XP (Level 1)
      useAppStore.setState({ user: createMockUser({ xp: 90, level: 1 }) });
      
      const { completeLesson } = useAppStore.getState();
      // Add 20 XP -> Total 110 (Crosses 100)
      completeLesson('test_lesson_2', 20, 0);
      
      const state = useAppStore.getState();
      expect(state.user?.level).toBe(2);
      expect(state.showLevelUpModal).toBe(true);
      expect(state.levelUpData).toEqual({ level: 2, xp: 110 });
    });

    it('should NOT level up if threshold is not met', () => {
      useAppStore.setState({ user: createMockUser({ xp: 10, level: 1 }) });
      
      const { completeLesson } = useAppStore.getState();
      completeLesson('test_lesson_3', 10, 0); // Total 20, still < 100
      
      const state = useAppStore.getState();
      expect(state.user?.level).toBe(1);
      expect(state.showLevelUpModal).toBe(false);
    });
  });

  describe('Inventory Management', () => {
    it('should add item ID to inventory upon purchase', () => {
      const { buyItem } = useAppStore.getState();
      const item = SHOP_ITEMS[0];
      
      buyItem(item);
      
      const updatedUser = useAppStore.getState().user;
      expect(updatedUser?.inventory).toContain(item.id);
    });

    it('should prevent buying unique items twice (Avatar items)', () => {
      const item = SHOP_ITEMS.find(i => i.type === 'AVATAR')!;
      
      // Pre-own the item
      useAppStore.setState({ 
        user: createMockUser({ 
          bizCoins: 1000, 
          inventory: [item.id] 
        }) 
      });
      
      const { buyItem } = useAppStore.getState();
      buyItem(item); // Try buying again
      
      const updatedUser = useAppStore.getState().user;
      // Coins should NOT decrease
      expect(updatedUser?.bizCoins).toBe(1000);
      // Inventory should still have it (length check or unique check)
      expect(updatedUser?.inventory.filter(id => id === item.id).length).toBe(1);
    });
  });
});
