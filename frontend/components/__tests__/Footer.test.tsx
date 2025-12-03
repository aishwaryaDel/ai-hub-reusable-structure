import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { LanguageProvider } from '../../contexts/LanguageContext';

describe('Footer', () => {
  it('should render footer with German content (default)', () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    expect(screen.getByText('Über dieses Portal')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Use Case Beitrag')).toBeInTheDocument();
    expect(screen.getByText('Nur für den internen Gebrauch – Eigentum der tesa SE')).toBeInTheDocument();
  });

  it('should render footer with proper structure', () => {
    const { container } = render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-[#f5f5f5]');
  });

  it('should render email link', () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const emailLink = screen.getByRole('link', { name: /Kontakt KI-Transformationsteam/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:ai-transformation@tesa.com');
  });

  it('should have three main sections', () => {
    const { container } = render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const sections = container.querySelectorAll('.grid > div');
    expect(sections).toHaveLength(3);
  });
});
