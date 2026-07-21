import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

let cachedUser = null;
let listeners = [];

function notify() {
  listeners.forEach((fn) => fn(cachedUser));
}

export function useCurrentUser() {
  const [user, setUser] = useState(cachedUser);
  const [loading, setLoading] = useState(cachedUser === null);

  useEffect(() => {
    const listener = (u) => setUser(u);
    listeners.push(listener);

    if (cachedUser === null && !loading) {
      setLoading(true);
    }

    if (cachedUser === null) {
      base44.auth.isAuthenticated().then(async (authed) => {
        if (authed) {
          try {
            cachedUser = await base44.auth.me();
          } catch {
            cachedUser = false;
          }
        } else {
          cachedUser = false;
        }
        setLoading(false);
        notify();
      });
    }

    return () => {
      listeners = listeners.filter((fn) => fn !== listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(async () => {
    cachedUser = null;
    setLoading(true);
    const authed = await base44.auth.isAuthenticated();
    if (authed) {
      try {
        cachedUser = await base44.auth.me();
      } catch {
        cachedUser = false;
      }
    } else {
      cachedUser = false;
    }
    setLoading(false);
    notify();
  }, []);

  return { user: user === false ? null : user, loading, refresh };
}

export function clearCachedUser() {
  cachedUser = null;
  notify();
}