import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import GoogleCalendarButton from '../GoogleCalendarButton';

describe('GoogleCalendarButton', () => {
  it('generates the correct calendar URL', () => {
    const title = 'Test Event';
    const date = '2024-11-05';
    const description = 'Testing description';
    
    render(<GoogleCalendarButton title={title} date={date} description={description} />);
    
    const link = screen.getByRole('link');
    const href = link.getAttribute('href');
    
    expect(href).toContain('action=TEMPLATE');
    expect(href).toContain('text=Test%20Event');
    expect(href).toContain('dates=20241105T090000Z/20241105T180000Z');
    expect(href).toContain('details=Testing%20description');
  });

  it('has proper accessibility attributes', () => {
    render(<GoogleCalendarButton title="Vote" date="2024-11-05" />);
    
    const link = screen.getByRole('link');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('aria-label')).toContain('opens in a new tab');
  });
});
