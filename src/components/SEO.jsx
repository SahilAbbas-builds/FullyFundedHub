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

export default function SEO({ title, description, image, noindex = false, type = 'website' }) {
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
  }, [title, description, image, noindex, type]);

  return null;
}
