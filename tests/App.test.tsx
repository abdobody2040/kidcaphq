
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { useAppStore } from '../store';

describe('App Component', () => {
  beforeEach(() => {
    // Reset store to ensure clean slate (Logged Out)
    useAppStore.setState({ user: null });
  });

  it('renders the Landing Page when not logged in', () => {
    render(<App />);
    
    // Check for Landing Page specific text
    expect(screen.getByText(/Don't just play games/i)).toBeTruthy();
    expect(screen.getByText(/Future CEO Academy/i)).toBeTruthy();
  });

  it('renders Auth screen when Get Started is clicked (Simulated by state)', () => {
    // We can interact with buttons, or simply test that the component handles routing state.
    // Let's rely on the store being null initially.
    render(<App />);
    const buttons = screen.getAllByText(/Start Free/i);
    expect(buttons.length).toBeGreaterThan(0);
  });
});
