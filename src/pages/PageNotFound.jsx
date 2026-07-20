import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Home, Compass } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <SEO title="Page Not Found — FullyFundedHub" description="The page you're looking for doesn't exist." />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/8 blur-[100px]" />
      <div className="relative z-10 text-center max-w-lg mx-auto animate-fade-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-8">
          <Compass className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-heading text-7xl sm:text-8xl font-bold gradient-text">404</h1>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-4">This page has wandered off</h2>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved. But there are plenty of verified opportunities waiting for you.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all gold-glow">
            <Home className="w-4 h-4" /> Back to home
          </Link>
          <Link to="/opportunities" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-accent/30 rounded-xl text-sm font-semibold text-accent hover:bg-accent/10 transition-all">
            <Compass className="w-4 h-4" /> Browse opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}