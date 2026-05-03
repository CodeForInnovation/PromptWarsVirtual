import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import Roadmap from '../Roadmap';

const mockDeadlines = {
  registration: '2024-10-21',
  primary: '2024-03-05',
  general: '2024-11-05'
};

describe('Roadmap Component', () => {
  it('renders correctly for a given region', () => {
    render(<Roadmap deadlines={mockDeadlines} region="CA" regionLabel="California" />);
    
    expect(screen.getByText('Election Timeline')).toBeDefined();
    expect(screen.getByText('California')).toBeDefined();
    expect(screen.getByText('Voter Registration')).toBeDefined();
    expect(screen.getByText('Primary Election')).toBeDefined();
    expect(screen.getByText('General Election')).toBeDefined();
  });

  it('shows "Passed" for past dates', () => {
    // Mock today to be after the general election
    vi.setSystemTime(new Date('2024-12-01'));
    
    render(<Roadmap deadlines={mockDeadlines} region="CA" regionLabel="California" />);
    
    const badges = screen.getAllByText('Passed');
    expect(badges.length).toBeGreaterThan(0);
    
    vi.useRealTimers();
  });

  it('shows "Soon" for dates within 30 days', () => {
    // Mock today to be 10 days before registration
    vi.setSystemTime(new Date('2024-10-11'));
    
    render(<Roadmap deadlines={mockDeadlines} region="CA" regionLabel="California" />);
    
    expect(screen.getAllByText('⚡ Soon').length).toBeGreaterThan(0);
    
    vi.useRealTimers();
  });
});
