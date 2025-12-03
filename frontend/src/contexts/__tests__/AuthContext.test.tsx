import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth, User } from '../AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('should provide auth context with initial values', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.isAuthenticated()).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should login successfully', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
    };

    const mockToken = 'mock-token';

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login(mockToken, mockUser);
    });

    expect(result.current.isAuthenticated()).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAdmin()).toBe(true);
    expect(result.current.isViewer()).toBe(false);
  });

  it('should handle viewer role', () => {
    const mockUser: User = {
      id: '2',
      email: 'viewer@example.com',
      name: 'Viewer User',
      role: 'viewer',
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login('token', mockUser);
    });

    expect(result.current.isAdmin()).toBe(false);
    expect(result.current.isViewer()).toBe(true);
  });

  it('should logout successfully', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login('mock-token', mockUser);
    });

    expect(result.current.isAuthenticated()).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated()).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
