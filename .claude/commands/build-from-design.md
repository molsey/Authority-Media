Build the Forge site from the design file at `$ARGUMENTS`.

## Instructions

You are converting a standalone HTML design file into the Forge Vite + Tailwind project structure. Follow these steps precisely.

### Step 1 — Read & Analyze the Design File

1. Read the design file at `$ARGUMENTS` in its entirety.
2. Identify and catalog:
   - **Page structure**: sections, navigation, footer, modals
   - **Content**: all text, headings, links, images, forms
   - **Tailwind classes**: every utility class used in the markup
   - **Custom CSS classes**: any classes not part of Tailwind's default set (e.g., `fade-up`, `glass`, `glow-orange`, `animate-scroll`, `animate-pulse-slow`)
   - **Iconify icons**: all `<iconify-icon>` elements and their `icon` attributes
   - **Google Fonts**: any `<link>` tags loading fonts from Google Fonts CDN
   - **JavaScript behavior**: `onclick` handlers, interactive elements (mobile menus, FAQ accordions, scroll animations, counters)
   - **Images**: all `<img>` tags, background images, and their sources

### Step 2 — Build `index.html`

Replace the contents of `index.html` with the design's HTML, applying these rules:

- **Keep the Vite entry point structure**: `<script type="module" src="/src/main.js"></script>` before `</body>`
- **Keep Iconify CDN script** in `<head>`: `<script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>`
- **Keep Google Fonts `<link>`** in `<head>` — use the same font families as the design. Default: Inter (300, 400, 500, 600)
- **Add `lang="en"` and `class="scroll-smooth"`** on `<html>`
- **DO NOT** include any `<style>` tags — all custom CSS goes in `src/style.css`
- **DO NOT** include any inline `<script>` tags — all JS goes in `src/main.js`
- **DO NOT** add `<script src="https://cdn.tailwindcss.com">` — Tailwind is installed locally via PostCSS
- **All Tailwind utility classes** stay directly in the HTML markup (this is correct)
- **Use semantic HTML** where the design uses `<div>`: prefer `<section>`, `<nav>`, `<header>`, `<footer>`, `<main>`, `<article>` as appropriate
- **Responsive design**: ensure mobile-first classes are present. Use `md:` (768px) and `lg:` (1024px) breakpoints
- **Dark theme**: the body should have `class="bg-neutral-950 text-neutral-400 antialiased selection:bg-orange-500/20 selection:text-orange-200 overflow-x-hidden"`
- **Images**: if using placeholder URLs (unsplash, etc.), keep them. If using local images, reference them from `public/` directory
- **Add SEO meta tags** if not present: `<meta name="description">`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), `<link rel="canonical">`

### Step 3 — Build `src/style.css`

Update `src/style.css` preserving the existing structure:

- **Keep** the `@tailwind` directives and `body` font-family rule at the top
- **Keep** all existing pre-built utilities (`.text-gradient-orange`, `.fade-up`, `.glass`, `.glow-orange`, etc.)
- **Add** any new custom CSS from the design that cannot be expressed as Tailwind utilities
- **Custom animations** that need `@keyframes` should be added here (but check if they already exist in `tailwind.config.js` first — `animate-fade-in-up`, `animate-scroll`, `animate-pulse-slow` are pre-configured)
- **Minimal custom CSS**: prefer Tailwind classes in markup over custom CSS

### Step 4 — Build `src/main.js`

Update `src/main.js` with all interactive JavaScript:

- **Keep** the `import './style.css'` at the top
- **IntersectionObserver for `.fade-up` elements**: always include the scroll-reveal observer:
  ```javascript
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  ```
- **Mobile menu toggle**: if the design has a mobile menu, implement `toggleMenu()` and expose it globally:
  ```javascript
  function toggleMenu() { /* ... */ }
  window.toggleMenu = toggleMenu;
  ```
- **FAQ accordion**: if the design has FAQ sections with `onclick="toggleFaq(this)"`, implement and expose globally:
  ```javascript
  function toggleFaq(el) { /* ... */ }
  window.toggleFaq = toggleFaq;
  ```
- **Navbar scroll behavior**: if the design has a fixed navbar, add scroll-based background/border changes
- **CRITICAL**: any function referenced in HTML `onclick=""` attributes MUST be exported to global scope via `window.functionName = functionName`
- **Do not use jQuery or external JS libraries** — vanilla JavaScript only

### Step 5 — Verify

1. Run `npm run build` to check for build errors
2. Confirm no `<style>` tags remain in `index.html`
3. Confirm no inline `<script>` tags remain in `index.html`
4. Confirm the Vite module script tag is present: `<script type="module" src="/src/main.js"></script>`
5. Confirm all `onclick` handler functions are exposed on `window`

### Reference

Use `design/homepage-amn.html` as a reference for patterns and conventions if you need guidance on how to structure specific components.
