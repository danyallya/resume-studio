import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

describe('Forma skills editor', () => {
  it('reports normalized duplicates, keeps edits synchronized and manages added skills', () => {
    render(<App />);
    const editor = within(screen.getByRole('region', { name: 'Skills' }));
    const skills = [
      editor.getByLabelText('Skill 1'),
      editor.getByLabelText('Skill 2'),
      editor.getByLabelText('Skill 3'),
    ];
    fireEvent.change(skills[1], { target: { value: '  PRODUCT STRATEGY ' } });
    fireEvent.click(editor.getByRole('button', { name: 'Review skills' }));

    expect(skills[0]).toHaveFocus();
    expect(skills[0]).toHaveAttribute('aria-invalid', 'true');
    expect(editor.getByText('Remove duplicate skills.')).toBeInTheDocument();
    expect(editor.getByRole('status')).toHaveTextContent('1 skill details need attention.');

    fireEvent.change(skills[1], { target: { value: 'UX writing' } });
    expect(editor.queryByText('Remove duplicate skills.')).not.toBeInTheDocument();
    expect(screen.getByText('UX writing', { exact: true })).toBeInTheDocument();

    fireEvent.click(editor.getByRole('button', { name: 'Add skill' }));
    const addedSkill = editor.getByLabelText('Skill 4');
    expect(addedSkill).toHaveFocus();
    fireEvent.change(addedSkill, { target: { value: 'Accessibility' } });
    expect(screen.getByText('Accessibility', { exact: true })).toBeInTheDocument();

    fireEvent.click(editor.getByRole('button', { name: 'Remove skill 4' }));
    expect(editor.queryByLabelText('Skill 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Accessibility', { exact: true })).not.toBeInTheDocument();
  });
});
