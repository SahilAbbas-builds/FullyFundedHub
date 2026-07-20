import { Link, Outlet, useLocation } from 'react-router-dom';
import AdminRoute from '@/components/AdminRoute';
import { LayoutDashboard, Briefcase, Inbox, FileText, Mail, Plus, ArrowLeft, Shield } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/opportunities', label: 'Listings', icon: Briefcase },
  { to: '/admin/opportunities/new', label: 'Add Opportunity', icon: Plus },
  { to: '/admin/submissions', label: 'Submissions', icon: Inbox },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/leads', label: 'Leads', icon: Mail },
];

export default function AdminLayout() {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-background" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">FullyFundedHub management</p>
              </div>
            </div>
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-56 flex-shrink-0">
              <nav className="glass-card rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {navItems.map((item) => (
                  <AdminNavLink key={item.to} {...item} />
                ))}
              </nav>
            </aside>
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}

function AdminNavLink({ to, label, icon: Icon, end }) {
  const location = useLocation();
  const active = end ? location.pathname === to : location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
        active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </Link>
  );
}