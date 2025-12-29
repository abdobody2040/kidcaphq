
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});



// Mock ResizeObserver (needed for some UI components/Framer Motion)
(globalThis as any).ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock AudioContext (needed for SoundService)
(globalThis as any).AudioContext = class AudioContext {
  state = 'suspended';
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => { } }, connect: () => { }, start: () => { }, stop: () => { } }; }
  createGain() { return { gain: { setValueAtTime: () => { }, exponentialRampToValueAtTime: () => { } }, connect: () => { } }; }
  resume() { return Promise.resolve(); }
  get destination() { return {}; }
  get currentTime() { return 0; }
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    p: ({ children, ...props }: any) => React.createElement('p', props, children),
    img: ({ children, ...props }: any) => React.createElement('img', props, children),
  },
  AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, {}, children),
  useAnimation: () => ({ start: vi.fn() }),
}));
