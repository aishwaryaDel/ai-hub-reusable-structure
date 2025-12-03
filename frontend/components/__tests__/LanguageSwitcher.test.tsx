import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitcher from '../LanguageSwitcher';
import { LanguageProvider } from '../../contexts/LanguageContext';

describe('LanguageSwitcher', () => {
  it('should render language switcher buttons', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('DE')).toBeInTheDocument();
  });

  it('should highlight German as active by default', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const deButton = screen.getByText('DE');
    expect(deButton).toHaveClass('bg-[#E30613]', 'text-white');
  });

  it('should switch to English when EN is clicked', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const enButton = screen.getByText('EN');
    await user.click(enButton);

    expect(enButton).toHaveClass('bg-[#E30613]', 'text-white');
  });

  it('should switch between languages', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const deButton = screen.getByText('DE');
    const enButton = screen.getByText('EN');

    expect(deButton).toHaveClass('bg-[#E30613]');

    await user.click(enButton);
    expect(enButton).toHaveClass('bg-[#E30613]', 'text-white');

    await user.click(deButton);
    expect(deButton).toHaveClass('bg-[#E30613]', 'text-white');
  });

  it('should have proper styling container', () => {
    const { container } = render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const switcherContainer = container.firstChild;
    expect(switcherContainer).toHaveClass('flex', 'items-center', 'gap-2');
  });
});
