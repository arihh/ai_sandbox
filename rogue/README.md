# Mobile Rogue - Dungeon Crawler

A mobile-optimized roguelike dungeon crawler game built with React, TypeScript, and Vite.

## Features

- **Mobile-First Design**: Optimized for smartphone portrait orientation with touch controls
- **Virtual D-Pad**: Responsive virtual controls for movement and actions
- **Random Dungeon Generation**: Procedurally generated dungeons with rooms and corridors
- **Combat System**: Turn-based combat with enemies and leveling up
- **Minimap**: Shows discovered areas and important elements
- **Audio Feedback**: Simple sound effects using Web Audio API
- **Progressive Gameplay**: Multiple floors with increasing difficulty

## Game Controls

### Touch Controls
- **Swipe**: Move in the direction of swipe
- **Virtual D-Pad**: Tap directional buttons to move
- **Action Buttons**: Attack/interact and menu buttons

### Game Elements
- **Green Circle**: Player
- **Red Circles**: Enemies
- **Gray Squares**: Walls
- **Dark Gray Squares**: Floor
- **Gold Squares**: Stairs to next floor

## Status Bar

- **HP**: Health points with visual bar
- **LVL**: Current level with experience bar
- **GOLD**: Collected gold
- **FLOOR**: Current floor number
- **TURNS**: Turn counter

## Gameplay

1. Navigate through randomly generated dungeons
2. Fight enemies to gain experience and gold
3. Level up to increase stats
4. Find stairs to progress to the next floor
5. Survive as long as possible and achieve high scores

## Technical Features

- **React + TypeScript**: Modern web technologies
- **Mobile Responsive**: Optimized for various screen sizes
- **Touch Gestures**: Swipe and tap support
- **Animations**: Smooth CSS animations and transitions
- **Audio System**: Web Audio API for sound effects
- **State Management**: React hooks for game state
- **Modular Architecture**: Clean, maintainable code structure

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Deployment

The game is automatically deployed to GitHub Pages when changes are pushed to the main branch. The workflow builds the project and deploys it to the `gh-pages` branch.

## Browser Support

- Modern mobile browsers (iOS Safari, Chrome Mobile, etc.)
- Desktop browsers for development and testing
- Requires JavaScript enabled

## Performance

- Optimized for 60 FPS on mobile devices
- Minimal memory usage
- Efficient rendering with CSS Grid
- Touch event optimization

## License

This project is part of an AI sandbox for educational purposes.
