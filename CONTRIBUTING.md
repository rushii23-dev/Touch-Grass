# Contributing to Touch Grass 🌿

Thank you for your interest in contributing to **Touch Grass**! We strive to maintain clean, accessible, zero-bloat code focused on digital wellness and mindfulness.

---

## 🧭 Principles & Guidelines

1. **Anti-Bloat & Zero-Distraction**:
   - Touch Grass has no tracking, no ad libraries, and minimal third-party dependencies.
   - Always favor standard browser Web APIs (`AudioContext`, `DeviceOrientationEvent`, `Screen Wake Lock`, `ServiceWorker`) over heavy npm packages.

2. **Commit Granularity & Conventional Commits**:
   - Each commit must represent a single, focused, well-tested logical change.
   - Follow standard prefixes:
     - `feat:` for new capabilities
     - `fix:` for bug fixes
     - `style:` for visual styling and design polish
     - `test:` for test additions and assertions
     - `docs:` for documentation updates
     - `refactor:` for code restructuring without behavioral change

3. **Code Quality Requirements**:
   - Ensure `npm run typecheck` passes with zero TypeScript errors.
   - Ensure `npm run lint` passes with zero ESLint warnings or errors.
   - Maintain full test coverage for mathematical classifiers and audio synthesizers.

---

## 🛠️ Local Development Workflow

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/rushii23-dev/Touch-Grass.git
   cd Touch-Grass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

4. Verify quality before committing:
   ```bash
   npm run typecheck
   npm run lint
   npm test
   ```

5. Push and submit a Pull Request!

---

Thank you for helping people touch grass and enjoy mindful outdoor moments.
