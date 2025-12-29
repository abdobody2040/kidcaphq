
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { useAppStore } from '../store';
import { useEnergy } from '../hooks/useEnergy';
import UniversalBusinessGame from '../components/UniversalBusinessGame';
import { User, UserRole } from '../types';

// Mock Game Data
const MOCK_GAME = {
  business_id: 'test_game',
  name: 'Test Game',
  category: 'Retail',
  game_type: 'simulation_tycoon',
  description: 'Test Description',
  visual_config: { theme: 'light', colors: { primary: '#000', secondary: '#000', accent: '#000', background: '#fff' }, icon: '🎮' },
  upgrade_tree: [],
  variables: { player_inputs: ['price'] },
  event_triggers: { positive: { event_name: 'Good', effect: '', duration: '' }, negative: { event_name: 'Bad', effect: '', duration: '' } }
};

// Helper to reset store
const resetStore = () => {
  useAppStore.setState({
    user: null,
    users: [],
    games: [MOCK_GAME as any],
  });
};

const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test_user',
  name: 'Test User',
  username: 'test',
  password: '123',
  role: UserRole.KID,
  xp: 0,
  level: 1,
  bizCoins: 0,
  streak: 0,
  inventory: [],
  completedLessonIds: [],
  badges: [],
  lastActivityDate: '',
  currentModuleId: 'mod_1',
  settings: { dailyGoalMinutes: 15, soundEnabled: false, musicEnabled: false, themeColor: 'green', themeMode: 'light' },
  hqLevel: 'hq_garage',
  unlockedSkills: [],
  portfolio: [],
  equippedItems: [],
  subscriptionStatus: 'FREE',
  subscriptionTier: 'intern',
  energy: 5,
  lastEnergyRefill: Date.now(),
  ...overrides
});

describe('Subscription & Energy System', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
    localStorage.clear();
    resetStore();
  });





  afterEach(() => {
    vi.useRealTimers();
  });

  // Test 1: The Poverty Trap (Intern Logic)
  it('The Poverty Trap: Intern loses energy correctly and gets blocked at 0', () => {
    const user = createMockUser({ subscriptionTier: 'intern', energy: 1 });
    useAppStore.setState({ user, users: [user] });

    const { result } = renderHook(() => useEnergy());

    // Call consumeEnergy(). Expect result true and Energy to become 0.
    let success;
    act(() => {
      success = result.current.consumeEnergy();
    });

    expect(success).toBe(true);
    expect(useAppStore.getState().user?.energy).toBe(0);

    // Call consumeEnergy() again. Expect result false (Action Blocked).
    act(() => {
      success = result.current.consumeEnergy();
    });

    expect(success).toBe(false);
    expect(useAppStore.getState().user?.energy).toBe(0);
  });

  // Test 2: The Rich Kid (Founder Logic)
  it('The Rich Kid: Founder has unlimited energy', () => {
    // Set user to 'Founder'.
    const user = createMockUser({ subscriptionTier: 'founder', energy: 5 });
    useAppStore.setState({ user, users: [user] });

    const { result } = renderHook(() => useEnergy());

    // Call consumeEnergy(). Expect result true.
    let success;
    act(() => {
      success = result.current.consumeEnergy();
    });

    expect(success).toBe(true);
    // Energy to remain constant (Infinite).
    expect(useAppStore.getState().user?.energy).toBe(5);
  });

  // Test 3: The Paywall Trigger
  it('The Paywall Trigger: Triggers InvestorPitchModal when energy is 0', async () => {
    // Set user to 'Intern' with 0 Energy.
    const user = createMockUser({ subscriptionTier: 'intern', energy: 0 });
    useAppStore.setState({ user, users: [user] });

    // Render the UniversalBusinessGame component.
    render(React.createElement(UniversalBusinessGame, { gameId: "test_game", onExit: () => { } }));

    // Verify that clicking 'Start' triggers the InvestorPitchModal to appear.
    // In UniversalBusinessGame, the button contains "Start Day".
    const startButton = screen.getByText(/Start Day/i);
    fireEvent.click(startButton);

    // Expect the modal to appear with actual text from locales/en.ts
    // The modal title is "Choose Your Path to Success"
    const modalText = await screen.findByText(/Choose Your Path to Success/i);
    expect(modalText).toBeInTheDocument();

    // Check for the "Intern" column which indicates the plan comparison view
    expect(screen.getByText(/Intern/i)).toBeInTheDocument();
  });

  // Test 4: The Upgrade Flow
  it('The Upgrade Flow: Upgrading to Tycoon unlocks features', () => {
    // Set user to 'Intern'.
    const user = createMockUser({ subscriptionTier: 'intern' });
    useAppStore.setState({ user, users: [user] });

    // Call upgradeSubscription('tycoon').
    act(() => {
      useAppStore.getState().upgradeSubscription('tycoon');
    });

    // Verify hasAiAccess becomes true and hasUnlimitedEnergy becomes true.
    const state = useAppStore.getState();
    expect(state.user?.subscriptionTier).toBe('tycoon');
    expect(state.hasAiAccess()).toBe(true);
    expect(state.hasUnlimitedEnergy()).toBe(true);
  });
});
