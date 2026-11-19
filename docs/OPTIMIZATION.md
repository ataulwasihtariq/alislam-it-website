# Website optimization plan (alislam.it)

Order matters: safety first, then speed, then SEO, then content.

## 1. Safety
Verified backup (files + database, test-restored), update WordPress core and plugins on a staging copy, remove unused plugins.

## 2. Speed
- Compress images (WebP, about 200 KB max for content images), set width/height, lazy-load.
- Page cache plugin and a CDN if the host allows.
- Remove unused plugins and scripts; check Core Web Vitals in PageSpeed Insights.

## 3. SEO
- One H1 per page; clear title (under 60 characters) and meta description (under 155).
- Clean URLs, internal links between related pages, tags and categories used consistently.
- XML sitemap submitted to Google Search Console; fix broken links and duplicate pages.
- Alt text on every image. Italian language set (hreflang if other languages exist).
- Page structure: general introduction, common questions, deeper level.

## 4. Content
Institutional voice only (personal speeches belong on the personal blog). Facts over rhetoric. Sermon posts are created as drafts by jamaat-automation/friday-sermon-publisher.

## 5. Tracking
Monthly: speed score, indexed pages, top queries, broken links. Keep results in a Drive sheet, not in git.
