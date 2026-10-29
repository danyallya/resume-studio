import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

afterEach(cleanup);

describe('Forma experience editor', () => {
  it('keeps role and achievement edits in sync with the resume preview', () => {
    render(<App />);
    const roleTitle = screen.getAllByLabelText('Role title')[0];
    fireEvent.change(roleTitle, { target: { value: 'Lead Product Designer' } });
    expect(screen.getAllByText('Lead Product Designer', { exact: true })).toHaveLength(2);
    expect(screen.getByText('Which result can you support accurately?')).toBeInTheDocument();

    fireEvent.change(roleTitle, { target: { value: 'طراح ارشد محصول' } });
    expect(roleTitle).toHaveAttribute('dir', 'auto');
    expect(screen.getAllByText('طراح ارشد محصول', { exact: true })).toHaveLength(2);

    fireEvent.change(screen.getAllByLabelText('Achievement 1')[0], { target: { value: 'Made service setup easier for new customers.' } });
    expect(screen.getAllByText('Made service setup easier for new customers.')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'Remove achievement 1 from طراح ارشد محصول' }));
    expect(screen.getByText('Add at least one achievement.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Review experience fields' }));
    const addAchievement = screen.getByRole('button', { name: 'Add achievement to طراح ارشد محصول' });
    expect(addAchievement).toHaveFocus();
    expect(addAchievement.getAttribute('aria-describedby')).toContain('experience-0-achievement-error');
  });

  it('validates date order, links the field error and focuses the first invalid year', () => {
    render(<App />);
    const currentRole = screen.getByRole('checkbox', { name: 'Currently working here — Product Designer' });
    const endYear = screen.getAllByLabelText('End year')[0];
    expect(endYear).toBeDisabled();

    fireEvent.click(currentRole);
    expect(endYear).toBeEnabled();
    fireEvent.change(endYear, { target: { value: '2018' } });
    fireEvent.click(screen.getByRole('button', { name: 'Review experience fields' }));

    expect(endYear).toHaveFocus();
    expect(endYear).toHaveAttribute('aria-invalid', 'true');
    expect(endYear.getAttribute('aria-describedby')).toContain('experience-0-end-error');
    expect(screen.getByText('Enter an end year no earlier than the start year.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('1 experience field needs attention.');
  });

  it('adds a role and achievement without replacing existing experience', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Add experience' }));
    expect(screen.getAllByLabelText('Role title')).toHaveLength(3);

    fireEvent.change(screen.getAllByLabelText('Role title')[2], { target: { value: 'Design Lead' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add achievement to Design Lead' }));
    fireEvent.change(screen.getByLabelText('Achievement 2'), { target: { value: 'Built a reusable service design practice.' } });

    expect(screen.getAllByText('Built a reusable service design practice.')).toHaveLength(2);
    expect(screen.getAllByText('Product Designer', { exact: true })).toHaveLength(2);
    expect(screen.getAllByText('Associate Designer', { exact: true })).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'Remove Design Lead' }));
    expect(screen.queryByText('Design Lead', { exact: true })).not.toBeInTheDocument();
    expect(screen.getAllByLabelText('Role title')).toHaveLength(2);
  });
});
