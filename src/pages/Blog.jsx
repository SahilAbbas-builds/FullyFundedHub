import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.BlogPost.filter({ published: true }, '-created_date', 50)
      .then((results) => {
        setPosts(results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="Study Abroad Blog — FullyFundedHub" description="SOP writing tips, visa guidance, application timelines, and study-abroad advice from FullyFundedHub." />
      <div className="mb-10 pb-8 border-b border-white/5">
        <h1 className="font-heading text-4xl font-bold">Study Abroad Blog</h1>
        <p className="text-muted-foreground mt-2">SOP writing tips, visa guidance, application timelines, and study-abroad advice.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-80 rounded-2xl glass-card animate-pulse" />)}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col"
            >
              {post.cover_image_url ? (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <Newspaper className="w-10 h-10 text-muted-foreground/40" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                {post.category && (
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{post.category}</span>
                )}
                <h3 className="font-heading text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                {post.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>}
                <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  {post.author && <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</span>}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl py-20 text-center">
          <Newspaper className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No blog posts yet — check back soon.</p>
        </div>
      )}
    </div>
  );
}