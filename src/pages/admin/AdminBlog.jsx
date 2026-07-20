import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, X, Loader2, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const emptyPost = { title: '', excerpt: '', content: '', cover_image_url: '', author: '', category: '', published: false };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list view, 'new' or post object

  const load = () => {
    setLoading(true);
    base44.entities.BlogPost.list('-created_date', 100)
      .then((results) => { setPosts(results); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post permanently?')) return;
    await base44.entities.BlogPost.delete(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  if (editing) {
    return <BlogEditor post={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold">Blog Posts</h2>
          <p className="text-sm text-muted-foreground">{posts.length} total posts</p>
        </div>
        <button onClick={() => setEditing('new')} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {loading ? (
        <div className="h-64 glass-card rounded-2xl animate-pulse" />
      ) : posts.length === 0 ? (
        <div className="glass-card rounded-2xl py-20 text-center">
          <p className="text-muted-foreground">No blog posts yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
              {post.cover_image_url ? (
                <img src={post.cover_image_url} alt={post.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-muted-foreground/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{post.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {post.category && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{post.category}</span>}
                  <span className={`px-2 py-0.5 rounded-full ${post.published ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span>{new Date(post.created_date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditing(post)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogEditor({ post, onClose, onSaved }) {
  const [form, setForm] = useState(post || emptyPost);
  const [saving, setSaving] = useState(false);

  const handleSave = async (publish = false) => {
    setSaving(true);
    const payload = { ...form, published: publish };
    try {
      if (post?.id) {
        await base44.entities.BlogPost.update(post.id, payload);
      } else {
        await base44.entities.BlogPost.create(payload);
      }
      onSaved();
    } catch {
      alert('Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold">{post ? 'Edit Post' : 'New Post'}</h2>
        <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <input className="input-base text-lg font-semibold" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title…" />

        <input className="input-base" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short excerpt (shown in listing)…" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input className="input-base" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
          <input className="input-base" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (e.g. SOP Tips)" />
          <input className="input-base" value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} placeholder="Cover image URL" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium">Content (Markdown supported)</label>
            <span className="text-xs text-muted-foreground">Use **bold**, ## headings, - lists, [links](url)</span>
          </div>
          <textarea
            rows={16}
            className="input-base resize-y font-mono text-xs leading-relaxed"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write your post content here…"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={() => handleSave(false)} disabled={saving} className="flex-1 px-5 py-3 rounded-xl border border-white/15 text-sm font-semibold hover:bg-white/5 transition-all disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="flex-1 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all gold-glow disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}