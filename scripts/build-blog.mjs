#!/usr/bin/env node
/**
 * build-blog.mjs — mongoori-www blog build pipeline
 *
 * Reads Markdown files from ../blog-content/ (with YAML frontmatter),
 * converts them to HTML, and:
 *   1. Writes each post to ../blog/{slug}/index.html
 *   2. Injects new post cards into ../blog/index.html
 *
 * Usage:
 *   node scripts/build-blog.mjs          # build all
 *   node scripts/build-blog.mjs --force  # rebuild even if slug dir exists
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WWW_ROOT = join(__dirname, '..');
const CONTENT_DIR = join(WWW_ROOT, 'blog-content');
const BLOG_DIR = join(WWW_ROOT, 'blog');
const FORCE = process.argv.includes('--force');

// Category → display tag label
const CATEGORY_TAGS = {
  ev: 'EV Guide',
  driver: 'Driver Guide',
  cost: 'Cost Guide',
  insurance: 'Insurance Guide',
  host: 'Host Guide',
  comparison: 'Comparison Guide',
  general: 'Guide',
};

// Category → data-category attribute for filter UI
const CATEGORY_FILTER = {
  ev: 'ev',
  driver: 'driver',
  cost: 'cost',
  insurance: 'insurance',
  host: 'host',
  comparison: 'cost',
  general: 'driver',
};

function formatDate(dateStr) {
  if (!dateStr) return 'March 2026';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildPostHtml({ title, slug, description, date, category, tagLabel, readTime, htmlBody, relatedPosts }) {
  const canonical = `https://www.mongoori.com/blog/${slug}/`;
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description || '');
  const displayDate = formatDate(date);

  const relatedHtml = relatedPosts.map(p => `
      <div class="related-card">
        <span class="post-tag">${escapeHtml(p.tagLabel)}</span>
        <h3><a href="/blog/${p.slug}/">${escapeHtml(p.title)}</a></h3>
        <a href="/blog/${p.slug}/" class="read-more">Read More &rarr;</a>
      </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${escapedTitle} | mongoori</title>
  <meta name="description" content="${escapedDesc}" />
  <meta name="robots" content="index,follow" />
  <meta name="author" content="mongoori LLC" />

  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escapedTitle}" />
  <meta property="og:description" content="${escapedDesc}" />
  <meta property="og:image" content="https://www.mongoori.com/images/rides-bg.jpg" />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="${canonical}" />
  <meta property="twitter:title" content="${escapedTitle}" />
  <meta property="twitter:description" content="${escapedDesc}" />
  <meta property="twitter:image" content="https://www.mongoori.com/images/rides-bg.jpg" />

  <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
  <link rel="stylesheet" href="../../style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${escapedTitle}",
    "description": "${escapedDesc}",
    "image": "https://www.mongoori.com/images/rides-bg.jpg",
    "author": { "@type": "Organization", "name": "mongoori Rides" },
    "publisher": { "@type": "Organization", "name": "mongoori Rides", "url": "https://www.mongoori.com" },
    "datePublished": "${date || '2026-03-16'}",
    "dateModified": "${date || '2026-03-16'}",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "${canonical}" }
  }
  </script>

  <style>
    .blog-header { background-color: #1a1a1a; color: #fff; padding: 50px 20px 40px; text-align: center; }
    .blog-header .breadcrumb { color: #ccc; font-size: 0.9em; margin-bottom: 16px; }
    .blog-header .breadcrumb a { color: #ccc; text-decoration: none; }
    .blog-header .breadcrumb a:hover { color: #fff; }
    .blog-header h1 { font-family: 'Montserrat', sans-serif; font-size: 2.2em; margin: 0 0 12px; line-height: 1.3; max-width: 760px; margin-left: auto; margin-right: auto; }
    .blog-header .post-meta { color: #aaa; font-size: 0.9em; }
    .blog-article { max-width: 760px; margin: 40px auto; padding: 0 20px; text-align: left; line-height: 1.8; color: #333; }
    .blog-article h2 { font-family: 'Montserrat', sans-serif; font-size: 1.5em; color: #1a1a1a; margin-top: 44px; margin-bottom: 12px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; }
    .blog-article h3 { font-family: 'Montserrat', sans-serif; font-size: 1.15em; color: #1a1a1a; margin-top: 28px; }
    .blog-article p { margin-bottom: 16px; }
    .blog-article ul, .blog-article ol { padding-left: 24px; margin-bottom: 16px; }
    .blog-article li { margin-bottom: 6px; }
    .blog-article table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.95em; }
    .blog-article th { background: #1a1a1a; color: #fff; padding: 10px 14px; text-align: left; }
    .blog-article td { border: 1px solid #ddd; padding: 10px 14px; vertical-align: top; }
    .blog-article tr:nth-child(even) td { background: #f9f9f9; }
    .blog-article blockquote { border-left: 4px solid #4A90E2; margin: 20px 0; padding: 14px 20px; background: #f0f7ff; color: #333; font-style: italic; border-radius: 0 8px 8px 0; }
    .blog-article hr { border: none; border-top: 1px solid #eee; margin: 36px 0; }
    .cta-box { background: #1a1a1a; color: #fff; padding: 36px 28px; text-align: center; margin: 44px 0; border-radius: 12px; }
    .cta-box h3 { font-family: 'Montserrat', sans-serif; font-size: 1.4em; margin: 0 0 10px; }
    .cta-box p { color: #ccc; margin-bottom: 20px; }
    .cta-box .button { background: #4A90E2; color: #fff; }
    .cta-box .button:hover { background: #357abd; }
    .blog-header .post-tag { display: inline-block; background: #4A90E2; color: #fff; font-size: 0.75em; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
    .related-posts { max-width: 860px; margin: 0 auto 64px; padding: 0 20px; }
    .related-posts h2 { font-family: 'Montserrat', sans-serif; font-size: 1.3em; font-weight: 700; color: #1a1a1a; margin-bottom: 24px; text-align: center; }
    .related-posts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .related-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); padding: 24px; }
    .related-card .post-tag { display: inline-block; background: #4A90E2; color: #fff; font-size: 0.7em; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 10px; }
    .related-card h3 { font-family: 'Montserrat', sans-serif; font-size: 1em; font-weight: 700; color: #1a1a1a; margin: 0 0 10px; line-height: 1.4; }
    .related-card h3 a { color: #1a1a1a; text-decoration: none; }
    .related-card h3 a:hover { color: #4A90E2; }
    .related-card .read-more { color: #4A90E2; font-weight: 700; font-size: 0.85em; text-decoration: none; }
    .blog-nav { max-width: 760px; margin: 0 auto 40px; padding: 0 20px; display: flex; justify-content: space-between; font-size: 0.9em; }
    .blog-nav a { color: #4A90E2; text-decoration: none; }
    .blog-nav a:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      .blog-header h1 { font-size: 1.6em; }
      .blog-article h2 { font-size: 1.25em; }
      .blog-article table { font-size: 0.82em; }
      .related-posts-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 375px) {
      .blog-header { padding: 40px 16px; }
      .blog-article { padding: 0 16px; }
    }
  </style>
</head>

<body>
  <header class="blog-header" role="banner">
    <p class="breadcrumb"><a href="/">mongoori</a> &rsaquo; <a href="/blog/">Blog</a></p>
    <span class="post-tag">${escapeHtml(tagLabel)}</span>
    <h1>${escapedTitle}</h1>
    <p class="post-meta">${displayDate} &nbsp;&middot;&nbsp; ${readTime} min read</p>
  </header>

  <article class="blog-article" role="main">
${htmlBody}
  </article>

  <div class="cta-box">
    <h3>Ready to Start Earning with a Tesla?</h3>
    <p>Join mongoori Rides and get access to a Tesla Model 3 or Model Y for your rideshare business. No long-term commitment required.</p>
    <a href="/" class="button">Get Started Today</a>
  </div>

  <section class="related-posts" aria-label="Related articles">
    <h2>Related Articles</h2>
    <div class="related-posts-grid">
      ${relatedHtml}
    </div>
  </section>

  <nav class="blog-nav" aria-label="Blog navigation">
    <a href="/blog/">&larr; All Posts</a>
    <a href="/">mongoori Home &rarr;</a>
  </nav>

  <footer role="contentinfo">
    <p>
      <a href="/">Home</a>
      <span class="separator">|</span>
      <a href="/blog/">Blog</a>
      <span class="separator">|</span>
      <a href="/how-it-works.html">How It Works</a>
      <span class="separator">|</span>
      <a href="/faq.html">Driver FAQ</a>
      <span class="separator">|</span>
      <a href="mailto:contact@mongoori.com">Contact Us</a>
      <span class="separator">|</span>
      &copy; 2026 mongoori LLC. All Rights Reserved.
    </p>
  </footer>
</body>
</html>`;
}

function buildIndexCard({ title, slug, description, date, category, tagLabel, readTime }) {
  const displayDate = formatDate(date);
  const filterCat = CATEGORY_FILTER[category] || 'driver';
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description || '');
  const escapedTag = escapeHtml(tagLabel);

  return `
    <article class="blog-card" data-category="${filterCat}">
      <span class="post-tag">${escapedTag}</span>
      <h2><a href="/blog/${slug}/">${escapedTitle}</a></h2>
      <p class="post-meta">${displayDate} &nbsp;&middot;&nbsp; ${readTime} min read</p>
      <p>${escapedDesc}</p>
      <a href="/blog/${slug}/" class="read-more">Read More &rarr;</a>
    </article>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

if (!existsSync(CONTENT_DIR)) {
  console.error(`Error: blog-content directory not found at ${CONTENT_DIR}`);
  process.exit(1);
}

const mdFiles = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
if (mdFiles.length === 0) {
  console.log('No markdown files found in blog-content/. Nothing to build.');
  process.exit(0);
}

// Parse all posts
const posts = mdFiles.map(filename => {
  const filePath = join(CONTENT_DIR, filename);
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const date = data.date || data.published_date || '2026-03-16';
  const category = data.category || 'general';
  const tagLabel = data.tag || CATEGORY_TAGS[category] || 'Guide';
  const readTime = data.read_time
    ? parseInt(data.read_time)
    : estimateReadTime(content);

  if (!data.slug) {
    console.warn(`Warning: no slug in ${filename}, skipping.`);
    return null;
  }
  if (!data.title) {
    console.warn(`Warning: no title in ${filename}, skipping.`);
    return null;
  }

  return {
    filename,
    title: data.title,
    slug: data.slug,
    description: data.description || '',
    date,
    category,
    tagLabel,
    readTime,
    content,
  };
}).filter(Boolean);

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

console.log(`\nBuilding ${posts.length} blog posts...\n`);

const newSlugs = [];

for (const post of posts) {
  const postDir = join(BLOG_DIR, post.slug);
  const postFile = join(postDir, 'index.html');

  if (existsSync(postDir) && !FORCE) {
    console.log(`  [SKIP] /blog/${post.slug}/ already exists (use --force to rebuild)`);
    continue;
  }

  mkdirSync(postDir, { recursive: true });

  // Related posts: up to 3 other posts
  const related = posts.filter(p => p.slug !== post.slug).slice(0, 3);

  const htmlBody = marked.parse(post.content);

  const html = buildPostHtml({
    title: post.title,
    slug: post.slug,
    description: post.description,
    date: post.date,
    category: post.category,
    tagLabel: post.tagLabel,
    readTime: post.readTime,
    htmlBody,
    relatedPosts: related,
  });

  writeFileSync(postFile, html, 'utf8');
  console.log(`  [BUILD] /blog/${post.slug}/index.html`);
  newSlugs.push(post.slug);
}

// Inject new post cards into blog/index.html
if (newSlugs.length > 0) {
  const indexFile = join(BLOG_DIR, 'index.html');
  let indexHtml = readFileSync(indexFile, 'utf8');

  // Build cards only for slugs not already present in the index
  const newPosts = posts.filter(p => newSlugs.includes(p.slug) && !indexHtml.includes(`/blog/${p.slug}/`));
  if (newPosts.length === 0) {
    console.log('\n  [INDEX] All post cards already present in blog/index.html — skipped.');
  }
  const cardsHtml = newPosts.map(p => buildIndexCard(p)).join('\n');

  if (newPosts.length > 0) {
    // Insert before the no-results paragraph
    const INJECT_MARKER = '<p class="no-results"';
    if (indexHtml.includes(INJECT_MARKER)) {
      indexHtml = indexHtml.replace(INJECT_MARKER, `${cardsHtml}\n\n    ${INJECT_MARKER}`);
      writeFileSync(indexFile, indexHtml, 'utf8');
      console.log(`\n  [INDEX] Injected ${newPosts.length} new card(s) into blog/index.html`);
    } else {
      console.warn('\n  [WARN] Could not find injection marker in blog/index.html — index not updated.');
    }
  }
}

console.log('\nBuild complete.\n');
