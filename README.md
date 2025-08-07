# Mario Platformer Game

A simple Mario-style platformer game built with HTML5 Canvas, CSS, and JavaScript.

## How to Play

1. **Open `index.html`** in your web browser
2. **Controls:**
   - **Arrow Keys**: Move left and right
   - **Space**: Jump
   - **Restart Button**: Start a new game

## Game Features

### Player Character
- Mario-like character with red hat, blue overalls, and mustache
- Smooth movement and jumping physics
- Gravity and collision detection with platforms

### Game Elements
- **Platforms**: Jump on wooden platforms to reach higher areas
- **Enemies**: Goomba-like enemies that patrol platforms
- **Coins**: Collect golden coins for points (rotating animation)
- **Lives System**: You have 3 lives to complete the game

### Gameplay Mechanics
- **Jump on enemies** to defeat them and earn points
- **Collect coins** to increase your score
- **Avoid falling** off the screen or touching enemies from the side
- **Platform jumping** to reach all collectibles

### Scoring System
- **Coins**: 50 points each
- **Enemies**: 100 points each (when jumped on)

### Visual Features
- Animated background with clouds
- Rotating coin animations
- Smooth 60fps gameplay
- Modern UI with gradient backgrounds
- Responsive design

## Technical Details

- **Canvas Size**: 800x400 pixels
- **Game Loop**: Uses `requestAnimationFrame` for smooth animation
- **Physics**: Custom gravity and collision detection
- **Input Handling**: Keyboard event listeners
- **Object-Oriented Design**: Separate classes for Player, Enemy, Platform, and Coin

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 Classes
- `requestAnimationFrame`

## File Structure

```
├── index.html      # Main HTML file
├── style.css       # Game styling and layout
├── game.js         # Game logic and classes
└── README.md       # This file
```

Enjoy playing the game! 🎮