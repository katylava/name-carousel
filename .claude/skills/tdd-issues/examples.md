# TDD Issues Examples

Example outputs and patterns for the TDD Issues workflow.

## Response Format for CSS-Only Changes

```
## Issue #X: [Issue Title]

**Status**: [New / Fixing rejected issue]
**Type**: CSS-only

### Files Read:
- src/App.css

### Changes Made:
[Describe the CSS changes made]

### Visual Verification:
[Screenshot and/or description of visual changes]
- Navigated to http://localhost:3000
- Verified [specific visual change]
- Screenshot shows [what changed]

### Committed:
[commit hash] - [commit message]

### ISSUES.md Updated:
[Show what changed in ISSUES.md - marking as DONE, requesting re-review, or noting approved issues deleted]

Continuing to next issue...
```

## Response Format for Non-CSS Changes

```
## Issue #X: [Issue Title]

**Status**: [New / Fixing rejected issue]
**Type**: Requires tests

### Files Read:
- src/ComponentName.js
- tests/test-file.spec.js

### Test Written:
[Describe the test - what it does, what it verifies]

File: tests/[filename].spec.js
- Test name: '[descriptive test name]'
- Purpose: [why this test exists, what user journey it validates]
- Expected behavior: [what should happen]

### Test Run (Should Fail):
```
npm run test:e2e

[Show test output demonstrating failure]
```

✓ Test fails for the correct reason: [explain why it's failing]

### Implementation:
[Describe code changes made]

Files modified:
- src/ComponentName.js: [what changed]
- [other files]: [what changed]

### Test Run (Should Pass):
```
npm run test:e2e

[Show test output demonstrating success]
```

✓ Test now passes

### Full Test Suite:
```
npm run test:e2e:coverage

[Show coverage output]
```

✓ All tests pass
✓ Coverage: 100% statements, 100% functions, 100% lines, 100% branches

### Committed:
[commit hash] - [commit message]

### ISSUES.md Updated:
[Show what changed - marking as DONE, requesting re-review, or noting approved issues deleted]

Continuing to next issue...
```

## Example: Complete CSS Issue

```
## Issue #1: Help modal icon covers up part of the app title

**Status**: Fixing rejected issue
**Type**: CSS-only

### Files Read:
- src/App.css

### Changes Made:
Moved the help modal icon to the top-right corner of the page using:
- position: absolute
- top: 1rem
- right: 1rem

Removed the previous positioning that was interfering with the title.

### Visual Verification:
Navigated to http://localhost:3000

Screenshot shows:
- Help icon now in top-right corner
- App title fully visible with no overlap
- Icon maintains Victorian styling

### Committed:
a1b2c3d - Fix issue 1: Move help icon to page margin

### ISSUES.md Updated:
Changed from:
`1. ✅ DONE - The help modal icon covers up part of the app title ❌ REJECTED - it is now in the page margin`

To:
`1. ✅ DONE - The help modal icon covers up part of the app title 🔄 REQUESTING RE-REVIEW - moved icon to top-right corner`

Also deleted issue #7 which was marked 👍 APPROVED during pre-flight checks.

Continuing to next issue...
```

## Example: Complete Non-CSS Issue

```
## Issue #10: Warn the user if they enter the same name twice

**Status**: New issue
**Type**: Requires tests

### Files Read:
- src/EnterNames.js
- tests/edge-cases.spec.js

### Test Written:
Added test to verify duplicate name warning functionality.

File: tests/regression.spec.js
- Test name: 'warns user when entering duplicate name to prevent confusion'
- Purpose: Validates that users cannot accidentally add the same person twice
- Expected behavior: Text box turns pink with red border, error message appears above text box

### Test Run (Should Fail):
```
npm run test:e2e

  1) warns user when entering duplicate name to prevent confusion
     Expected error message to be visible, but it was not found
```

✓ Test fails for the correct reason: duplicate detection not implemented yet

### Implementation:
Added duplicate name detection to EnterNames.js:

Files modified:
- src/EnterNames.js:
  - Added state for error: `const [duplicateError, setDuplicateError] = useState(false)`
  - Added check in handleAddName to detect duplicates
  - Added conditional className for error state
  - Added error message display above text box
- src/App.css:
  - Added .name-input-error class with pink background and red border

### Test Run (Should Pass):
```
npm run test:e2e -- tests/regression.spec.js

  ✓ warns user when entering duplicate name to prevent confusion (450ms)
```

✓ Test now passes

### Full Test Suite:
```
npm run test:e2e:coverage

  ✓ All tests passing (15 tests, 2m 34s)

Coverage summary:
  Statements   : 100%
  Branches     : 100%
  Functions    : 100%
  Lines        : 100%
```

✓ All tests pass
✓ Coverage: 100% statements, 100% functions, 100% lines, 100% branches

### Committed:
e4f5g6h - Fix issue 10: Warn user when duplicate names entered

### ISSUES.md Updated:
Changed from:
`10. Warn the user if they enter the same name twice...`

To:
`10. ✅ DONE - Warn the user if they enter the same name twice...`

Continuing to next issue...
```

## Example: When to STOP

```
## Issue #14: In the apply couple UI, if you hit apply couple twice...

**Status**: New issue
**Type**: Requires analysis

### Issue Analysis:
This issue description suggests changing the button behavior, but there are multiple possible approaches:

1. Replace "Apply Couple" button with "Remove Couple" button after application
2. Toggle the button text between "Apply" and "Remove"
3. Make the button a toggle that shows visual state
4. Hide the button entirely and show configured couples in a list

STOPPING: Multiple equally valid implementation approaches exist.

**Question for user:** Which approach would you prefer for the couple management UI?
```

## Example: Pre-Flight with Approved Issues

```
## Starting TDD Issues Workflow

### Pre-Flight Checks:

1. ✓ Dev server running at http://localhost:3000
2. ✓ Git working directory clean
3. ✓ No failing tests

### Cleaning Up Approved Issues:

Found 3 approved issues to delete:
- Issue #7: App needs a footer with copyright and link to github repo
- Issue #11: All javascript alerts should be modals instead
- Issue #12: Since "start over" is a destructive action, we should ask for confirmation

Updated docs/ISSUES.md to remove these issues.

Committed: x7y8z9a - Clean up approved issues from ISSUES.md

### Next Issue Identified:

Issue #1: The help modal icon covers up part of the app title (REJECTED - needs rework)

Proceeding with Issue #1...
```
