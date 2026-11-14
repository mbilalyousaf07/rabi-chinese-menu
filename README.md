# Rabi Chinese — Moments of Fire

Read-only, mobile-first digital menu. Buildless HTML5, CSS3, and vanilla JavaScript. No backend, account, cart, ordering, analytics, or runtime third-party requests. Menu text is authoritative only to the supplied printed menus; review `VERIFICATION.md` before release. Published to GitHub Pages with user approval on 14 November 2026.

## Live menu and permanent QR

- Menu: https://mbilalyousaf07.github.io/rabi-chinese-menu/
- Repository: https://github.com/mbilalyousaf07/rabi-chinese-menu
- Print/download PNG: https://mbilalyousaf07.github.io/rabi-chinese-menu/assets/qr/rabi-menu.png
- Scalable SVG: https://mbilalyousaf07.github.io/rabi-chinese-menu/assets/qr/rabi-menu.svg

GitHub Pages publishes the root of the `main` branch. Keep this repository name and account URL stable so printed QR codes continue to work. The PNG was independently decoded and matches the live menu URL. Physical camera/print tests remain recommended.

## Run locally

From the project directory:

```sh
python -m http.server 8000
```

Open `http://localhost:8000`. Use an HTTP server: opening HTML directly with `file://` prevents JSON loading in browsers. Runtime requires no installation or build step. Development tests require Node.js; QR generation uses Python.

## Files

- `index.html`, `css/style.css`, `js/app.js`: accessible presentation and safe DOM rendering, lazy-loaded images, search, category filters, error/retry states.
- `js/menu-utils.js`: pure menu validation, search, filtering and PKR formatting shared with tests.
- `data/menu.json`: all 46 menu entries, 49 portion prices and six complete deals. Change content here rather than in HTML.
- `assets/images/`: optimized self-hosted WebP photos, nine files reused across related dishes. Original source JPEGs are never referenced by the website.
- `data/image-credits.json`, `credits.html`: photo provenance, source and license links. Photos are illustrative stock, not restaurant food. Cropped and compressed under the [Pexels License](https://www.pexels.com/license/).
- `assets/qr/`: contains the permanent live-URL PNG, SVG and destination record.
- `scripts/generate-qr.py`: local QR generator with public HTTPS validation.
- `VERIFICATION.md`: content questions and release/device checks.

## Behaviour and accessibility

Full menu shows all deals followed by all six categories. Category buttons apply a single category; search intersects with that selection and searches dish/deal names, case-insensitively. Clear search keeps the category; “Show the full menu” resets both. Deal contents are always visible. All prices explicitly use `Rs.` and the page identifies PKR. Momo prices have separate portion labels.

Semantic sections, labelled search/navigation, keyboard controls, visible focus, live result counts, reduced-motion support and responsive grids support accessible browsing. Failed photos show a calm “Photo unavailable” fallback; JSON failure shows retry. Text is inserted using DOM textContent, avoiding HTML execution from menu data. JavaScript is required; a noscript message explains this.

System fonts avoid external font requests. Nine WebP photos total approximately 405 KB, with lazy loading, explicit dimensions and a prioritized hero image. No original menu photos, remote image hotlinks or cookies are used. Images are representative by food family, not exact recipes; only the printed menu supplies descriptions and spicy markers.

## Verification

```sh
npm install
npm test
npx playwright install chromium
npm run test:browser
python -m unittest discover -s tests -p "test_*.py"
```

Browser tests start their own local server and test at a GitHub Pages style `/rabi-chinese-menu/` path. They cover all menu entries/deals, category/search intersection, no-result/reset, keyboard focus, mobile widths, successful images, deliberate image failures, and JSON load retry. Browser tooling is a development-only dependency. See `TEST-RESULTS.md` for actual results and limits.

## Deploy to GitHub Pages — approval required

1. Resolve the verification checklist and obtain approval to push/deploy.
2. Create a repository (for example `rabi-chinese-menu`). Commit `index.html`, `css/`, `js/`, `data/`, `assets/`, `credits.html` and `.nojekyll` to the publishing branch. Do not include `node_modules/`, local test reports or source menu JPEGs in the published tree. Use `.gitignore` provided. Source menus remain local for audit.
3. In repository Settings → Pages, choose deployment from the publishing branch, root directory.
4. Use the permanent URL GitHub provides: `https://YOUR-ACCOUNT.github.io/rabi-chinese-menu/`. Replace the account/repository with the actual values; this example is documentation, not a QR destination.
5. Verify HTTPS, all content and images at the project subpath. All runtime paths are relative, including module-relative JSON fetches.
6. Once the permanent URL is confirmed, generate and physically test the QR below. Keep the URL stable when updating menu data; use a domain you control for portability across hosting providers.

Canonical and Open Graph URL metadata use the permanent GitHub Pages address. SEO title, description, theme and social summary metadata are included.

## Generate the permanent QR

```sh
python -m pip install -r scripts/requirements-qr.txt
python scripts/generate-qr.py https://mbilalyousaf07.github.io/rabi-chinese-menu/
```

The argument must be the real public deployed HTTPS URL. The script rejects HTTP, localhost/private IPs, reserved test domains and common temporary tunnels; it cannot prove that a public URL is permanent, so verify ownership and reachability first. It writes `assets/qr/rabi-menu.png` (black-on-white, four-module quiet zone, Q error correction) a scalable `rabi-menu.svg`, and `destination.txt`. No QR service receives the address. Scan on both iPhone and Android, then print at least 3 cm wide with the full white border. Changes at the same URL do not require reprinting.

## Photo maintenance

`python scripts/download-images.py` re-downloads and crops the nine selected photos; requires Pillow and network access. Credits record original source URLs and the Pexels license. The full menu is generated from JSON at runtime. `scripts/create-data.py` records the initial transcription; if you edit JSON, update/remove that script to prevent accidental overwrites.
