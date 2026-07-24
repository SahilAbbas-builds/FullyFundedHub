import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const { user, loading } = useCurrentUser();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { label: 'Opportunities', to: '/opportunities' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-white/10 shadow-lg shadow-black/20'
          : 'bg-background/40 backdrop-blur-md border-white/5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img
              src="/logo-small.jpg"
              alt="FullyFundedHub logo"
              className="w-9 h-9 rounded-lg object-cover object-left shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-heading text-xl font-bold tracking-tight">
              FullyFunded<span className="gradient-text">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-4 lg:ml-10">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
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
          <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-shrink-0">
            {loading ? null : user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-full hover:bg-primary/10"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 lg:px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
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
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-white/5"
            >
              <div className="flex flex-col gap-1 py-4">
                {navLinks.map((link, i) => {
                  const active = isActive(link.to);
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          active
                            ? 'bg-white/10 text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}


