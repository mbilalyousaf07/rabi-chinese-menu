# Verification results

Local verification performed on 14 November 2026. GitHub Pages publication was authorized and completed on 14 November 2026.

## Passed

- `npm test`: five Node test groups verify the six-category/46-entry inventory, 49 portion prices, all six deal prices and original prices, unique IDs, menu validation, search/category intersection, PKR formatting and real local image files.
- `python -m unittest discover -s tests -p "test_*.py"`: two groups verify public HTTPS acceptance and rejection of localhost, private addresses, HTTP, credentials, fragments and temporary tunnel URLs.
- `npm run test:browser`: real headless Chrome via Playwright; 52 cards, six deals, portion/PKR display, case-insensitive search, category intersection, clearing/reset, no-results, keyboard skip navigation, image loading, deliberate image failures, JSON failure/retry and repository subpath routing.
- Responsive checks at 320, 360, 390, 393, 768, 1024 and 1440 CSS pixels; no page-level horizontal overflow. Horizontal category scrolling remains intentional.
- iPhone 13 and Pixel 5 viewport/touch emulation in Chromium. Screenshots saved under local ignored `test-results/`. This is not physical iOS Safari testing.
- 46 individually selected dish photographs from distinct sources, visually reviewed. Full-size WebP copies total 1,729,950 bytes; mobile copies total 634,716 bytes. Responsive source selection and lazy loading avoid transferring every size. Every selected photo has a creator/source/license record; CC BY-SA adaptations retain their license. All card images loaded; customer pages never request original source JPEGs.
- Zero JavaScript page errors in the normal browse/search/filter path.

## Release gates / limitations

- The owner must confirm the source anomalies in `VERIFICATION.md`, especially Plain Rice Rs. 770 and the conflicting phone numbers.
- Permanent HTTPS URL is now live: https://mbilalyousaf07.github.io/rabi-chinese-menu/. PNG and SVG QR files were generated after successful live checks; the PNG independently decoded to this exact URL.
- Physical iPhone Safari, Android camera scanning, printed QR readability and real slow-network usability remain manual release checks.
- No formal screen-reader audit or automated WCAG certification was performed. Keyboard, semantic labels, focus visibility, reduced motion and contrast were considered in implementation.
- Browser dependencies are development-only. The live menu uses no npm packages or third-party network requests.

## Live deployment verification

`node tests/live.cjs https://mbilalyousaf07.github.io/rabi-chinese-menu/` passed: HTTPS 200, all 52 dish/deal cards, six deals, all photos, search/category intersection, and iPhone 13 / Pixel 5 Chromium emulation without page overflow or JavaScript errors. GitHub reported Pages build status `built`.

The permanent QR PNG is 720 ? 720 pixels and was independently decoded with ZXing-C++ 3.1.1. Both PNG and SVG are included in the repository. Run the live check with `--qr` to also verify public QR download and the destination record.

## Dish-specific photo update

- Every one of the 46 dish cards now has a different photograph. File hashes and source URLs are distinct, so filenames do not hide repeated content.
- Soups are visibly different: hot-and-sour broth, sweetcorn soup, and egg-drop soup. Steamed, fried and sauced momos use separate photos. The two drumstick cards also use separate photos.
- Six distinct deal panels combine the included dish photographs. There are no invented combo serving photographs or added menu contents.
- Original menu text, prices, variants, spicy markers and deal contents were compared against the previous deployed Git revision and are unchanged.
- House-special recipes and a few exact regional preparations are not supplied; their visual approximations are documented per photo in `data/image-selections.json`, and the customer photo disclosure remains visible.
- Local browser tests pass with 46 unique dish image sources, six deal panels, complete images, mobile layouts and fallback behaviour. Soup-card and deal-panel screenshots are retained under ignored `test-results/`.

## Supplied replacement images ? 15 November 2026

Ten uploaded files matched ten menu item IDs with no unmatched filenames. Both desktop and mobile versions were regenerated from each supplied image, with source-hash filenames for cache refresh. Referencing deal panels and credits were regenerated. User-supplied records are tested separately from stock-photo licenses. Menu text and prices remain unchanged.
