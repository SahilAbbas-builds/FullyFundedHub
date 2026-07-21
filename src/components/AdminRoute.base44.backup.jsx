import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Shield } from 'lucide-react';

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState('checking'); // checking | ok | denied
  const location = useLocation();

  useEffect(() => {
    let active = true;
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) {
        if (active) setStatus('denied');
        return;
      }
      try {
        const user = await base44.auth.me();
        if (active) setStatus(user?.role === 'admin' ? 'ok' : 'denied');
      } catch {
        if (active) setStatus('denied');
      }
    });
    return () => { active = false; };
  }, [location.pathname]);

  if (status === 'checking') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Verifying access…</p>
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/" replace />;
  }

  return children;
}