import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Globe2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img
               src="/logo.jpg"
                alt="FullyFundedHub logo"
                className="w-9 h-9 rounded-lg object-cover object-left"
              />
              <span className="font-heading text-xl font-bold">
                FullyFunded<span className="gradient-text">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Curated, fully funded scholarships and internships for students who want to study and work abroad. Real opportunities. Verified. No noise.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Explore</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/opportunities" className="hover:text-primary transition-colors">Opportunities</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Submit</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Submit an opportunity</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Create account</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="legal-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="legal-link">Terms & Conditions</Link></li>
              <li><Link to="/disclaimer" className="legal-link">Disclaimer</Link></li>
              <li><Link to="/cookie-policy" className="legal-link">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} FullyFundedHub. All rights reserved.</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5" /> Built by a student, for students.
          </p>
        </div>
      </div>
    </footer>
  );
}