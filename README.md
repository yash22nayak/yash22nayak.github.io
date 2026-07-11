# yash22nayak.github.io

Personal portfolio of **Yash Nayak** — Full-Stack Engineer.

A single-page static site with smooth scrolling and micro-animations, inspired by
modern Awwwards-style portfolios. No build step, no runtime CDN dependencies —
everything (fonts, GSAP, Lenis) is self-hosted in `assets/`.

## Structure

```
index.html          # all content, semantic & SEO-ready
assets/css/style.css
assets/js/main.js   # Lenis smooth scroll, GSAP reveals, magnetic buttons,
                    # cursor-following project previews, nav overlay
assets/vendor/      # gsap.min.js, ScrollTrigger.min.js, lenis.min.js
assets/fonts/       # Instrument Sans (woff2, self-hosted)
assets/img/         # project cover artwork (SVG)
```

## Develop locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

All animations respect `prefers-reduced-motion`, and the full content is
visible even with JavaScript disabled.
