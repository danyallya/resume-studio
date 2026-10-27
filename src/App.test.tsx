import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
describe('Forma Resume Studio', () => {
  it('renders the resume builder workspace', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Make your next move/i })).toBeInTheDocument();
    expect(screen.getByText('4 of 5 sections complete')).toBeInTheDocument();
    expect(screen.getByText(/alex\.morgan@example\.com/)).toBeInTheDocument();
    expect(screen.getAllByText(/SAMPLE PROFILE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Session only')).toHaveLength(2);
    expect(screen.queryByText('Saved just now')).not.toBeInTheDocument();
  });
});
