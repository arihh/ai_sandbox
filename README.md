# AI Sandbox

A collection of experimental games and applications hosted on GitHub Pages.

## Structure

- **Root (/)**: Menu page listing all available applications
- **`/rogue/`**: Mobile Rogue - A roguelike dungeon crawler game

## Development

### Root Menu
- Located in `docs/index.html`
- Simple HTML page with styling
- Links to all available applications

### Rogue Game
- Located in `rogue/` directory
- React + TypeScript project built with Vite
- Build output goes to `rogue/dist/`

## Deployment

The repository uses GitHub Actions to automatically deploy to GitHub Pages:

1. **Build Process**: 
   - Builds the rogue React application
   - Prepares deployment directory with menu and rogue app

2. **Deployment Structure**:
   ```
   gh-pages branch:
   ├── index.html        (menu page)
   └── rogue/           (rogue game)
       ├── index.html
       ├── assets/
       ├── manifest.json
       └── vite.svg
   ```

3. **URLs**:
   - Menu: https://arihh.github.io/ai_sandbox/
   - Rogue Game: https://arihh.github.io/ai_sandbox/rogue/

## GitHub Pages Configuration

- **Source**: gh-pages branch
- **Root**: / (root of gh-pages branch)
- **Custom Domain**: Not configured

## Adding New Applications

1. Create your application in a new directory
2. Update the menu in `docs/index.html` to include a link
3. Update the GitHub Actions workflow in `.github/workflows/deploy.yml` to build and deploy your app
4. Ensure your app is configured with the correct base path for GitHub Pages

## Local Development

To test the menu page locally:
```bash
# Simple HTTP server
python -m http.server 8000 -d docs

# Or with Node.js
npx serve docs
```

To develop the rogue game:
```bash
cd rogue
npm install
npm run dev
```

To test the full deployment structure locally:
```bash
# Build rogue game
cd rogue && npm run build && cd ..

# Prepare deployment directory
mkdir -p deploy
cp docs/index.html deploy/
mkdir -p deploy/rogue
cp -r rogue/dist/* deploy/rogue/

# Serve the deployment directory
npx serve deploy
```