# Blog Page Design Guidelines — mongoori-www
**Version:** 1.0 | **Date:** 2026-03-16 | **Author:** UX/UI Designer (MON-720)
**For:** Frontend Engineer (MON-707) — SEO Blog 4-Post Deployment

---

## Overview

This document provides design specifications for implementing the 4 SEO blog posts on `mongoori-www`. The blog lives on the **static HTML/CSS site** (`mongoori-www`), NOT the React app (`mongoori-rides`). All implementations must reference `style.css` and the existing `blog/index.html` patterns.

**4 Blog Posts to Deploy:**
1. `How Much Can You Earn as a Rideshare Driver in Irvine with a Tesla?` → `/blog/rideshare-driver-earnings-irvine-tesla/`
2. `Why Tesla is the Best Car for Uber/Lyft Drivers in Southern California` → `/blog/tesla-best-car-uber-lyft-drivers/`
3. `Tesla EV Rental FAQ for Rideshare Drivers in Orange County` → `/blog/tesla-rental-faq-orange-county/`
4. `How to Rent Out Your Tesla in Irvine: A Complete Host Guide for 2026` → `/blog/host-guide-rent-out-tesla-irvine/`

---

## 1. Design System Reference

### Color Tokens (from `style.css`)
```css
--primary-dark:  #1a1a1a   /* Hero/header background */
--primary-light: #f4f4f4   /* Page body background */
--text-dark:     #333       /* Body copy */
--text-light:    #fff       /* On-dark text */
--text-muted:    #ccc       /* Subdued on-dark */
--accent-color:  #4A90E2   /* Tags, links, CTA buttons */
```

**Additional semantic values used in blog:**
```css
/* Body copy on cards */
color: #555;

/* Meta text (date, read time) */
color: #888;

/* Card background */
background: #fff;

/* CTA hover fill */
background: #4A90E2; color: #fff;
```

### Typography
| Element        | Font Family                      | Weight | Size        |
|---------------|----------------------------------|--------|-------------|
| Page H1        | `'Montserrat', sans-serif`       | 700    | 2.8em       |
| Article H1     | `'Montserrat', sans-serif`       | 700    | 2.2–2.6em   |
| H2 (section)   | `'Montserrat', sans-serif`       | 600    | 1.5em       |
| H3 (subsection)| `'Montserrat', sans-serif`       | 600    | 1.2em       |
| Body text      | `'Roboto', sans-serif`           | 400    | 1em (16px)  |
| Meta/caption   | `'Roboto', sans-serif`           | 300    | 0.85em      |
| Tag badge      | `'Roboto', sans-serif`           | 700    | 0.75em      |

**Google Fonts CDN (required in `<head>`):**
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
```

---

## 2. Blog Listing Page (`/blog/index.html`)

> ✅ **Already deployed.** Do not modify the listing page unless a new post card needs to be added.

**Pattern for adding a new card:**
```html
<article class="blog-card">
  <span class="post-tag">Tag Label</span>
  <h2><a href="/blog/post-slug/">Post Title Here</a></h2>
  <p class="post-meta">March 15, 2026 &nbsp;·&nbsp; 5 min read</p>
  <p>Excerpt text (1–2 sentences, ~150 chars).</p>
  <a href="/blog/post-slug/" class="read-more">Read More &rarr;</a>
</article>
```

**Tag categories (use exactly):**
- `Earnings Guide` → blue `#4A90E2`
- `Driver Guide` → blue `#4A90E2`
- `FAQ` → blue `#4A90E2`
- `Host Guide` → blue `#4A90E2`

> All tags use the same `#4A90E2` background. No variant styling needed.

---

## 3. Blog Detail Page Layout

Each post needs its own `index.html` at its canonical URL path. File structure:
```
mongoori-www/
  blog/
    rideshare-driver-earnings-irvine-tesla/
      index.html
    tesla-best-car-uber-lyft-drivers/
      index.html
    tesla-rental-faq-orange-county/
      index.html
    host-guide-rent-out-tesla-irvine/
      index.html
```

