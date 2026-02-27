# mongoori-www

Official web hub for **mongoori**, a lifestyle brand offering:

- **mongoori Finds**: curated products and objects for daily life  
- **mongoori Rides**: premium Tesla rental experiences  
- **mongoori Stream**: private streaming hub  
- **mongoori Stays**: design-forward accommodations (coming soon)

The site is implemented as a lightweight, static HTML/CSS landing page intended to sit behind Cloudflare and be deployed via platforms like Coolify or any static file host.

## Tech stack

- Static **HTML5** (`index.html`)
- Modern **CSS3** (`style.css`)
- Google Fonts: Montserrat, Roboto

No JavaScript build system or framework is required.

## Project structure

- `index.html` – main landing page and SEO metadata
- `style.css` – global styles, layout, and responsive behavior
- `images/` – background imagery for each mongoori vertical

## Versioning

- Current version: **1.0.0**
- The version is also exposed in the `<meta name="version" />` tag in `index.html`.

When making notable visual/content changes, increment the version here and in the meta tag.

## Local development

You can open the site directly in a browser, or serve it with a simple static server for local testing:

```bash
cd mongoori-www
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deployment

Any static hosting solution works. A typical flow:

1. Push changes to the `main` branch of this repository.
2. Configure your platform (e.g., Coolify) to:
   - Use this repository and the `main` branch
   - Serve the project root (`.`) as the public directory
   - Skip build steps (no build required for pure static assets)
3. Point your domain (e.g., `www.mongoori.com`) to the deployment endpoint via DNS (commonly through Cloudflare).

## Contact

- Email: `contact@mongoori.com`
