import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('should provide language context with default language (de)', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.language).toBe('de');
    expect(result.current.t).toBeDefined();
  });

  it('should switch language to English', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
  });

  it('should switch language to German', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('en');
    });

    act(() => {
      result.current.setLanguage('de');
    });

    expect(result.current.language).toBe('de');
  });

  it('should provide correct translations for German', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('landing.title')).toBe('Willkommen im Tesa AI Hub');
    expect(result.current.t('footer.support')).toBe('Support');
  });

  it('should provide correct translations for English', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.t('landing.title')).toBe('Welcome to the Tesa AI Hub');
    expect(result.current.t('footer.support')).toBe('Support');
  });

  it('should return key for missing translation', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useLanguage());
    }).toThrow('useLanguage must be used within a LanguageProvider');
  });
});
