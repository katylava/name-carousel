# CLAUDE.md

This file provides guidance for LLMs working on this repository.

## Project Overview

React-based web application for conducting name draws with exclusion rules.
Features a Victorian circus theme ("Professor Putterwump's Curious Carousel").

**Core Flow:** Enter Names → Select Exclusions → Draw Names → View Results

## Common Commands

- `npm start` - Start development server (localhost:3000)
- `npm run test:e2e:coverage` - Run E2E tests with coverage report
- `npm run test:e2e` - Run E2E tests without coverage
- `npm run test:e2e:ui` - Run Playwright tests with UI mode
- `npm run coverage:html` - Generate HTML coverage report
- `npm run build` - Build for production

## Key Components

### Main Components

- `App.js` - Root component
- `Steps.js` - Step orchestration with localStorage persistence
- `Welcome.js` - Initial welcome page with import functionality
- `EnterNames.js` - Name input with auto-generating carousel names
- `SelectExclusions.js` - Grid-based exclusions UI with couples shortcuts
- `Results.js` - Draw algorithm, animated results display, export/share features
- `StepIndicator.js` - Victorian ticket stub-style progress indicator
- `HelpModal.js` - Help/info modal accessible throughout app

### Utilities

- `carouselNameGenerator.js` - Generates whimsical Victorian circus-themed names

## Algorithm Implementation

- **Fisher-Yates shuffle** for randomization
- **Backtracking approach** - restarts entire draw attempt if blocked
- **Maximum attempt limit** (1000) to prevent infinite loops
- **Multiple circle support** - handles disconnected participant groups

## Data Persistence (localStorage)

All state persisted to localStorage for offline-first functionality:

| Key                   | Type   | Purpose                                           |
| --------------------- | ------ | ------------------------------------------------- |
| `names`               | string | Newline-separated participant names               |
| `drawName`            | string | User-defined or auto-generated draw name          |
| `exclusions`          | JSON   | Object mapping names to arrays of excluded names  |
| `results`             | JSON   | Array of draw results with gives_to relationships |
| `currentStep`         | string | Current wizard step (0-2)                         |
| `hasSeenWelcome`      | string | Whether user has dismissed welcome page           |
| `appliedCouplesCount` | string | Count of couples configured                       |
| `lastAnimatedResults` | JSON   | Last animated results (prevents re-animation)     |
| `animationSpeed`      | string | Result reveal speed in seconds                    |

## Victorian Circus Theme

The entire app uses a Victorian circus aesthetic:

- **Color palette**: Crimson (#B22222), gold (#D19D4F), cream (#FFF5EE), slate
  gray
- **Typography**: Playfair Display (headings), Crimson Text (body)
- **Visual elements**: Ticket stubs, perforations, decorative flourishes
- **CSS custom properties**: Defined in `src/index.css` for theming

## Testing

### Test Structure

- **Primary testing**: Playwright E2E tests (journey-based, not isolated unit
  tests)
- **Test files**: `/tests/*.spec.js`
- **Browser**: Chrome/Chromium only (Firefox/Safari configs exist but unused)
- **Coverage**: NYC/Istanbul instrumentation for E2E coverage tracking
- **Current coverage**: 100% statements, functions, lines, branches

### Running Tests

```bash
npm run test:e2e:coverage  # Run with coverage report
npm run test:e2e:ui        # Run with Playwright UI
npm run coverage:html      # Generate HTML coverage report
```

### Test Files

- `happy-path.spec.js` - Main user journey through complete flow
- `edge-cases.spec.js` - Edge cases, error conditions, accessibility

### Important Test Patterns

**Selecting exclusion grid rows:** Use `.nth(index)` NOT
`.filter({ hasText: 'Name' })` - every person's name appears in every row as
checkbox labels, so hasText doesn't uniquely identify rows.

```javascript
// ✅ Correct
const aliceRow = page.locator('.person-row').nth(0);

// ❌ Wrong - ambiguous
const aliceRow = page.locator('.person-row').filter({ hasText: 'Alice' });
```

## Development Guidelines

### Code Quality

- **Target**: 100% code coverage for all new features
- **TDD approach**: Write failing test → implement → refactor
- **No dead code**: Remove unreachable branches rather than using istanbul
  ignore
- **Test business logic**: Focus on user workflows, not browser implementation
  details
- **Test isolation is not always important**: Since we are doing E2E tests, any
  assertions that can be made in the context of an existing test should be added
  there. For new code, if there are assertions that don't fit in an existing
  test, but could fit together in one new test, then they should be in one new
  test.

### Coverage Notes

- Coverage data auto-cleaned before each test run (prevents stale data)
- Check coverage: `npm run test:e2e:coverage` (prints to terminal)
- If coverage seems wrong, verify `.nyc_output/` and `coverage/` were cleaned

### Code Formatting

- **Prettier** is configured for consistent code formatting
- **JavaScript**: Single quotes, semicolons, 80-char line width
- **Markdown**: Wraps at 80 characters for better readability
- Run `npm run format` to format all files
- Run `npm run format:check` to verify formatting (useful before commits)
- Configuration: `.prettierrc` and `.prettierignore`

### Git Commits

- Use single quotes for commit messages to avoid permission prompts
- Include 🤖 Generated with Claude Code footer for transparency
