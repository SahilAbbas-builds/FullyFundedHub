// scripts/generate-sitemap.js
//
// Generates public/sitemap.xml at build time so it includes every published
// opportunity and blog post, not just the static pages. Previously the
// sitemap only listed 10 static URLs (home, /opportunities, /about, etc.)
// and never included the individual /opportunities/:id or /blog/:id pages —
// which are exactly the pages people search for by name (e.g. "Chevening
// Scholarship 2026"), so they were effectively invisible to search engines.
//
// Run automatically via the "prebuild" npm script (see package.json), so it
// runs before every `npm run build` and the fresh file gets copied into
// dist/ by Vite's static `public/` copy step.

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://fullyfundedhub.com';

function loadEnv() {
  // Prefer real process env (what Vercel provides during build). Fall back
  // to reading .env directly for local `npm run build` runs.
  let url = process.env.VITE_SUPABASE_URL;
  let key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if ((!url || !key)) {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (existsSync(envPath)) {
      const lines = readFileSync(envPath, 'utf-8').split(/\r?\n/);
      for (const line of lines) {
        const match = line.match(/^([A-Z_]+)=(.*)$/);
        if (!match) continue;
        const [, k, v] = match;
        if (k === 'VITE_SUPABASE_URL') url = url || v.trim();
        if (k === 'VITE_SUPABASE_PUBLISHABLE_KEY') key = key || v.trim();
      }
    }
  }

  return { url, key };
}

function xmlEscape(str) {
  return String(str).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  }[c]));
}

function urlEntry(loc, { priority, lastmod } = {}) {
  let entry = `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n`;
  if (lastmod) entry += `    <lastmod>${lastmod}</lastmod>\n`;
  if (priority) entry += `    <priority>${priority}</priority>\n`;
  entry += `  </url>\n`;
  return entry;
}

async function main() {
  const { url, key } = loadEnv();

  const staticUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/opportunities`, priority: '0.9' },
    { loc: `${SITE_URL}/blog`, priority: '0.8' },
    { loc: `${SITE_URL}/about`, priority: '0.7' },
    { loc: `${SITE_URL}/contact`, priority: '0.6' },
    { loc: `${SITE_URL}/faq`, priority: '0.6' },
    { loc: `${SITE_URL}/privacy`, priority: '0.3' },
    { loc: `${SITE_URL}/terms`, priority: '0.3' },
    { loc: `${SITE_URL}/disclaimer`, priority: '0.3' },
    { loc: `${SITE_URL}/cookie-policy`, priority: '0.3' },
  ];

  let dynamicUrls = [];

  if (!url || !key) {
    console.warn('[generate-sitemap] Missing Supabase env vars — writing static-only sitemap.');
  } else {
    try {
      const supabase = createClient(url, key);

      const { data: opportunities, error: oppErr } = await supabase
        .from('opportunities')
        .select('id, updated_at, created_at')
        .eq('status', 'published');
      if (oppErr) throw oppErr;

      const { data: posts, error: postErr } = await supabase
        .from('blog_posts')
        .select('id, updated_at, created_at')
        .eq('published', true);
      if (postErr) throw postErr;

      dynamicUrls = [
        ...(opportunities || []).map((o) => ({
          loc: `${SITE_URL}/opportunities/${o.id}`,
          priority: '0.85',
          lastmod: (o.updated_at || o.created_at || '').slice(0, 10) || undefined,
        })),
        ...(posts || []).map((p) => ({
          loc: `${SITE_URL}/blog/${p.id}`,
          priority: '0.6',
          lastmod: (p.updated_at || p.created_at || '').slice(0, 10) || undefined,
        })),
      ];

      console.log(`[generate-sitemap] Included ${opportunities?.length ?? 0} opportunities and ${posts?.length ?? 0} blog posts.`);
    } catch (err) {
      console.warn('[generate-sitemap] Failed to fetch dynamic URLs, writing static-only sitemap:', err.message);
    }
  }

  const allUrls = [...staticUrls, ...dynamicUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map((u) => urlEntry(u.loc, u)).join('')}</urlset>\n`;

  const outPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`[generate-sitemap] Wrote ${allUrls.length} URLs to ${outPath}`);
}

main().catch((err) => {
  console.error('[generate-sitemap] Fatal error:', err);
  // Don't fail the whole build over the sitemap — worst case it's stale.
  process.exit(0);
});
