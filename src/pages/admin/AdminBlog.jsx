import { useState, useRef } from 'react';
import { supabase } from '@/api/supabaseClient';
import { Plus, Pencil, Trash2, X, Loader2, Eye, ImagePlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const emptyPost = { title: '', excerpt: '', content: '', cover_image_url: '', author: '', category: '', published: false };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!error) setPosts(data || []);
        setLoading(false);
      });
  };

  useState(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post permanently?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
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
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
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

// Resizes an image file client-side via Canvas (max 1600px on the long edge,
// JPEG quality 0.82) before upload, so large phone-camera photos don't slow
// down the site. Runs entirely in the browser - no API, no cost.
function compressImage(file, maxDimension = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Compression failed'));
      }, 'image/jpeg', quality);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read image'));
    };
    img.src = objectUrl;
  });
}

function CoverImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const compressedBlob = await compressImage(file);
      const ext = 'jpg';
      const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(path, compressedBlob, { contentType: 'image/jpeg', upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">Cover image</label>
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onPaste={(e) => {
          const item = Array.from(e.clipboardData.items || []).find((i) => i.type.startsWith('image/'));
          if (item) handleFile(item.getAsFile());
        }}
        tabIndex={0}
        className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
          dragOver ? 'border-primary bg-primary/5' : 'border-white/15 hover:border-white/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {value ? (
          <div className="relative">
            <img src={value} alt="Cover preview" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">Click, drop, or paste to replace</p>
            </div>
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-xs">Compressing & uploading...</p>
              </>
            ) : (
              <>
                <ImagePlus className="w-6 h-6" />
                <p className="text-xs">Click, drag & drop, or paste an image</p>
              </>
            )}
          </div>
        )}
        {uploading && value && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
    </div>
  );
}

function BlogEditor({ post, onClose, onSaved }) {
  const [form, setForm] = useState(post || emptyPost);
  const [saving, setSaving] = useState(false);

  const handleSave = async (publish = false) => {
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = form;
    const payload = { ...rest, published: publish };
    try {
      if (post?.id) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload);
        if (error) throw error;
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
        <input className="input-base text-lg font-semibold" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title..." />

        <input className="input-base" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short excerpt (shown in listing)..." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input className="input-base" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
          <input className="input-base" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (e.g. SOP Tips)" />
        </div>

        <CoverImageUploader value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} />

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
            placeholder="Write your post content here..."
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