### 3.1 Page `<head>` Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SEO Title: "{Post Title} | mongoori Rides" -->
  <title>[POST TITLE] | mongoori Rides</title>
  <meta name="description" content="[150–160 char description]" />
  <meta name="robots" content="index,follow" />
  <meta name="author" content="mongoori LLC" />

  <link rel="canonical" href="https://www.mongoori.com/blog/[post-slug]/" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://www.mongoori.com/blog/[post-slug]/" />
  <meta property="og:title" content="[POST TITLE] | mongoori Rides" />
  <meta property="og:description" content="[150–160 char description]" />
  <meta property="og:image" content="https://www.mongoori.com/images/rides-bg.jpg" />

  <!-- Twitter Card -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://www.mongoori.com/blog/[post-slug]/" />
  <meta property="twitter:title" content="[POST TITLE] | mongoori Rides" />
  <meta property="twitter:description" content="[150–160 char description]" />
  <meta property="twitter:image" content="https://www.mongoori.com/images/rides-bg.jpg" />

  <!-- Article Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "[POST TITLE]",
    "description": "[150-160 char description]",
    "datePublished": "2026-03-15",
    "author": { "@type": "Organization", "name": "mongoori LLC" },
    "publisher": {
      "@type": "Organization",
      "name": "mongoori Rides",
      "logo": { "@type": "ImageObject", "url": "https://www.mongoori.com/images/favicon.svg" }
    },
    "url": "https://www.mongoori.com/blog/[post-slug]/",
    "mainEntityOfPage": "https://www.mongoori.com/blog/[post-slug]/"
  }
  </script>

  <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
  <link rel="stylesheet" href="../../style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
</head>
```

> **Note on `og:type`:** Use `"article"` (not `"website"`) for blog post detail pages.

---

### 3.2 Page Structure

```
[POST DETAIL PAGE]
├── <header> — Post Hero (dark, #1a1a1a)
│   ├── Breadcrumb link (← Blog)
│   ├── Category tag badge
│   ├── H1 title
│   └── Post meta (date · read time)
├── <main> — Article wrapper
│   ├── Introduction paragraph
│   ├── H2 sections (from markdown)
│   │   ├── H3 subsections (optional)
│   │   ├── Body paragraphs
│   │   ├── Bullet lists / numbered lists
│   │   ├── Bold/italic emphasis
│   │   ├── <blockquote> (callout stats/quotes)
│   │   └── <hr> section dividers
│   ├── CTA Box (inline, mid-article or end)
│   └── Related Posts (3 cards)
└── <footer> — Shared site footer
```

---

### 3.3 `<head>` Inline Styles (add to each post's `<style>` block)

Copy this into each post's `<style>` tag:

```css
/* === BLOG POST DETAIL — INLINE STYLES === */

/* Hero */
.post-hero {
  background-color: #1a1a1a;
  color: #fff;
  padding: 60px 20px 50px;
  text-align: center;
}
.post-hero a.back-link {
  color: #ccc;
  text-decoration: none;
  font-size: 0.9em;
  display: inline-block;
  margin-bottom: 16px;
}
.post-hero a.back-link:hover { color: #fff; }
.post-hero .post-tag {
  display: inline-block;
  background: #4A90E2;
  color: #fff;
  font-size: 0.75em;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}
.post-hero h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.2em;
  font-weight: 700;
  margin: 0 auto 12px;
  max-width: 760px;
  line-height: 1.3;
  letter-spacing: 1px;
}
.post-hero .post-meta {
  color: #ccc;
  font-size: 0.9em;
  font-weight: 300;
}

/* Article body */
.post-article {
  max-width: 760px;
  margin: 48px auto 64px;
  padding: 0 20px;
  color: #333;
  line-height: 1.8;
}
.post-article h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.6em;
  font-weight: 700;
  color: #1a1a1a;
  margin: 48px 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}
