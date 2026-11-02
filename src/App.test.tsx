import { afterEach, describe, expect, it } from 'vitest';
import { cleanup } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { sampleProfile } from './data/sampleProfile';
afterEach(cleanup);
describe('Forma Resume Studio', () => {
  it('renders the resume builder workspace', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Make your next move/i })).toBeInTheDocument();
    expect(screen.getByText('4 of 5 sections complete')).toBeInTheDocument();
    expect(screen.getByText(/Live sync · 4\/5 sections ready/)).toBeInTheDocument();
    expect(screen.getByText('Next: Add at least one portfolio project.')).toBeInTheDocument();
    expect(screen.getByText(/alex\.morgan@example\.com/)).toBeInTheDocument();
    expect(screen.getAllByText(/SAMPLE PROFILE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Session only')).toHaveLength(2);
    expect(screen.queryByText('Saved just now')).not.toBeInTheDocument();
  });

  it('focuses a section target from completion guidance', () => {
    render(<App />);
    const selectedWorkRow = screen.getByRole('button', { name: /Selected work.*Next: Add at least one portfolio project/i });
    selectedWorkRow.click();
    expect(document.activeElement).toBe(screen.getByText('SELECTED WORK'));
  });

  it('renders validated selected work in the preview and only links safe URLs', () => {
    const previous = sampleProfile.selectedWork;
    sampleProfile.selectedWork = [
      { id: 'work-1', title: 'Transit redesign', description: 'A fictional rider planning concept.', url: 'https://example.com/transit' },
      { id: 'work-2', title: 'Research notes', description: 'A fictional research summary.', url: 'javascript:alert(1)' },
    ];
    try {
      render(<App />);
      expect(screen.getByText('Transit redesign')).toBeInTheDocument();
      expect(screen.getByText('A fictional rider planning concept.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View project Transit redesign (opens in a new tab)' })).toHaveAttribute('href', 'https://example.com/transit');
      expect(screen.getByText('Research notes')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'View project Research notes (opens in a new tab)' })).not.toBeInTheDocument();
    } finally {
      sampleProfile.selectedWork = previous;
    }
  });
});
