# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**pro-waste-connect** is a high-performance landing page for industrial waste disposal services built with Astro and hosted on Cloudflare Pages. The site is optimized for Google Ads conversion and emphasizes fast load times, mobile responsiveness, and accessibility.

**Key Metrics:**

- Target: Industrial waste disposal businesses in Sapporo
- Acquisition: Google Ads
- Primary Goal: Maximize inquiries, phone calls, and LINE referrals
- Cost: Hosting is free (Cloudflare Pages), forms via Formspree, analytics via Microsoft Clarity

## Architecture

### High-Level Structure

```
src/
├── pages/
│   └── index.astro          # Main landing page (entry point)
├── layouts/
│   └── Layout.astro         # Global layout wrapper (meta tags, styles)
├── components/              # Reusable Astro components
│   ├── Hero.astro          # Hero section with tagline & CTA
│   ├── Services.astro      # Service offerings & areas
│   ├── ServiceArea.astro   # Geographic coverage
│   ├── Reasons.astro       # Why Choose Us (metrics-based cards)
│   ├── Testimonials.astro  # Social proof section
│   ├── Pricing.astro       # Pricing table
│   ├── FAQ.astro           # FAQ accordion
│   ├── ContactForm.astro   # Formspree-powered inquiry form
│   └── Footer.astro        # Footer with links & legal info
```

### Component Pattern

Each `.astro` component:

- **Accepts TypeScript interfaces** (e.g., `Props`) for type-safe props
- **Uses `Astro.props`** to destructure passed data
- **Includes scoped `<style>` blocks** for component-specific CSS
- **Follows BEM naming** for CSS classes (optional but preferred)
- **Exports no direct JavaScript** (all rendered server-side)

Example pattern:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<div class="component-name">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>

<style>
  .component-name {
    /* scoped styles */
  }
</style>
```

### Layout System

- **`src/layouts/Layout.astro`** defines global HTML structure, meta tags, and reusable CSS variables
- Global CSS variables are defined in `:root` and include colors, spacing, fonts, and transitions
- **Responsive breakpoints** use `@media (max-width: 768px)` for mobile-first adjustments

### Styling Approach

- **CSS-in-JS (scoped styles)**: Each component has `<style>` block; Astro automatically scopes selectors
- **Global utilities** in Layout: `.container`, `.section`, `.grid`, `.flex`, `.text-center`
- **Color palette** (CSS variables):
  - `--color-primary`: #1e3a8a (dark blue)
  - `--color-secondary`: #3b82f6 (light blue)
  - `--color-accent`: #ff6b35 (orange)
  - `--color-light`: #f8fafc (light background)
  - `--color-dark`: #1f2937 (dark text)

## Development Workflow

### Common Commands

| Command         | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `pnpm dev`      | Start local dev server on `http://localhost:3000`              |
| `pnpm build`    | Generate production build in `dist/` directory                 |
| `pnpm preview`  | Preview production build locally                               |
| `pnpm lint`     | Run ESLint on all `.js`, `.ts`, `.astro` files (warnings only) |
| `pnpm lint:fix` | Auto-fix ESLint issues where possible                          |
| `pnpm format`   | Format all files with Prettier (Astro plugin included)         |
| `pnpm check`    | Run both ESLint and Prettier checks (pre-commit validation)    |
| `pnpm a11y`     | Run Pa11y accessibility audit (requires dev server running)    |

### Pre-Commit Hooks (Lefthook)

The project uses **Lefthook v2** to enforce code quality:

1. **`pre-commit` hook** runs before each commit:
   - `npx eslint . --ext .js,.ts,.astro` — validates code style
   - `npx prettier --check .` — validates formatting

