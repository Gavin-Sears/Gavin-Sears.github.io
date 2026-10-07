![gavinsears.dev](public/og-image.jpg)

# gavinsears.dev

Source for [gavinsears.dev](https://gavinsears.dev), the portfolio site of Stephen Gavin Sears Jr. Built with Vite and TypeScript, and deployed to GitHub Pages by GitHub Actions every push to `main`.

## Build

Requires Node.js 24 (or 22+).

```sh
npm ci            # install dependencies
npm run dev       # local dev server (also reachable from other devices on your network)
npm run build     # type-check and build to dist/
npm run preview   # serve the built dist/ locally
```

## URL parameters

Add these to the page URL (e.g. `https://gavinsears.dev/?bg=webgl2`) for testing. Parameters can be combined with `&`.

| Parameter | Effect |
|---|---|
| *(none)* | Background uses WebGPU, falling back to WebGL2, then to a static CSS gradient if neither is available. |
| `?bg=webgl2` | Skips WebGPU and uses the WebGL2 renderer. |
| `?bg=css` | Skips both renderers and uses the static CSS gradient. |
| `?search=on` | Shows the project search bar at every screen width (normally hidden below 720px). |
| `?search=off` | Hides the project search bar at every screen width. |
