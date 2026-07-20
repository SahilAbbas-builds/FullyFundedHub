import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Globe2 } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { base44 } from '@/api/base44Client';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, LogOut, Shield, Search } from 'lucide-react';

export default function Navbar() {
  const { user, loading, refresh } = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { label: 'Opportunities', to: '/opportunities' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img
              src="https://media.base44.com/images/public/6a5b6c687497da10c6f21279/4f7114ffa_wmremove-transformed.png"
              alt="FullyFundedHub logo"
              className="w-9 h-9 rounded-lg object-cover object-left shadow-lg group-hover:scale-105 transition-transform"
            />
            <span className="font-heading text-xl font-bold tracking-tight">
              FullyFunded<span className="gradient-text">Hub</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 lg:gap-6 lg:ml-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {loading ? null : user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-primary/10"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/5 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-2" />
              {loading ? null : user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium hover:bg-white/5 rounded-lg flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Admin
                    </Link>
                  )}
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg flex items-center gap-2 text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium hover:bg-white/5 rounded-lg">Log in</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-lg text-center">Sign up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}