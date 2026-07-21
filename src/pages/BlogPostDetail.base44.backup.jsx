import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import SEO from '@/components/SEO';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';

export default function BlogPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.BlogPost.get(id)
      .then((data) => {
        setPost(data);
        setLoading(false);
        if (data?.category) {
          base44.entities.BlogPost.filter({ published: true, category: data.category }, '-created_date', 4)
            .then((results) => setRelated(results.filter((r) => r.id !== id).slice(0, 3)))
            .catch(() => {});
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="h-96 rounded-2xl glass-card animate-pulse" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">← Back to blog</Link>
      </div>
    );
  }

  return (
    <article>
      <SEO title={`${post.title} — FullyFundedHub Blog`} description={post.excerpt || `Read "${post.title}" on the FullyFundedHub blog.`} />
      {post.cover_image_url && (
        <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>

        {post.category && (
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">{post.category}</span>
        )}
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-2">{post.title}</h1>

        <div className="flex items-center gap-4 mt-5 text-sm text-muted-foreground">
          {post.author && <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(post.created_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {post.excerpt && <p className="text-lg text-muted-foreground mt-6 leading-relaxed italic border-l-2 border-primary/30 pl-4">{post.excerpt}</p>}

        <div className="prose prose-invert max-w-none mt-8 text-foreground/90 leading-relaxed [&>h2]:font-heading [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h3]:font-heading [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>a]:text-primary [&>a]:hover:underline [&>blockquote]:border-l-2 [&>blockquote]:border-primary/40 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>p]:mt-4">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/5">
          <h2 className="font-heading text-2xl font-bold mb-6">More in {post.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.id} to={`/blog/${r.id}`} className="group glass-card glass-card-hover rounded-2xl overflow-hidden">
                {r.cover_image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={r.cover_image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                  <p className="text-sm text-primary mt-3 flex items-center gap-1.5">Read more <ArrowRight className="w-3.5 h-3.5" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}