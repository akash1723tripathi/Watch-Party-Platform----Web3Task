import { useState, useEffect } from 'react';

export interface UserIdentity {
  userId: string;
  username: string;
}

const STORAGE_KEY = 'watchparty_guest_user';

export const getCurrentUser = (): UserIdentity => {
  if (typeof window === 'undefined') {
    return { userId: 'server-user', username: '' };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<UserIdentity>;
      if (parsed.userId) {
        return {
          userId: parsed.userId,
          username: typeof parsed.username === 'string' ? parsed.username : '',
        };
      }
    } catch {
      // Re-create identity below if corrupted
    }
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newIdentity: UserIdentity = {
    userId: `user_${Date.now()}_${randomSuffix}`,
    username: '',
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newIdentity));
  return newIdentity;
};

export const setUsername = (name: string): UserIdentity => {
  const current = getCurrentUser();
  const trimmed = name.trim();
  const updated: UserIdentity = {
    userId: current.userId,
    username: trimmed,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent<UserIdentity>('watchparty_user_updated', { detail: updated }));
  return updated;
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserIdentity>(() => getCurrentUser());

  useEffect(() => {
    const handleUserUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserIdentity>;
      if (customEvent.detail) {
        setUser(customEvent.detail);
      } else {
        setUser(getCurrentUser());
      }
    };

    window.addEventListener('watchparty_user_updated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    return () => {
      window.removeEventListener('watchparty_user_updated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  return {
    user,
    setUsername: (name: string) => {
      const updated = setUsername(name);
      setUser(updated);
      return updated;
    },
    hasUsername: Boolean(user.username && user.username.trim().length >= 2),
  };
};
