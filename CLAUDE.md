# Forge — Site Builder Template

## Tech Stack
- **Build:** Vite 7 (dev server + bundler)
- **CSS:** Tailwind CSS 3 via PostCSS + Autoprefixer
- **JS:** Vanilla JavaScript (no framework)
- **Icons:** Iconify Icons (CDN: `iconify-icon` web component)
- **Fonts:** Google Fonts (CDN) — default: Inter
- **Module system:** `package.json` is CJS (`"type": "commonjs"`), Vite config uses `.mjs` extension for ESM

## Project Structure
```
├── CLAUDE.md              ← you are here (auto-loaded every session)
├── index.html             ← Vite entry point
├── package.json
├── vite.config.mjs        ← ESM (note .mjs extension)
├── tailwind.config.js     ← CJS (module.exports)
├── postcss.config.js      ← CJS (module.exports)
├── design/                ← DROP HTML MOCKUPS HERE
│   └── README.md
├── public/                ← static assets (images, fonts, favicons)
└── src/
    ├── style.css          ← @tailwind directives + custom CSS
    └── main.js            ← JS entry (imports CSS, interactive logic)
```

## Workflow
1. User drops an HTML design file into `design/`
2. Build from it: read the design file, extract content and styles into `index.html` + `src/style.css` + `src/main.js`
3. Tailwind classes go directly in HTML markup — minimal custom CSS
4. Any JS for interactivity goes in `src/main.js`

## Commands
```bash
npm run dev       # Start dev server → localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## Key Conventions
- **Dark theme default:** bg-neutral-950, text-neutral-400, accent orange-500/600
- **Tailwind utility-first:** Use Tailwind classes in markup, not custom CSS (except animations)
- **Iconify icons:** `<iconify-icon icon="solar:icon-name" width="20"></iconify-icon>`
- **Google Fonts:** Loaded via CDN `<link>` in `<head>`, applied via CSS (`font-family`)
- **Responsive:** Mobile-first, breakpoints at `md:` (768px) and `lg:` (1024px)

## Critical: Module Scoping
Since `index.html` uses `<script type="module">`, all functions in `src/main.js` are module-scoped. If the HTML uses inline `onclick=""` handlers, those functions MUST be exported to the global scope:
```js
window.functionName = functionName;
```

## Don't
- Don't use Tailwind CDN (`<script src="https://cdn.tailwindcss.com">`) — it's installed locally via PostCSS
- Don't put CSS in `<style>` tags in HTML — use `src/style.css`
- Don't put JS in inline `<script>` tags — use `src/main.js`
- Don't use `vite.config.js` (CJS conflict) — use `vite.config.mjs`

## SEO & Accessibility Checklist
When building or updating a page, ensure these are in place:

### Meta Tags (in `<head>`)
```html
<meta name="description" content="150-160 char description of the page">
<link rel="canonical" href="https://yourdomain.com/">
<link rel="icon" href="/favicon.ico">
```

### Open Graph (in `<head>`)
```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Same as meta description or tailored for social">
<meta property="og:image" content="https://yourdomain.com/og-image.jpg">  <!-- 1200x630 -->
<meta property="og:url" content="https://yourdomain.com/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### Structured Data (in `<head>`)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://yourdomain.com"
}
</script>
```

### Accessibility Essentials
- Every `<img>` needs a descriptive `alt` attribute
- Use one `<h1>` per page; heading levels must not skip (h1 → h2 → h3)
- Interactive elements need visible focus styles (`focus:ring-2 focus:ring-orange-500 focus:outline-none`)
- Mobile menu buttons need `aria-expanded="true/false"` and `aria-controls="menu-id"`
- Add a skip link: `<a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to content</a>`
- Respect reduced motion: use `motion-reduce:transition-none` on animated elements
- Form inputs need `<label>` or `aria-label`

### Favicon Files (in `public/`)
- `favicon.ico` (32x32)
- `apple-touch-icon.png` (180x180)
- `og-image.jpg` (1200x630) for social sharing
