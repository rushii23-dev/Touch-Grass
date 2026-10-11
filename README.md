# 🌿 Touch Grass

> **A screen-free, mindful outdoor companion powered by web hardware APIs.**  
> Touch Grass is an anti-screen nature walking web application designed to help people disconnect from digital distractions and reconnect with the physical world.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-green?logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 🍃 Vision & Philosophy

Modern life pulls our focus toward glowing glass. **Touch Grass** reverses this dynamic:
1. **Calibrate Sensors**: Runs a sequential permission waterfall granting Hands-Free Microphone, Screen Wake Lock, and Pocket Gyroscope access.
2. **Pocket Mode Immersion**: Turns the screen **100% pitch black** (OLED true zero-emission pixels) while preventing device sleep.
3. **Gyroscope Boundary Protection**: If you pull your phone out and look at the screen (tilt angle shifts from pocket $\approx 85^\circ$ to viewing $\approx 35^\circ$), a gentle haptic buzz and ephemeral reminder prompts you to put it back.
4. **Pure Web Audio Resonance**: Synthesizes meditative harmonic singing bowl and chime frequencies client-side with zero audio file downloads.

---

## ⚙️ Core Architecture & Sensor Telemetry

### 1. Pocket Detection & Hysteresis State Machine
- **Pitch ($\beta$)**: Tracks device vertical tilt. Upright pocket: $+70^\circ \dots +90^\circ$, Inverted pocket: $-70^\circ \dots -90^\circ$. Viewing angle: $+15^\circ \dots +55^\circ$.
- **Hysteresis Smoothing**: Prevents noisy flicker during walking strides by requiring stable tilt thresholds over a 250ms debounce window.

### 2. Screen Wake Lock (`navigator.wakeLock`)
- Utilizes the Screen Wake Lock API to prevent mobile displays from timing out or locking while in your pocket, maintaining active audio processing.

### 3. Pure Web Audio Synthesizer
- Built using the Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`).
- Generates pure harmonic series tuned to an F# major pentatonic scale (370.0 Hz, 554.37 Hz, 739.99 Hz, 1108.73 Hz) with exponential decay envelopes.

### 4. Tactile Haptic Patterns
- Interacts with `navigator.vibrate` to produce distinct physical feedback rhythms:
  - `subtle_tap` (40ms): Calibration interaction.
  - `pocket_entry` (50ms - 60ms - 50ms): Entering pocket mode.
  - `screen_interrupt` (120ms - 80ms - 120ms): Screen viewed interruption alert.
  - `walk_complete`: Grounding celebration pulse.

---

## 🛠️ Project Structure

```text
src/
├── app/
│   ├── layout.tsx                # Obsidian theme metadata & viewport configuration
│   ├── page.tsx                  # Core session state machine & screen transitions
│   └── globals.css               # Kinetic animations & luxury minimalist styling
├── components/
│   ├── LandingPage.tsx           # Serene hero typography, cards, and walk CTA
│   ├── PermissionWaterfallModal.tsx # Sequential sensor calibration overlay
│   ├── PitchBlackScreen.tsx      # 100% OLED black immersion screen & HUD
│   ├── SensorSimulatorDrawer.tsx # Interactive desktop gyroscope tilt debugger
│   ├── BeginWalkButton.tsx       # Tactile walk trigger with breathing halo
│   ├── ChimeButton.tsx           # Ambient acoustic preview pill
│   ├── MinimalCard.tsx           # Obsidian card container with border luminance
│   ├── Header.tsx                # Brand header & crest
│   └── StatusDot.tsx             # Quiet telemetry health indicators
├── hooks/
│   ├── useDeviceOrientation.ts   # Gyroscope hook with debouncing & state transitions
│   ├── useWakeLock.ts            # Screen wake lock with useSyncExternalStore
│   └── useAudioStream.ts         # Live microphone ambient loudness analyzer
├── lib/
│   ├── audio/
│   │   ├── chimeSynthesizer.ts   # Harmonic Web Audio singing bowl synthesizer
│   │   ├── intervalBell.ts       # Periodic mindfulness interval bell scheduler
│   │   └── intervalBell.test.ts  # Audio timer unit test suite
│   ├── sensors/
│   │   ├── orientationClassifier.ts # Angle classification & hysteresis math
│   │   ├── permissionWaterfall.ts   # Sequential hardware permission runner
│   │   ├── hapticFeedback.ts        # Vibration pattern trigger
│   │   └── hapticFeedback.test.ts   # Haptic engine unit test suite
│   └── pwa/
│       └── registerServiceWorker.ts # Offline service worker registration
└── types/
    └── sensors.ts                # TypeScript sensor telemetry interfaces
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/rushii23-dev/Touch-Grass.git
cd Touch-Grass

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Checks
```bash
# TypeScript type check
npm run typecheck

# ESLint code style check
npm run lint

# Unit tests suite
npm test
```

---

## 🧪 Desktop Sensor Simulation (Dev Mode)

When developing on a desktop or laptop without real mobile gyroscopes:
- An interactive **Sensor Dev HUD** pill appears in the bottom right corner of the landing screen.
- Click it to toggle live simulated tilts:
  - 👖 **Vertical Pocket**: $\beta = 85^\circ$
  - 👀 **Face Viewing**: $\beta = 35^\circ$ (triggers screen look interrupt)
  - 👖 **Inverted Pocket**: $\beta = -85^\circ$
  - 🛋️ **Flat Table**: $\beta = 0^\circ$
- In **Pitch Black Mode**, press `'D'` on your keyboard or triple-tap the screen to open the developer HUD. Press `Escape` to end the walk.

---

## 🤝 Contributing

We welcome genuine contributions! Please check [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines, coding standards, and PR workflows.

---

## 📄 License

MIT © [rushii23-dev](https://github.com/rushii23-dev)
