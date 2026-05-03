import { h } from 'preact';
import { render, fireEvent, screen } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import PledgeToVote from '../PledgeToVote';

describe('PledgeToVote Component', () => {
  it('should render the pledge form initially', () => {
    render(<PledgeToVote />);

    expect(screen.getByText('Take the Pledge to Vote')).toBeDefined();
    expect(screen.getByPlaceholderText('First Name')).toBeDefined();
    expect(screen.getByPlaceholderText('Email Address')).toBeDefined();
    expect(screen.getByText('I Pledge to Vote')).toBeDefined();
  });

  it('should show success message after form submission', async () => {
    render(<PledgeToVote />);

    const nameInput = screen.getByPlaceholderText('First Name');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const submitButton = screen.getByText('I Pledge to Vote');

    // Simulate user input
    fireEvent.input(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.input(emailInput, { target: { value: 'jane@example.com' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Assert success state
    expect(await screen.findByText('Thank you for pledging!')).toBeDefined();
    expect(screen.queryByText('Take the Pledge to Vote')).toBeNull(); // Form should be gone
  });
});
