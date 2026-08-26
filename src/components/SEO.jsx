import { useEffect } from 'react';

const SITE_NAME = 'FullyFundedHub';
const DEFAULT_IMAGE = '/logo.jpg';

function setMetaByAttr(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  if (!href) return;
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ID = 'page-jsonld';

function setJsonLd(data) {
  let el = document.getElementById(JSON_LD_ID);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = JSON_LD_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * @param {object|object[]} [jsonLd] - one schema.org object, or an array of
 *   them (rendered as a single JSON-LD script containing a JSON array, which
 *   Google explicitly supports for multiple structured data items per page).
 */
export default function SEO({ title, description, image, noindex = false, type = 'website', jsonLd }) {
  useEffect(() => {
    const fullTitle = title || SITE_NAME;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${window.location.pathname}`;
    const resolvedImage = image
      ? (image.startsWith('http') ? image : `${origin}${image}`)
      : `${origin}${DEFAULT_IMAGE}`;

    document.title = fullTitle;

    setMetaByAttr('name', 'description', description);
    setMetaByAttr('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    setMetaByAttr('property', 'og:title', fullTitle);
    setMetaByAttr('property', 'og:description', description);
    setMetaByAttr('property', 'og:type', type);
    setMetaByAttr('property', 'og:url', canonicalUrl);
    setMetaByAttr('property', 'og:site_name', SITE_NAME);
    setMetaByAttr('property', 'og:image', resolvedImage);

    setMetaByAttr('name', 'twitter:card', 'summary_large_image');
    setMetaByAttr('name', 'twitter:title', fullTitle);
    setMetaByAttr('name', 'twitter:description', description);
    setMetaByAttr('name', 'twitter:image', resolvedImage);

    setCanonical(canonicalUrl);
    setJsonLd(jsonLd);

    // Clean up page-specific structured data when this component unmounts
    // or the route changes away, so it doesn't leak onto a page that didn't
    // ask for it.
    return () => setJsonLd(null);
  }, [title, description, image, noindex, type, jsonLd]);

  return null;
}
