import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/api/supabaseClient';
import SEO from '@/components/SEO';
import { Calendar, User, Newspaper } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(50);

      setPosts(data || []);
      setLoading(false);
    };

    loadPosts().catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="Study Abroad Blog — SOP Tips, Visa Guidance & Application Advice" description="Free guides on writing a winning SOP, navigating visa applications, and meeting scholarship deadlines — practical advice from FullyFundedHub." />
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
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: (i % 6) * 0.06 }}
            >
              <Link
                to={`/blog/${post.id}`}
                className="group relative glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/20 border border-white/5 hover:border-accent/30"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                  )}
                  {/* bottom gradient for legibility + premium depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                  {post.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-background/60 backdrop-blur-sm border border-white/10 text-primary uppercase tracking-wider">
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>}
                  <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    {post.author && <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</span>}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
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

