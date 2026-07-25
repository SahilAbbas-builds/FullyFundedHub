import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-background/60 border border-white/10 text-sm text-left hover:border-white/20 transition-colors focus:outline-none focus:border-primary/40"
      >
        <span className={`truncate ${value ? 'text-foreground' : 'text-muted-foreground'}`}>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full max-h-64 overflow-y-auto rounded-xl glass-card border border-white/10 shadow-xl py-1.5">
          <button
            onClick={() => { onChange(''); setOpen(false); }}
            className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${!value ? 'text-primary font-semibold' : 'text-foreground hover:bg-white/5'}`}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${value === opt ? 'text-primary font-semibold' : 'text-foreground hover:bg-white/5'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
