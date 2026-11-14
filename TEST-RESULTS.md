# Verification results

Local verification performed on 14 November 2026. GitHub Pages publication was authorized and completed on 14 November 2026.

## Passed

- `npm test`: four Node test groups verify the six-category/46-entry inventory, 49 portion prices, all six deal prices and original prices, unique IDs, menu validation, search/category intersection, PKR formatting and real local image files.
- `python -m unittest discover -s tests -p "test_*.py"`: two groups verify public HTTPS acceptance and rejection of localhost, private addresses, HTTP, credentials, fragments and temporary tunnel URLs.
- `npm run test:browser`: real headless Chrome via Playwright; 52 cards, six deals, portion/PKR display, case-insensitive search, category intersection, clearing/reset, no-results, keyboard skip navigation, image loading, deliberate image failures, JSON failure/retry and repository subpath routing.
- Responsive checks at 320, 360, 390, 393, 768, 1024 and 1440 CSS pixels; no page-level horizontal overflow. Horizontal category scrolling remains intentional.
- iPhone 13 and Pixel 5 viewport/touch emulation in Chromium. Screenshots saved under local ignored `test-results/`. This is not physical iOS Safari testing.
- Nine downloaded, visually inspected food photos, optimized to 403,514 bytes total (approximately 394 KiB), with documented Pexels sources and license. All card images loaded; customer pages never request original source JPEGs.
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
