import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigate } from 'react-router-dom';

export default function SaveButton({ opportunityId, className = '' }) {
  const { user, loading } = useCurrentUser();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }
    base44.entities.SavedOpportunity.filter({ opportunity_id: opportunityId })
      .then((results) => {
        if (results.length > 0) {
          setSaved(true);
          setSavedId(results[0].id);
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [user, opportunityId]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (saved && savedId) {
      await base44.entities.SavedOpportunity.delete(savedId);
      setSaved(false);
      setSavedId(null);
    } else {
      const record = await base44.entities.SavedOpportunity.create({ opportunity_id: opportunityId });
      setSaved(true);
      setSavedId(record.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={checking || loading}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 ${
        saved
          ? 'bg-primary/20 border-primary/40 text-primary'
          : 'bg-background/40 border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30'
      } ${className}`}
      aria-label={saved ? 'Remove from saved' : 'Save opportunity'}
    >
      <Heart className={`w-4 h-4 transition-transform ${saved ? 'fill-primary scale-110' : ''}`} />
    </button>
  );
}