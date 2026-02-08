Run a comprehensive audit of the Forge site. Focus area: $ARGUMENTS (default: all).

Read `index.html`, `src/style.css`, and `src/main.js`, then evaluate every item below. For each item, report one of:
- **PASS** — requirement met
- **WARN** — partially met or could be improved
- **FAIL** — requirement not met

Group results by category and provide a summary score at the end.

---

## 1. SEO

- [ ] `<html lang="en">` attribute is present
- [ ] `<title>` tag exists and is descriptive (not "Site Title" or empty)
- [ ] `<meta name="description" content="...">` exists and is 150-160 characters
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">` is present
- [ ] `<link rel="canonical" href="...">` exists with the production URL
- [ ] Open Graph tags are present:
  - `<meta property="og:title">`
  - `<meta property="og:description">`
  - `<meta property="og:image">` (with absolute URL to a 1200x630 image)
  - `<meta property="og:url">`
  - `<meta property="og:type" content="website">`
- [ ] Twitter Card: `<meta name="twitter:card" content="summary_large_image">`
- [ ] Structured data (`<script type="application/ld+json">`) is present (Organization or WebSite schema)
- [ ] All heading tags (`h1`-`h6`) follow proper hierarchy (single `h1`, no skipped levels)
- [ ] All `<a>` tags with external links have `rel="noopener noreferrer"` and `target="_blank"`
- [ ] Favicon is configured: `<link rel="icon" href="/favicon.ico">` or SVG variant

## 2. Accessibility

- [ ] All `<img>` tags have meaningful `alt` attributes (not empty or placeholder)
- [ ] All interactive elements (buttons, links) have visible focus styles (`:focus-visible` or Tailwind `focus:ring-*`)
- [ ] Color contrast: text on background meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
  - Check: `text-neutral-400` on `bg-neutral-950` (report the approximate contrast ratio)
  - Check: `text-neutral-500` on `bg-neutral-950`
  - Check: `text-white` on `bg-orange-600` (CTA buttons)
- [ ] ARIA attributes are used where appropriate:
  - Mobile menu toggle has `aria-expanded`, `aria-controls`
  - Navigation has `aria-label`
  - FAQ accordions use `aria-expanded` on trigger buttons
- [ ] Form inputs have associated `<label>` elements or `aria-label`
- [ ] Skip navigation link exists: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`
- [ ] `<main>` element exists and has `id="main-content"`
- [ ] Interactive elements (`onclick` handlers) are on `<button>` elements, not `<div>` or `<span>`
- [ ] Reduced motion: animations respect `prefers-reduced-motion` (via Tailwind `motion-reduce:` or `@media (prefers-reduced-motion)`)

## 3. Performance

- [ ] Images in `public/` are optimized (check file sizes — warn if any image > 200KB)
- [ ] Images use modern formats (WebP or AVIF preferred over PNG/JPEG)
- [ ] Images have explicit `width` and `height` attributes (prevents CLS)
- [ ] Below-the-fold images have `loading="lazy"` attribute
- [ ] Hero/above-the-fold images do NOT have `loading="lazy"` (should load eagerly)
- [ ] Google Fonts `<link>` uses `display=swap` for FOIT prevention
- [ ] Iconify script is loaded (verify CDN link is present and correct version)
- [ ] No unused CSS: check for Tailwind classes in `style.css` that could be utilities instead
- [ ] `vite-plugin-image-optimizer` is configured in `vite.config.mjs`
- [ ] Run `npm run build` and report bundle size (JS + CSS)

## 4. Responsive Design

- [ ] Mobile viewport meta tag is present
- [ ] Navigation has a mobile menu (hidden on `md:` and above)
- [ ] Layout uses responsive grid/flex with `md:` and `lg:` breakpoints
- [ ] Text sizes are responsive (smaller on mobile, larger on desktop)
- [ ] Images are responsive (`w-full`, `max-w-*`, or responsive sizing)
- [ ] No horizontal overflow (`overflow-x-hidden` on body)
- [ ] Touch targets are at least 44x44px on mobile (check button/link padding)
- [ ] Content is readable without horizontal scrolling at 320px width

## 5. Code Quality (Forge Conventions)

- [ ] **No `<style>` tags** in `index.html` — all CSS is in `src/style.css`
- [ ] **No inline `<script>` tags** in `index.html` — all JS is in `src/main.js`
- [ ] **No Tailwind CDN** (`<script src="https://cdn.tailwindcss.com">`) — Tailwind is local
- [ ] **Vite entry point** is correct: `<script type="module" src="/src/main.js"></script>`
- [ ] **Module scoping**: all functions used in `onclick=""` handlers are exported via `window.functionName`
- [ ] **CSS file** starts with `@tailwind base; @tailwind components; @tailwind utilities;`
- [ ] **JS file** starts with `import './style.css'`
- [ ] Tailwind utility-first: custom CSS is minimal (only for animations and effects that cannot be expressed as utilities)
- [ ] Config file format: `vite.config.mjs` (ESM), `tailwind.config.js` (CJS), `postcss.config.js` (CJS)

---

## Output Format

Present results as a formatted report:

```
## Site Audit Report

### SEO: X/Y passed
| Check | Status | Notes |
|-------|--------|-------|
| ...   | PASS   | ...   |

### Accessibility: X/Y passed
...

### Performance: X/Y passed
...

### Responsive: X/Y passed
...

### Code Quality: X/Y passed
...

### Overall Score: XX/YY (XX%)

## Priority Fixes
1. [FAIL items listed by importance]

## Recommendations
1. [WARN items with improvement suggestions]
```
