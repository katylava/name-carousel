# TDD Issues Reference

Detailed reference for the TDD Issues workflow.

## Commit Message Format

Follow the format specified in CLAUDE.md:

```bash
git commit -m "$(cat <<'EOF'
[Concise commit message describing the change]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**Requirements:**
- Use single quotes around the outer `$()` to avoid permission prompts
- Use HEREDOC format for proper multi-line formatting
- First line: Concise description focusing on "why" not "what"
- Include the 🤖 footer for transparency
- Commit message should accurately reflect the changes and their purpose

**Examples:**
- `Warn user when duplicate names entered`
- `Add Victorian-style SVG corner flourishes`
- `Move help icon to page margin`

## Issue Management

### Issue Status Markers

- **No markers**: Issue not started yet
- **✅ DONE**: Issue has been completed and committed
- **❌ REJECTED**: User has rejected the implementation, needs rework
- **🔄 REQUESTING RE-REVIEW**: Issue was rejected but has been fixed
- **👍 APPROVED**: User has approved the implementation (only user can add this)

### When Completing an Issue

**For new issues (not previously marked):**
- Add `✅ DONE` to the issue line
- Do NOT add 👍 APPROVED (only user can approve)

**For rejected issues being fixed:**
- Remove `❌ REJECTED`
- Add `🔄 REQUESTING RE-REVIEW`
- Keep `✅ DONE`

**For approved issues:**
- Delete the entire issue from ISSUES.md
- This should be done during pre-flight checks

### Example ISSUES.md Updates

**Before:**
```
1. ✅ DONE - Help modal icon covers app title ❌ REJECTED - it is now in the page margin
2. ✅ DONE - App needs footer with copyright and link 👍 APPROVED
3. Warn user if they enter the same name twice
4. ✅ DONE - App title doesn't have enough contrast 🔄 REQUESTING RE-REVIEW - increased contrast
```

**After fixing issue 1 and issue 3:**
```
1. ✅ DONE - Help modal icon covers app title 🔄 REQUESTING RE-REVIEW - moved icon to top-right corner
3. ✅ DONE - Warn user if they enter the same name twice
4. ✅ DONE - App title doesn't have enough contrast 🔄 REQUESTING RE-REVIEW - increased contrast
```

Note: Issue 2 was deleted because it was APPROVED (done during pre-flight).
Note: Issues 3 and 4 kept their original numbers

## Test Organization

### Bug Fixes and Regressions
Place in `tests/regression.spec.js`:
- Tests for bugs discovered after initial implementation
- Tests that prevent regressions
- Tests for edge cases found in production

### New Features
Add to appropriate existing test file or create new file:
- `tests/happy-path.spec.js` - Main user journeys
- `tests/edge-cases.spec.js` - Edge cases, error conditions, accessibility

### Test Isolation
Per CLAUDE.md: "Test isolation is not always important"
- E2E tests can build on each other
- Add assertions to existing tests when possible
- Create new tests only when assertions don't fit existing flows

### Test Naming Convention
- Use descriptive test names that explain the user journey
- Include "why" not just "what": `test('warns user when entering duplicate name to prevent confusion', ...)`
- Do not reference issue number in test

## Coverage Requirements

100% coverage is mandatory for ALL of:
- Statements
- Functions
- Lines
- Branches

### If Coverage Drops:
1. STOP immediately
2. Identify uncovered code
3. Add tests to cover missing branches/statements
4. Re-run full test suite
5. Only commit when 100% coverage restored

### Never Use Istanbul Ignore
Per CLAUDE.md: "No dead code: Remove unreachable branches rather than using istanbul ignore"
- If code appears unreachable, remove it
- If code IS reachable, write a test for it
- Ask user for permission if you think istanbul ignore is truly needed

## Browser DevTools Usage

Use Chrome DevTools MCP tools for:
- **Visual verification** of CSS changes
- **Taking screenshots** to show changes to user
- **Testing interactive features** (modals, buttons, forms)
- **Checking responsive behavior** at different viewport sizes

### Navigation Pattern:
```javascript
// Navigate to page
mcp__chrome-devtools__navigate_page(url: 'http://localhost:3000')

// Take snapshot to see current state
mcp__chrome-devtools__take_snapshot()

// Interact with elements
mcp__chrome-devtools__click(uid: '...')
mcp__chrome-devtools__fill(uid: '...', value: '...')

// Take screenshot to document changes
mcp__chrome-devtools__take_screenshot()
```

## Git Workflow

### Pre-Commit Checklist:
1. All tests pass (`npm run test:e2e:coverage`)
2. Coverage is 100%
3. No unintended files staged
4. Commit message follows format (single quotes, HEREDOC, footer)

### Working Directory States:
- **Clean**: Ideal state between issues
- **Modifications**: Expected during work on an issue
- **Untracked files**: Acceptable if they're intentional (new test files, etc.)

### If Git State is Messy:
- STOP and ask user before proceeding
- Don't automatically git reset or clean
- User may have intentional uncommitted work

## Project-Specific Context

### File Locations:
- Components: `src/` (App.js, Steps.js, EnterNames.js, etc.)
- Styles: `src/App.css`, `src/index.css`
- Tests: `tests/*.spec.js`
- Documentation: `docs/ISSUES.md`, `CLAUDE.md`

### Key Technologies:
- React (functional components, hooks)
- Playwright (E2E testing)
- NYC/Istanbul (coverage)
- localStorage (persistence)

### Theme:
Victorian circus aesthetic - keep this in mind for all UI changes:
- Colors: Crimson (#B22222), gold (#D19D4F), cream (#FFF5EE)
- Typography: Playfair Display (headings), Crimson Text (body)
- Visual elements: Ticket stubs, perforations, decorative flourishes
