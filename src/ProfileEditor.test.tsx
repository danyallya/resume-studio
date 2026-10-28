import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';
afterEach(cleanup);
describe('Forma profile/contact editing', () => {
  it('updates a bilingual preview without losing experience or saving personal data', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'نام نمونه' } });
    expect(screen.getByRole('heading', { name: 'نام نمونه' })).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toHaveAttribute('dir', 'auto');
    expect(screen.getByLabelText('Email')).toHaveAttribute('dir', 'ltr');
    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
  });
  it('associates specific errors, updates completeness and focuses the first invalid field', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid' } });
    fireEvent.change(screen.getByLabelText('Portfolio URL'), { target: { value: 'javascript:alert(1)' } });
    fireEvent.click(screen.getByRole('button', { name: 'Review profile fields' }));
    expect(screen.getByLabelText('Full name')).toHaveFocus();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a valid email address.')).toHaveAttribute('id', 'profile-email-error');
    expect(screen.getByRole('status')).toHaveTextContent('3 profile fields');
    expect(screen.getByText('3 of 5 sections complete')).toBeInTheDocument();
  });
});
