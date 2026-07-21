import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const { user, loading } = useCurrentUser();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get current URL to determine active state
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { label: 'Opportunities', to: '/opportunities' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img
             src="/logo.jpg"
              alt="FullyFundedHub logo"
              className="w-9 h-9 rounded-lg object-cover object-left shadow-lg group-hover:scale-105 transition-transform"
            />
            <span className="font-heading text-xl font-bold tracking-tight">
              FullyFunded<span className="gradient-text">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 lg:ml-10">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="navActivePill"
                      className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.03)] backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth/Admin Actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {loading ? null : user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-full hover:bg-primary/10"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/5 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-white/10 text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
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