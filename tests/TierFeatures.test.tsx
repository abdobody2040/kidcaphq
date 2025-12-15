
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { useAppStore } from '../store';
import { useEnergy } from '../hooks/useEnergy';
import { User, UserRole } from '../types';
import OllieChat from '../components/OllieChat';
import Layout from '../components/Layout';
import Headquarters from '../components/Headquarters';
import GameMenu from '../components/GameMenu';
import EnergyBar from '../components/EnergyBar';

// Mock SoundService
vi.mock('../services/SoundService', () => ({
  SoundService: {
    playClick: vi.fn(),
    playLevelUp: vi.fn(),
    playError: vi.fn(),
    playSuccess: vi.fn(),
    playCoin: vi.fn(),
  },
}));

// Mock Gemini Service
vi.mock('../services/geminiService', () => ({
  chatWithOllie: vi.fn().mockResolvedValue("Hoot hoot! I am a mock owl."),
}));

// Mock Alert
vi.spyOn(window, 'alert').mockImplementation(() => {});

const createMockUser = (tier: any, energy = 5): User => ({
  id: 'test_user',
  name: 'Test Kid',
  username: 'test',
  password: '123',
  role: UserRole.KID,
  xp: 0,
  level: 1,
  streak: 1,
  lastActivityDate: '2023-01-01',
  bizCoins: 100,
  currentModuleId: 'mod_1',
  completedLessonIds: [],
  readBookIds: [],
  badges: [],
  inventory: [],
  settings: { dailyGoalMinutes: 15, soundEnabled: false, musicEnabled: false, themeColor: 'green', themeMode: 'light' },
  hqLevel: 'hq_garage',
  unlockedSkills: [],
  portfolio: [],
  equippedItems: [],
  subscriptionStatus: tier === 'intern' ? 'FREE' : 'PREMIUM',
  subscriptionTier: tier,
  energy: energy,
  lastEnergyRefill: Date.now()
});

