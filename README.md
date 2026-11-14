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
- `assets/images/`: optimized self-hosted WebP photos, 46 distinct dish photos plus the header photograph, with smaller mobile versions. Original source JPEGs are never referenced by the website.
- `data/image-credits.json`, `credits.html`: per-dish photo provenance, creator, source, selection notes and license links. Photos are representative, not restaurant food. Sources include Pexels, Flickr and the WordPress Photo Directory; each asset keeps its Pexels, CC BY, CC BY-SA or CC0 license. Adapted ShareAlike photos retain their original license.
- `assets/qr/`: contains the permanent live-URL PNG, SVG and destination record.
- `scripts/generate-qr.py`: local QR generator with public HTTPS validation.
- `VERIFICATION.md`: content questions and release/device checks.

## Behaviour and accessibility

Full menu shows all deals followed by all six categories. Category buttons apply a single category; search intersects with that selection and searches dish/deal names, case-insensitively. Clear search keeps the category; “Show the full menu” resets both. Deal contents are always visible. All prices explicitly use `Rs.` and the page identifies PKR. Momo prices have separate portion labels.

Semantic sections, labelled search/navigation, keyboard controls, visible focus, live result counts, reduced-motion support and responsive grids support accessible browsing. Failed photos show a calm “Photo unavailable” fallback; JSON failure shows retry. Text is inserted using DOM textContent, avoiding HTML execution from menu data. JavaScript is required; a noscript message explains this.

System fonts avoid external font requests. Every dish uses a distinct 720?540 WebP photograph plus a 360?270 mobile copy, selected through responsive `srcset`. Lazy loading, explicit dimensions and a prioritized hero limit initial transfer. No original menu photos, remote image hotlinks or cookies are used. Images are individually selected for dish preparation, sauce, ingredients and food shape where source photos permit. House specials remain visual approximations because their recipes are not supplied; only the printed menu supplies descriptions and spicy markers. Each deal has a different photo panel assembled from its included dishes.

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

`data/image-selections.json` is the reviewed photo manifest: 46 distinct sources, licensing, crop settings and selection notes. `python scripts/download-images.py` downloads/crops these photos and writes full/mobile WebP copies; requires Pillow and network access. `python scripts/update-photo-data.py` updates menu image fields, deal galleries and the generated credits page. Original downloads are cached only in ignored `test-results/photo-sources/`. `scripts/create-data.py` records the initial transcription and reapplies reviewed photos; avoid running it after editing menu text/prices unless you intend to regenerate the original transcription.

## Restaurant logo

`assets/images/logoimage.jpeg` is the actual logo supplied by the restaurant owner. It is displayed intact in the header and footer and used as the browser icon. Its original white background and proportions are preserved. It is separate from the representative food-photo licenses.

## Replacing dish photographs with supplied images

The 10 uploads supplied on 15 November 2026 were matched by item ID in their filenames (`gravy-1-small.jpeg` matches Chicken Manchurian, for example). The `-small` suffix is ignored when matching: both responsive sizes are generated from the new upload. Referenced deal panels use those updated dish photos too.

Original uploads stay in the local ignored `assets/images/imagetoreplace/` folder. The committed manifest records the filename and SHA-256; optimized WebP filenames include a source hash to avoid stale cached images. Supplied photos are identified separately from licensed stock credits; no photographer or license is invented. To process new replacements, update their manifest entries, run `python scripts/download-images.py`, then `python scripts/update-photo-data.py`. A fresh checkout can use the committed optimized files when local upload originals are absent.

## Restaurant branches

The customer-facing location section lists two branches from `restaurant.branches` in `data/menu.json`: Faisal Town and Muslim Town, Lahore. Only Faisal Town has a confirmed street address and family-hall note. Add the second branch's confirmed address to its `address` field when available; no street address or phone number has been inferred. The existing permanent URL and QR serve the restaurant menu.

The confirmed restaurant enquiry number is **0329 6574787**, stored in `restaurant.phone` (international format) and `restaurant.phoneDisplay` in `data/menu.json`. The branches section offers a tap-to-call link without assigning the shared enquiry number to an unconfirmed branch-specific contact.