2. **`commit-msg` hook** validates conventional commit format:
   - Required format: `type(scope): description`
   - Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`
   - Example: `feat(hero): add animated text effect`

If hooks fail, fix issues with `pnpm lint:fix` and `pnpm format` before retrying commit.

## Code Quality & Linting

### ESLint Configuration (eslint.config.js)

**Flat Config (v9)** with these plugins:

- **@typescript-eslint/parser**: Parses TypeScript in Astro frontmatter
- **astro-eslint-parser**: Parses `.astro` file syntax (enables template awareness)
- **eslint-plugin-astro**: Astro-specific rules (e.g., `no-set-html-directive`)
- **eslint-plugin-import**: Module import validation
- **eslint-plugin-jsx-a11y**: Accessibility warnings (form labels, anchor href values)

**Key Rules:**

- `jsx-a11y/anchor-is-valid`: Warns on `<a href="">` (set to `warn`)
- `jsx-a11y/label-has-associated-control`: Warns on orphaned labels (set to `warn`)
- Warnings are acceptable for a11y issues that are intentional (e.g., style-only links)

### Prettier Configuration (.prettierrc.cjs)

- **Print width**: 100 characters
- **Indent**: 2 spaces
- **Quotes**: Double quotes
- **Semi-colons**: Always enabled
- **Astro plugin**: `prettier-plugin-astro` handles `.astro` formatting
- **Arrow parens**: Always included (e.g., `(x) => x`, not `x => x`)

**Prettier ignores**: `.prettierignore` excludes `node_modules`, `dist`, `pnpm-lock.yaml`

## Deployment

### Cloudflare Pages (Automatic GitHub Integration)

**Setup (one-time):**

1. Push code to GitHub
2. Go to Cloudflare Dashboard → Pages → Create Project → Connect to Git
3. Select repository, configure build settings:
   - **Framework preset**: Astro
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
4. Environment variables (if needed): Add `SITE_URL` in Cloudflare dashboard

**Ongoing Deployments:**

- Any push to `main` branch triggers automatic build & deploy
- Check build status in Cloudflare Pages dashboard; review build logs if deployment fails

**Configuration File:** `wrangler.toml`

- Minimal setup for Pages (not Workers)
- Specifies `pnpm build` as build command
- Site configuration handled in `astro.config.mjs`

## External Integrations

### Formspree (Contact Form)

- Contact form (`ContactForm.astro`) submits to Formspree endpoint
- No backend required; emails received at configured address
- Free plan: ~50 submissions/month; paid plans available
- **Form attribute**: `action="https://formspree.io/f/{FORM_ID}"`

### Microsoft Clarity (Heatmaps & Analytics)

- Tracking code embedded in `Layout.astro`
- Provides click heatmaps, session recordings, scroll depth analytics
- Free tier; no user tracking consent required for basic features
- Useful for identifying UX bottlenecks and CTA effectiveness

### Google Ads Integration

- No code integration required; ads point to site URL
- Track conversions via Clarity, Formspree submission logs, or phone calls
- Optimize based on keyword performance and landing page engagement metrics

## Performance & Optimization

### Astro Static Output

- `astro.config.mjs` sets `output: "static"` — generates pure HTML/CSS/JS
- No dynamic server-side rendering; all pages pre-rendered at build time
- Result: Extremely fast delivery via Cloudflare CDN (~100ms global response)

### Image & Asset Optimization

- Use Astro's `<Image />` component for automatic WebP generation and srcset
- Keep images under 200KB; compress using tools like TinyPNG before adding
- Avoid large video embeds on initial page load (defer or lazy-load)

### CSS Best Practices

- Leverage CSS variables for theming; all colors are configurable in `:root`
- Use `gap` property for spacing instead of margins (flexbox/grid)
- Mobile-first: Base styles apply to mobile; add `@media` for larger screens
- Print width 100ch to keep lines readable; avoids horizontal scroll on small viewports

## File Naming & Organization

- **Directories**: Lowercase, hyphenated (e.g., `src/components/`)
- **Files**: PascalCase for Astro components (`Hero.astro`), lowercase for utilities (`utils.ts`)
- **CSS classes**: Lowercase, hyphenated (BEM optional but preferred, e.g., `.hero__title`)

## Common Gotchas & Tips

### Astro-Specific

1. **Props interface is required** — ESLint may warn if unused; this is normal for Astro templates
2. **No client-side JavaScript by default** — Use `<script>` tags or frameworks (React, Vue, Svelte) if interactivity needed
3. **Imports are server-side only** — Can't reference `.astro` components in browser JavaScript

### ESLint & Prettier

- ESLint warnings (not errors) about form accessibility (`label-has-associated-control`) are acceptable if intentional
- If Prettier + ESLint conflict, Prettier wins (enabled via `eslint-config-prettier`)
- Run `pnpm format` before committing to avoid pre-commit hook failures

### Deployment Failures

- **Build error "Layout is not defined"**: Check that all component imports are present (no unused cleanup)
- **Cloudflare CSS/JS not loading**: Verify `dist/` folder exists and build completed; clear Cloudflare cache
- **Form submissions failing**: Confirm Formspree endpoint URL and form ID are correct

## Testing & Validation

### Accessibility (Pa11y)

Run before major releases:

```bash
pnpm dev  # Start server in one terminal
pnpm a11y # Run audit in another
```

- Checks WCAG 2AA compliance
- Reports on contrast, missing alt text, keyboard navigation
- Issues found: Document and fix or add to known issues list

### Manual Testing Checklist

- [ ] Render on mobile (375px viewport)
- [ ] Test all form submissions end-to-end
- [ ] Verify phone links dial correctly on mobile
- [ ] Check CTA button visibility above fold
- [ ] Test on slow 3G connection (DevTools throttling)
- [ ] Verify analytics events firing (Microsoft Clarity)

## Environment Variables

Currently minimal env usage:

- `SITE_URL` (optional in astro.config.mjs): Overrides default `http://localhost:3000`
- Formspree form ID: Hardcoded in `ContactForm.astro` (consider moving to `.env` if multiple environments)
- Microsoft Clarity tracking ID: Hardcoded in `Layout.astro`

Future: Create `.env.local` and `.env.example` if secrets or environment-specific configs needed.

## Git Workflow

**Branch naming:** Feature branches use `feature/description` or `fix/description`

**Commit messages:** Follow conventional commit format (enforced by Lefthook)

- `feat(hero): add gradient background`
- `fix(form): resolve validation error`
- `docs(readme): update deployment steps`

**Push to main:** All PRs/commits to `main` trigger Cloudflare Pages deployment.

---

**Last Updated:** 2025-10-23
**Astro Version:** ^5.13.0
**Node/Package Manager:** pnpm v10.8.1+