describe('Tier Feature Validation', () => {
  beforeEach(() => {
    useAppStore.setState({ user: null, users: [], games: [] });
    localStorage.clear();
    vi.clearAllMocks();
  });

  // 1. Intern (Free)
  describe('Intern Tier (Free)', () => {
    it('consumes energy correctly', () => {
      const user = createMockUser('intern', 5);
      useAppStore.setState({ user, users: [user] });
      
      const { result } = renderHook(() => useEnergy());
      
      act(() => {
        result.current.consumeEnergy();
      });
      
      expect(useAppStore.getState().user?.energy).toBe(4);
    });

    it('blocks AI chat after free limit', () => {
      const user = createMockUser('intern');
      useAppStore.setState({ user, users: [user] });
      localStorage.setItem('ollie_free_sample_used', 'true');
      
      render(<OllieChat />);
      
      // Floating button click to open
      const toggleButtons = screen.getAllByRole('button');
      // The floating button is usually the last one or the one with the owl image
      const toggleBtn = toggleButtons[toggleButtons.length - 1]; 
      fireEvent.click(toggleBtn);
      
      // Expect "Hire Ollie" button
      expect(screen.getByText(/Hire Ollie/i)).toBeInTheDocument();
    });

    it('denies access to Parent Dashboard via Layout link', () => {
        const user = createMockUser('intern');
        useAppStore.setState({ user, users: [user] });
        
        const onNavigate = vi.fn();
        render(
            <Layout activeTab="map" onNavigate={onNavigate}>
                <div>Child Content</div>
            </Layout>
        );
        
        // Find "For Parents" button in sidebar
        const parentBtn = screen.getByText(/For Parents/i);
        fireEvent.click(parentBtn);
        
        // Should show Paywall (InvestorPitchModal)
        expect(screen.getByText(/Choose Your Path to Success/i)).toBeInTheDocument();
        expect(onNavigate).not.toHaveBeenCalledWith('parent_dashboard');
    });
  });

  // 2. Founder ($9.99)
  describe('Founder Tier ($9.99)', () => {
    it('has infinite energy', () => {
        const user = createMockUser('founder', 5);
        useAppStore.setState({ user, users: [user] });
        
        const { result } = renderHook(() => useEnergy());
        
        act(() => {
          result.current.consumeEnergy();
        });
        
        expect(useAppStore.getState().user?.energy).toBe(5);
    });

    it('displays infinity symbol in EnergyBar', () => {
        const user = createMockUser('founder');
        useAppStore.setState({ user, users: [user] });
        
        render(<EnergyBar />);
        // In unlimited mode, EnergyBar renders a badge with "Energy" text instead of countdown
        expect(screen.getByText('Energy')).toBeInTheDocument(); 
    });

    it('grants access to Custom HQ features', () => {
        const user = createMockUser('founder');
        useAppStore.setState({ user, users: [user] });
        
        render(<Headquarters />);
        
        // The customize button title changes based on access
        // "Change Theme" vs "Locked (Founder Only)"
        const customizeBtn = screen.getByTitle("Change Theme");
        expect(customizeBtn).toBeInTheDocument();
    });
  });

  // 3. Board Member ($119)
  describe('Board Member Tier ($119)', () => {
      it('allows access to Parent Dashboard', () => {
          const user = createMockUser('board');
          useAppStore.setState({ user, users: [user] });
          
          const onNavigate = vi.fn();
          render(
            <Layout activeTab="map" onNavigate={onNavigate}>
                <div>Child Content</div>
            </Layout>
          );
          
          const parentBtn = screen.getByText(/For Parents/i);
          fireEvent.click(parentBtn);
          
          // Should navigate
          expect(onNavigate).toHaveBeenCalledWith('parent_dashboard');
          // Should NOT show paywall
          expect(screen.queryByText(/Choose Your Path to Success/i)).not.toBeInTheDocument();
      });

      it('inherits infinite energy', () => {
        const user = createMockUser('board', 5);
        useAppStore.setState({ user, users: [user] });
        
        const { result } = renderHook(() => useEnergy());
        expect(result.current.isUnlimited).toBe(true);
      });
  });

  // 4. Tycoon ($169)
  describe('Tycoon Tier ($169)', () => {
      it('allows unlimited AI chat', async () => {
          const user = createMockUser('tycoon');
          useAppStore.setState({ user, users: [user] });
          // Even if "used" flag is set from previous tier
          localStorage.setItem('ollie_free_sample_used', 'true');
          
          render(<OllieChat />);
          const toggleButtons = screen.getAllByRole('button');
          const toggleBtn = toggleButtons[toggleButtons.length - 1];
          fireEvent.click(toggleBtn);
          
          // Should see input, check for placeholder text for Tycoons
          const input = screen.getByPlaceholderText(/Ask your executive consultant/i);
          expect(input).toBeInTheDocument();
      });

      it('unlocks Negotiation Battle game', () => {
          const user = createMockUser('tycoon');
          // Add negotiation game to store
          const negGame = {
              business_id: 'BIZ_NEGOTIATION',
              name: 'Negotiation Battle',
              category: 'Tycoon Exclusive',
              game_type: 'negotiation_game',
              visual_config: { colors: { primary: '#000', background: '#fff' }, icon: '🤝' },
              description: 'Test'
          };
          useAppStore.setState({ user, users: [user], games: [negGame as any] });
          
          const onSelect = vi.fn();
          render(<GameMenu onSelectGame={onSelect} />);
          
          // Filter to 'Tycoon Exclusive' category or just find the game card
          // Since it's a grid, we can find by text
          const gameTitle = screen.getByText(/Negotiation Battle/i);
          
          // Click the card (parent button)
          const gameCard = gameTitle.closest('button');
          fireEvent.click(gameCard!);
          
          expect(onSelect).toHaveBeenCalledWith('BIZ_NEGOTIATION');
      });
  });
});
