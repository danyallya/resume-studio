import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
describe('Forma Resume Studio', () => {
  it('renders the resume builder workspace', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Make your next move/i })).toBeInTheDocument();
  });
});
