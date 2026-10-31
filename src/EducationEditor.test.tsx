import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

describe('Forma education and certification editors', () => {
  it('keeps education changes in the preview and focuses a reversed year range', () => {
    render(<App />);
    const editor = within(screen.getByRole('region', { name: 'Education and certifications' }));
    const credential = editor.getByLabelText('Credential or field of study');
    fireEvent.change(credential, { target: { value: 'MDes, Service Design' } });
    expect(screen.getAllByText('MDes, Service Design', { exact: true })).toHaveLength(2);

    const startYear = editor.getByLabelText('Start year');
    const endYear = editor.getByLabelText('End year');
    fireEvent.change(startYear, { target: { value: '2020' } });
    fireEvent.change(endYear, { target: { value: '2018' } });
    fireEvent.click(editor.getByRole('button', { name: 'Review education and certifications' }));

    expect(endYear).toHaveFocus();
    expect(endYear).toHaveAttribute('aria-invalid', 'true');
    expect(endYear.getAttribute('aria-describedby')).toContain('education-0-year-error');
    expect(editor.getByText('Enter valid education years in chronological order.')).toBeInTheDocument();
    expect(editor.getByRole('status')).toHaveTextContent('1 education or certification details need attention.');
  });

  it('adds a certification without changing education and updates the preview', () => {
    render(<App />);
    const editor = within(screen.getByRole('region', { name: 'Education and certifications' }));
    const originalEducation = editor.getByLabelText('Credential or field of study');
    fireEvent.click(editor.getByRole('button', { name: 'Add certification' }));
    const certifications = editor.getAllByLabelText('Certification name');
    fireEvent.change(certifications[1], { target: { value: 'User Research Essentials' } });
    fireEvent.change(editor.getAllByLabelText('Issuing organization')[1], { target: { value: 'Open Learning Institute' } });
    fireEvent.change(editor.getAllByLabelText('Year earned (optional)')[1], { target: { value: '2024' } });
    fireEvent.change(editor.getAllByLabelText('Verification link (optional)')[1], { target: { value: 'https://example.com/credentials/user-research' } });

    expect(originalEducation).toHaveValue('BFA, Communication Design');
    expect(screen.getAllByText('User Research Essentials', { exact: true })).toHaveLength(2);
    const credentialLinks = screen.getAllByRole('link', { name: /View credential/ });
    expect(credentialLinks).toHaveLength(2);
    expect(credentialLinks[1]).toHaveAttribute('href', 'https://example.com/credentials/user-research');
    expect(screen.getByText('2024', { exact: true })).toBeInTheDocument();
  });

  it('rejects unsafe credential links and links the error to the field', () => {
    render(<App />);
    const editor = within(screen.getByRole('region', { name: 'Education and certifications' }));
    const url = editor.getByLabelText('Verification link (optional)');
    fireEvent.change(url, { target: { value: 'javascript:alert(1)' } });
    fireEvent.click(editor.getByRole('button', { name: 'Review education and certifications' }));

    expect(url).toHaveFocus();
    expect(url).toHaveAttribute('aria-invalid', 'true');
    expect(url.getAttribute('aria-describedby')).toContain('certification-0-url-error');
    expect(editor.getByText('Use a complete http or https credential URL without embedded credentials.')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /View credential/ })).not.toBeInTheDocument();
  });

  it('supports synthetic Persian education text and keeps credential URLs left-to-right', () => {
    render(<App />);
    const editor = within(screen.getByRole('region', { name: 'Education and certifications' }));
    const credential = editor.getByLabelText('Credential or field of study');
    const persianCredential = 'کارشناسی ارشد طراحی خدمات';
    fireEvent.change(credential, { target: { value: persianCredential } });
    expect(credential).toHaveAttribute('dir', 'auto');
    expect(screen.getAllByText(persianCredential, { exact: true })).toHaveLength(2);
    expect(editor.getByLabelText('Verification link (optional)')).toHaveAttribute('dir', 'ltr');

    const skillEditor = within(screen.getByRole('region', { name: 'Skills' }));
    const skill = skillEditor.getByLabelText('Skill 1');
    fireEvent.change(skill, { target: { value: 'طراحی سامانه' } });
    expect(skill).toHaveAttribute('dir', 'auto');
    expect(screen.getByText('طراحی سامانه', { exact: true })).toBeInTheDocument();
  });
});
