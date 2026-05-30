# 🚗 Fuzzy-Train: Driving Training Game

A comprehensive web-based driving simulator designed to teach and train people how to drive safely in various scenarios.

## Features

### 6 Training Scenarios

1. **Basic Controls** - Learn fundamental driving skills
   - Accelerate and decelerate
   - Steering control
   - Speed management

2. **Parking Training** - Master parking techniques
   - Parallel parking
   - Position accuracy
   - Smooth control

3. **Lane Changes** - Practice safe lane switching
   - Multiple lane transitions
   - Distance management
   - Traffic awareness

4. **Obstacle Course** - Navigate through obstacles
   - Agility training
   - Precision driving
   - Course completion

5. **Emergency Stop** - Quick reaction training
   - Emergency braking
   - Speed control
   - Obstacle avoidance

6. **Traffic Navigation** - Real-world driving scenarios
   - Multiple vehicles
   - Traffic rules
   - Safe navigation

## Technical Stack

- **Graphics**: Three.js - 3D rendering engine
- **Physics**: Cannon.js - Physics simulation
- **Platform**: Web-based (HTML5, CSS3, JavaScript)
- **Browser Compatible**: Chrome, Firefox, Safari, Edge

## Installation & Usage

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/ahmad1465lat-stack/fuzzy-train.git
cd fuzzy-train
```

2. Open `index.html` in your web browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Or simply open the file directly
open index.html
```

3. Select a training scenario from the menu and start driving!

## Game Controls

### Keyboard Controls
- **W** or **↑** - Accelerate forward
- **S** or **↓** - Brake/Reverse
- **A** or **←** - Turn left
- **D** or **→** - Turn right
- **SPACE** - Handbrake/Emergency stop

### UI Elements

**Top HUD:**
- Speed display (km/h)
- Current scenario name
- Score counter

**Middle HUD:**
- Mission instructions
- Current objectives

**Bottom HUD:**
- Control guide
- Tips and information

## Scoring System

- **Objective Completion**: +100-300 points
- **Successful Maneuvers**: +50-100 points
- **Mistakes**: -25-100 points
- **Collision Penalties**: -50 points

### Ratings
- **Excellent**: 400+ points
- **Good**: 300-399 points
- **Fair**: 200-299 points
- **Needs Improvement**: Below 200 points

## Scenario Details

### Basic Controls (60 seconds)
Learn how to control the vehicle with basic inputs.
- Reach 30 km/h
- Make a 90° turn
- Come to complete stop

### Parking Training (120 seconds)
Practice positioning your vehicle in a parking spot.
- Position car correctly
- Avoid hitting boundaries
- Park smoothly and safely

### Lane Changes (90 seconds)
Master changing lanes while maintaining safety.
- Complete 3 lane changes
- Avoid collisions
- Maintain proper spacing

### Obstacle Course (120 seconds)
Navigate through a series of obstacles.
- Complete the entire course
- Avoid hitting any obstacles
- Minimize completion time

### Emergency Stop (90 seconds)
React quickly to sudden obstacles.
- Stop in time before collision
- Maintain vehicle control
- Quick reaction time

### Traffic Navigation (150 seconds)
Drive safely through traffic scenarios.
- Avoid collisions with other vehicles
- Follow traffic signals
- Stay within lane boundaries

## Game Features

✅ **Realistic Physics** - Accurate vehicle dynamics using Cannon.js
✅ **3D Graphics** - Beautiful rendered environments using Three.js
✅ **Real-time Feedback** - Instant feedback on driving mistakes
✅ **Score System** - Competitive scoring and rating system
✅ **Multiple Scenarios** - 6 unique training scenarios
✅ **Responsive Design** - Works on desktop and tablet
✅ **Educational** - Learn safe driving practices
✅ **No Installation** - Play directly in browser

## File Structure

```
fuzzy-train/
├── index.html          # Main HTML file
├── styles.css          # Styling and CSS
├── game.js             # Main game logic and physics
└── README.md           # Documentation
```

## How It Works

### Game Initialization
1. Player selects a training scenario
2. Game scene is created with Three.js
3. Physics world is initialized with Cannon.js
4. Player controls are set up

### Game Loop
1. Process player input (keyboard controls)
2. Update car physics and position
3. Check collision and game logic
4. Update score and feedback
5. Render scene with Three.js

### Physics Simulation
- Car mass: 1000 kg
- Realistic acceleration and deceleration
- Friction and damping applied
- Ground collision detection
- Vehicle-obstacle collision detection

## Customization

### Adjust Car Properties
Edit `carProperties` in `game.js`:
```javascript
const carProperties = {
    mass: 1000,              // Vehicle mass in kg
    width: 1.6,              // Vehicle width
    height: 2,               // Vehicle height
    depth: 4,                // Vehicle length
    maxSpeed: 50,            // Maximum speed in km/h
    acceleration: 0.3,       // Acceleration factor
    friction: 0.5,           // Friction coefficient
    turnSpeed: 3             // Steering sensitivity
};
```

### Add New Scenarios
1. Add scenario definition in `scenarios` object
2. Create scenario setup function
3. Add update logic for scoring
4. Test and refine

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Good performance |
| Safari | ✅ Full | WebGL required |
| Edge | ✅ Full | Good performance |
| IE 11 | ❌ No | Not supported |

## Performance Tips

- Use Chrome or Firefox for best performance
- Close other applications for smoother gameplay
- Ensure WebGL is enabled in browser
- Update graphics drivers for better rendering

## Future Enhancements

- [ ] Multiplayer support
- [ ] Advanced weather conditions
- [ ] More realistic vehicle models
- [ ] Customizable difficulty levels
- [ ] Leaderboard system
- [ ] Voice guidance for instructions
- [ ] Mobile/Touch controls
- [ ] VR support for immersive training

## Troubleshooting

### Game won't load
- Ensure browser supports WebGL
- Try a different browser
- Clear browser cache

### Low FPS / Laggy
- Close other applications
- Lower graphics quality (if available)
- Use Chrome or Firefox
- Update GPU drivers

### Controls not responding
- Ensure game canvas is focused (click on it)
- Check keyboard is working
- Try different keys

## Live Demo

Play the game directly: Open `index.html` in your browser!

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests for:
- Bug fixes
- New features
- Performance improvements
- Documentation updates

## Contact & Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Driving! 🚗💨**

Learn safe driving practices in a fun, interactive environment!

**Created by**: ahmad1465lat-stack
**Repository**: https://github.com/ahmad1465lat-stack/fuzzy-train