
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAppStore } from '../store';
import { User, UserRole } from '../types';
import BookLibrary from '../components/BookLibrary';
import KidMap from '../components/KidMap';
import Layout from '../components/Layout';
import { INITIAL_LIBRARY } from '../data/libraryBooks';
import { ALL_LESSONS } from '../data/curriculum';

// Mock dependencies
vi.mock('../services/geminiService', () => ({
  chatWithOllie: vi.fn(),
  getOwlyExplanation: vi.fn(),
}));

const createMockUser = (tier: any): User => ({
  id: 'test_user',
  name: 'Test Kid',
  username: 'test',
  password: '123',
  role: UserRole.KID,
  xp: 0,
  level: 1,
  streak: 1,
  lastActivityDate: '2024-01-01',
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
  energy: 5,
  lastEnergyRefill: Date.now()
});

describe('Content Gating & Tiers', () => {
  beforeEach(() => {
    // Reset store
    useAppStore.setState({ 
        user: null, 
        library: INITIAL_LIBRARY, 
        lessons: ALL_LESSONS 
    });
  });

  // --- Test A: The Intern ---
  it('The Intern: Restricted access to content', () => {
    // 1. Setup User
    const intern = createMockUser('intern');
    useAppStore.setState({ user: intern });

    // 2. Render BookLibrary
    const { unmount: unmountLib } = render(<BookLibrary />);
    
    // Expect: "Premium Only" text to be present (indicating locks)
    // The library renders many books. The first 3 should NOT have the overlay. 
    // The 4th book (index 3) MUST have the overlay.
    // We check if "Premium Only" is in the document at all.
    expect(screen.getAllByText('Premium Only').length).toBeGreaterThan(0);
    
    // Check lock icon existence
    // Note: Lucide icons render as SVGs, difficult to query by role efficiently in bulk without setup.
    // But "Premium Only" text is a strong indicator of the overlay being present.
    unmountLib();

    // 3. Render KidMap
    // Needs onStartLesson prop
    const { unmount: unmountMap } = render(<KidMap onStartLesson={() => {}} />);
    
    // Expect: "Premium Only" label on restricted modules
    // Money Basics is unlocked. Investing should be locked.
    expect(screen.getAllByText('Premium Only').length).toBeGreaterThan(0);
    unmountMap();

    // 4. Render Layout
    const { unmount: unmountLayout } = render(
        <Layout activeTab="map" onNavigate={() => {}}>
            <div>Child</div>
        </Layout>
    );
    
    // Expect: Ad banner text
    expect(screen.getByText(/Ads support free learning/i)).toBeInTheDocument();
    unmountLayout();
  });

  // --- Test B: The Founder ---
  it('The Founder: Full access to content', () => {
    // 1. Setup User
    const founder = createMockUser('founder');
    useAppStore.setState({ user: founder });

    // 2. Render BookLibrary
    const { unmount: unmountLib } = render(<BookLibrary />);
    
    // Expect: NO "Premium Only" text
    expect(screen.queryByText('Premium Only')).not.toBeInTheDocument();
    unmountLib();

    // 3. Render KidMap
    const { unmount: unmountMap } = render(<KidMap onStartLesson={() => {}} />);
    
    // Expect: NO "Premium Only" labels
    expect(screen.queryByText('Premium Only')).not.toBeInTheDocument();
    unmountMap();

    // 4. Render Layout
    const { unmount: unmountLayout } = render(
        <Layout activeTab="map" onNavigate={() => {}}>
            <div>Child</div>
        </Layout>
    );
    
    // Expect: Ad banner to be missing
    expect(screen.queryByText(/Ads support free learning/i)).not.toBeInTheDocument();
    unmountLayout();
  });
});