.post-article h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2em;
  font-weight: 600;
  color: #222;
  margin: 32px 0 12px;
}
.post-article p {
  font-size: 1em;
  color: #555;
  margin-bottom: 20px;
}
.post-article strong { color: #1a1a1a; }
.post-article em { color: #555; font-style: italic; }
.post-article ul, .post-article ol {
  margin: 0 0 20px 24px;
  color: #555;
}
.post-article li { margin-bottom: 8px; line-height: 1.7; }
.post-article blockquote {
  background: #f7f9fc;
  border-left: 4px solid #4A90E2;
  padding: 16px 20px;
  margin: 24px 0;
  border-radius: 0 8px 8px 0;
  color: #444;
  font-style: italic;
}
.post-article hr {
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 40px 0;
}
.post-article a {
  color: #4A90E2;
  text-decoration: underline;
}
.post-article a:hover { color: #2c6fba; }

/* CTA Box */
.cta-box {
  background: #1a1a1a;
  color: #fff;
  border-radius: 12px;
  padding: 36px 32px;
  text-align: center;
  margin: 48px 0;
}
.cta-box h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.4em;
  font-weight: 700;
  margin: 0 0 12px;
  color: #fff;
}
.cta-box p {
  color: #ccc;
  margin-bottom: 24px;
}
.cta-box a.cta-btn {
  display: inline-block;
  background: #4A90E2;
  color: #fff;
  font-weight: 700;
  font-size: 0.95em;
  padding: 14px 32px;
  border-radius: 50px;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: background 0.3s ease;
}
.cta-box a.cta-btn:hover { background: #2c6fba; }

/* Related Posts */
.related-posts {
  max-width: 860px;
  margin: 0 auto 64px;
  padding: 0 20px;
}
.related-posts h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.3em;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  text-align: center;
}
.related-posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.related-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 24px;
  text-align: left;
}
.related-card .post-tag {
  display: inline-block;
  background: #4A90E2;
  color: #fff;
  font-size: 0.7em;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.related-card h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px;
  line-height: 1.4;
}
.related-card h3 a { color: #1a1a1a; text-decoration: none; }
.related-card h3 a:hover { color: #4A90E2; }
.related-card .read-more {
  color: #4A90E2;
  font-weight: 700;
  font-size: 0.85em;
  text-decoration: none;
}

/* Responsive */
@media (max-width: 768px) {
  .post-hero h1 { font-size: 1.7em; }
  .post-article h2 { font-size: 1.35em; }
  .cta-box { padding: 28px 20px; }
  .related-posts-grid { grid-template-columns: 1fr; }
}
@media (max-width: 375px) {
  .post-hero h1 { font-size: 1.5em; }
  .post-hero { padding: 40px 16px; }
  .post-article { padding: 0 16px; }
}
```

---

### 3.4 `<body>` HTML Template

```html
<body>

  <!-- HERO / POST HEADER -->
  <header class="post-hero" role="banner">
    <a href="/blog/" class="back-link">&larr; Blog</a>
    <span class="post-tag">[Tag: Earnings Guide / Driver Guide / FAQ / Host Guide]</span>
    <h1>[Post Title — exact match to content file]</h1>
    <p class="post-meta">March 15, 2026 &nbsp;·&nbsp; [N] min read</p>
  </header>

  <!-- ARTICLE BODY -->
  <main>
    <article class="post-article" role="main">

      <!-- Introduction paragraph -->
      <p>[Introduction text from content file]</p>

      <hr />

      <!-- H2 sections from markdown -->
      <h2>[Section Title from content H2]</h2>
      <p>[Body text]</p>
      <ul>
        <li><strong>Key point:</strong> explanation text</li>
        <li><strong>Key point:</strong> explanation text</li>
      </ul>

      <!-- Callout stat (blockquote) -->
      <blockquote>
        [Key statistic or pull-quote from content]
      </blockquote>

      <hr />

      <!-- Mid-article or end CTA — DRIVER posts use "Book a Tesla" -->
      <div class="cta-box">
        <h3>Ready to Start Driving?</h3>
        <p>Book a Tesla Model 3 or Model Y in Irvine today — weekly rentals, all-inclusive.</p>
        <a href="https://rides.mongoori.com" class="cta-btn">Book a Tesla &rarr;</a>
      </div>

      <!-- HOST posts use "Become a Host" CTA instead -->
      <!--
      <div class="cta-box">
        <h3>Ready to Earn from Your Tesla?</h3>
        <p>Become a Mongoori host and start earning $2,000–$3,000/month.</p>
        <a href="https://rides.mongoori.com/become-host" class="cta-btn">Become a Host &rarr;</a>
      </div>
      -->

    </article>

    <!-- RELATED POSTS -->
    <section class="related-posts" aria-label="Related articles">
      <h2>Related Articles</h2>
      <div class="related-posts-grid">

        <div class="related-card">
          <span class="post-tag">Driver Guide</span>
          <h3><a href="/blog/tesla-best-car-uber-lyft-drivers/">Why Tesla is the Best Car for Uber/Lyft Drivers in SoCal</a></h3>
          <a href="/blog/tesla-best-car-uber-lyft-drivers/" class="read-more">Read More &rarr;</a>
        </div>

        <div class="related-card">
          <span class="post-tag">FAQ</span>
          <h3><a href="/blog/tesla-rental-faq-orange-county/">Tesla EV Rental FAQ for Rideshare Drivers in Orange County</a></h3>
          <a href="/blog/tesla-rental-faq-orange-county/" class="read-more">Read More &rarr;</a>
        </div>

        <div class="related-card">
          <span class="post-tag">Host Guide</span>
          <h3><a href="/blog/host-guide-rent-out-tesla-irvine/">How to Rent Out Your Tesla in Irvine: A Complete Host Guide</a></h3>
          <a href="/blog/host-guide-rent-out-tesla-irvine/" class="read-more">Read More &rarr;</a>
        </div>

      </div>
    </section>
  </main>

  <!-- FOOTER (shared pattern from blog/index.html) -->
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
</html>
```

---

## 4. CTA Button Specifications

### Driver Posts (Posts 1, 2, 3)
| Property | Value |
|---|---|
| Text | `Book a Tesla →` |
| Link | `https://rides.mongoori.com` |
| Background | `#4A90E2` |
| Hover | `#2c6fba` |

### Host Post (Post 4)
| Property | Value |
|---|---|
| Text | `Become a Host →` |
| Link | `https://rides.mongoori.com/become-host` |
| Background | `#4A90E2` |
| Hover | `#2c6fba` |

### CTA Placement Rule
- **Short posts (<1,000 words):** Place CTA at the end of the article, before Related Posts
- **Long posts (>1,000 words):** Place CTA after the 2nd or 3rd H2 section AND at the end

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Desktop | 1280px+ | Full layout, 3-col related posts |
| Tablet | 768px | Single-col related posts; reduced heading sizes |
| Mobile | 375px | Reduced hero padding; 16px horizontal margins |

**Key responsive rules:**
```css
/* Tablet */
@media (max-width: 768px) {
  .post-hero h1 { font-size: 1.7em; }   /* down from 2.2em */
  .related-posts-grid { grid-template-columns: 1fr; }
}

/* Mobile */
@media (max-width: 375px) {
  .post-hero h1 { font-size: 1.5em; }
  .post-hero { padding: 40px 16px; }
  .post-article { padding: 0 16px; }
}
```

**Max content width:** `760px` for article body, `860px` for related posts section.

---

## 6. SEO Meta — Per-Post Values

### Post 1 — Rideshare Earnings
```
Title:       How Much Can You Earn as a Rideshare Driver in Irvine with a Tesla? | mongoori Rides
Description: Discover realistic rideshare earnings for Irvine drivers. Tesla Model 3 & Y can net $3,800–$4,100/month with Mongoori Rides all-inclusive rental.
Canonical:   https://www.mongoori.com/blog/rideshare-driver-earnings-irvine-tesla/
Tag:         Earnings Guide
Read time:   5 min read
```

### Post 2 — Tesla Best Car for Rideshare
```
Title:       Why Tesla is the Best Car for Uber/Lyft Drivers in Southern California | mongoori Rides
Description: Tesla Model 3 & Y offer SoCal rideshare drivers the lowest operating costs, highest ratings, and best earnings. See why Mongoori drivers choose Tesla.
Canonical:   https://www.mongoori.com/blog/tesla-best-car-uber-lyft-drivers/
Tag:         Driver Guide
Read time:   6 min read
```

### Post 3 — Tesla Rental FAQ Orange County
```
Title:       Tesla EV Rental FAQ for Rideshare Drivers in Orange County | mongoori Rides
Description: All your Tesla rental questions answered: documents needed, insurance, mileage, Supercharger access, and how Mongoori Rides works for OC rideshare drivers.
Canonical:   https://www.mongoori.com/blog/tesla-rental-faq-orange-county/
Tag:         FAQ
Read time:   6 min read
```

### Post 4 — Host Guide
```
Title:       How to Rent Out Your Tesla in Irvine: A Complete Host Guide for 2026 | mongoori Rides
Description: Turn your Tesla into $2,000–$3,000/month passive income with Mongoori Rides. Learn the host application process, earnings, insurance, and how to get started.
Canonical:   https://www.mongoori.com/blog/host-guide-rent-out-tesla-irvine/
Tag:         Host Guide
Read time:   7 min read
```

---

## 7. OG Image Specifications

Use the shared image for all 4 posts initially:

| Property | Value |
|---|---|
| URL | `https://www.mongoori.com/images/rides-bg.jpg` |
| Recommended size | 1200 × 630px |
| Aspect ratio | 1.91:1 (Twitter/OG standard) |
| Alt coverage | Existing `rides-bg.jpg` serves as fallback |

> Future enhancement: create post-specific OG images at 1200×630px with overlay text. Not required for V1 launch.

---

## 8. Header Hierarchy (H1→H3)

Each post must follow this heading structure for SEO:

```
H1  — Post title (only ONE per page, in <header>)
  H2  — Major sections (from markdown ## headings)
    H3  — Subsections (from markdown ### headings)
```

**Rules:**
- Never skip levels (no H1 → H3 without H2)
- H1 only appears in the hero header, never in the article body
- Section separators (`---` in markdown → `<hr>`) go between H2 sections

---

## 9. Content Conversion Reference

| Markdown | HTML |
|---|---|
| `# Title` | H1 in hero only |
| `## Section` | `<h2>` in article |
| `### Subsection` | `<h3>` in article |
| `**bold**` | `<strong>` |
| `*italic*` | `<em>` |
| `---` | `<hr />` |
| `- bullet` | `<ul><li>` |
| `1. item` | `<ol><li>` |
| `> quote` | `<blockquote>` |
| `[text](url)` | `<a href="url">text</a>` |

---

## 10. Implementation Checklist (per post)

- [ ] Create directory: `blog/[post-slug]/index.html`
- [ ] Add `<head>` with correct title, description, canonical, OG tags
- [ ] Add `BlogPosting` JSON-LD schema
- [ ] Add post hero with: breadcrumb link, tag badge, H1, meta (date, read time)
- [ ] Convert markdown body to semantic HTML using conversion table above
- [ ] Add `<hr>` between major sections
- [ ] Place CTA box (driver or host version based on post audience)
- [ ] Add Related Posts section with 3 cards (exclude the current post)
- [ ] Add shared footer
- [ ] Test responsive layout at 375px, 768px, 1280px
- [ ] Verify canonical URL matches actual file path
- [ ] Verify `style.css` path is `../../style.css` (two levels up from post slug dir)

---

## 11. Related Posts Matrix

Each post should show 3 related posts (never link to itself):

| Current Post | Related Posts to Show |
|---|---|
| Post 1 (Earnings) | Post 2, Post 3, Post 4 |
| Post 2 (Best Car) | Post 1, Post 3, Post 4 |
| Post 3 (FAQ) | Post 1, Post 2, Post 4 |
| Post 4 (Host Guide) | Post 1, Post 2, Post 3 |

---

*Document maintained by UX/UI Designer. Questions → Product Manager.*
