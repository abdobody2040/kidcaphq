
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAppStore } from '../store';
import BookLibrary from '../components/BookLibrary';
import KidMap from '../components/KidMap';
import GameMenu from '../components/GameMenu';
import { User, UserRole, Book, UniversalLessonUnit, BusinessSimulation } from '../types';

// Mock dependencies
vi.mock('../services/geminiService', () => ({
  generateBookDetails: vi.fn(),
  chatWithOllie: vi.fn(),
  getOwlyExplanation: vi.fn(),
}));

// Mock translations to return raw keys or specific values for testing
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue || key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

const createMockUser = (tier: any = 'founder'): User => ({
  id: 'test_user',
  name: 'Test Kid',
  username: 'test',
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

describe('Content Additions Pipeline', () => {
  beforeEach(() => {
    useAppStore.setState({ user: null, library: [], lessons: [], games: [] });
  });

  // 1. New Book Addition
  it('New Book: Renders correctly and respects lock status', () => {
    const newBook: Book = {
      id: 'test-book-999',
      title: 'The Crypto Kid',
      author: 'Satoshi',
      coverUrl: 'http://test/img.png',
      summary: 'Blockchain for babies',
      category: 'Finance',
      keyLessons: [],
      ageRating: '8+'
    };

    // Scenario A: Founder (Unlocked)
    useAppStore.setState({
      user: createMockUser('founder'),
      library: [newBook]
    });

    const { unmount } = render(<BookLibrary />);
    
    // Check Title
    expect(screen.getByText('The Crypto Kid')).toBeInTheDocument();
    // Check Author
    expect(screen.getByText('Satoshi')).toBeInTheDocument();
    // Check Image (SmartImage renders img tag with alt)
    const img = screen.getByAltText('The Crypto Kid');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://test/img.png');
    
    // Check Lock Status (Founder should see "Read Summary", not "Unlock")
    expect(screen.queryByText('Premium Only')).not.toBeInTheDocument();
    expect(screen.getByText('Read Summary')).toBeInTheDocument();
    
    unmount();

    // Scenario B: Intern + Index > 3 (Locked)
    // We need to pad the library to push our new book to index 4
    const paddingBooks = Array(4).fill(null).map((_, i) => ({ ...newBook, id: `pad-${i}`, title: `Pad ${i}` }));
    
    useAppStore.setState({
      user: createMockUser('intern'),
      library: [...paddingBooks, newBook]
    });

    render(<BookLibrary />);
    
    // The Crypto Kid is now at index 4 (>= 3)
    // We verify the lock mechanism triggers.
    // In BookLibrary, locked items have an overlay containing "Premium Only" and a button saying "Unlock".
    // Since we have multiple books, finding specific text can be broad, but finding it AT ALL confirms logic is active.
    expect(screen.getAllByText('Premium Only').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unlock').length).toBeGreaterThan(0);
  });

  // 2. New Lesson/Module
  it('New Lesson: Creates new node on KidMap', () => {
    const newLesson: UniversalLessonUnit = {
      id: 'lesson-crypto-1',
      topic_tag: 'Crypto Basics',
      difficulty: 1,
      lesson_payload: { headline: 'Bitcoin 101', body_text: 'Digital gold.' },
      challenge_payload: { question_text: 'Q?', correct_answer: 'A', distractors: ['B'] },
      game_rewards: { base_xp: 10, currency_value: 5 },
      flavor_text: 'Cool!'
    };

    useAppStore.setState({
      user: createMockUser('founder'),
      lessons: [newLesson],
      assignments: []
    });

    render(<KidMap onStartLesson={() => {}} />);

    // KidMap groups by topic_tag. 
    // It attempts to translate `crypto_basics` (derived from Crypto Basics).
    // Our mock t function returns defaultValue if key is not found, or key. 
    // KidMap logic: t(mod.translationKey, { defaultValue: mod.title })
    // So we expect to see "Crypto Basics" on screen.
    
    expect(screen.getByText('Crypto Basics')).toBeInTheDocument();
    
    // Verify it shows lesson count (0/1 Lessons)
    // We use a regex match to be flexible with UI spacing
    expect(screen.getByText(/0\/1/i)).toBeInTheDocument();
  });

  // 3. New Game Addition
  it('New Game: Renders card and enforces Tycoon lock', () => {
    const newGame: BusinessSimulation = {
      business_id: 'game-stock-market',
      name: 'Stock Hero',
      category: 'Tycoon Exclusive',
      game_type: 'simulation_tycoon',
      description: 'Buy low sell high',
      visual_config: { theme: 'dark', colors: { primary: '#000', background: '#fff', secondary: '#333', accent: '#666' }, icon: '📈' },
      upgrade_tree: [],
      variables: { resources: [], dynamic_factors: [], player_inputs: [] },
      event_triggers: { positive: { event_name: '', effect: '', duration: '' }, negative: { event_name: '', effect: '', duration: '' } }
    };

    // Scenario A: User is Intern (Should be locked as PREMIUM ONLY)
    useAppStore.setState({
      user: createMockUser('intern'),
      games: [newGame]
    });

    const { unmount } = render(<GameMenu onSelectGame={() => {}} />);

    expect(screen.getByText('Stock Hero')).toBeInTheDocument();
    expect(screen.getByText('PREMIUM ONLY')).toBeInTheDocument();
    
    unmount();

    // Scenario B: User is Founder (Should be locked as TYCOON ONLY because category is 'Tycoon Exclusive')
    useAppStore.setState({
      user: createMockUser('founder'), // Founder is NOT Tycoon
      games: [newGame]
    });

    render(<GameMenu onSelectGame={() => {}} />);
    
    expect(screen.getByText('Stock Hero')).toBeInTheDocument();
    expect(screen.getByText('TYCOON ONLY')).toBeInTheDocument();
  });
});
