# TDD Issues Workflow

Work through docs/ISSUES.md systematically using strict Test-Driven Development.

## Process for Each Issue:

### Step 1: Identify Next Issue
- Read docs/ISSUES.md
- Find the next issue that needs work:
  - NOT marked as ✅ DONE, OR
  - Marked as ✅ DONE but ALSO marked as ❌ REJECTED (needs rework)
- Skip issues marked as 👍 APPROVED
- If no incomplete/rejected issues remain, report completion and stop

### Step 2: Analyze Issue Type
- Read the issue description carefully
- Determine: Is this a CSS-only change?
  - CSS-only = changes ONLY to src/App.css or other .css files
  - NOT CSS-only = any changes to .js/.jsx files or new functionality

### Step 3A: For CSS-Only Changes
1. **Implement**: Make the CSS changes
2. **Manual Verification**:
   - View the app at http://localhost:3000/ using browser tools
   - Take screenshots if helpful to show the changes
   - Explain what changed visually
3. **Commit**: Commit the CSS changes with descriptive message
4. **Update Documentation**:
   - If changes affect CLAUDE.md or docs/, update those files
   - Keep documentation in sync with code changes
5. **Update ISSUES.md**:
   - If issue was rejected: Remove ❌ REJECTED, add 🔄 REQUESTING RE-REVIEW, keep ✅ DONE
   - If new issue: Mark as ✅ DONE
   - Delete any issues marked as 👍 APPROVED from the file
6. **Continue**: Move to next issue immediately

### Step 3B: For Non-CSS Changes (STRICT TDD)
1. **Read Related Files**: Read all code files that will be affected
2. **Read Test Files**: Read all related test files
3. **Write Failing Test FIRST**:
   - Write a test that will fail because feature doesn't exist yet
   - For bug fixes: Create test in tests/regression.spec.js
   - For new features: Add to appropriate existing test or create new test
   - Explain what the test does
4. **Run Test - Verify Failure**:
   - Run `npm run test:e2e` (single test if possible) - Chrome/Chromium only
   - Confirm test fails for the RIGHT reason
   - If it passes unexpectedly, STOP and investigate
5. **Implement Code**:
   - Write MINIMAL code to make test pass
   - Only implement what's needed for this issue
6. **Run Test - Verify Success**:
   - Run the same test again
   - Confirm it now passes
7. **Run Full Test Suite**:
   - Run `npm run test:e2e:coverage`
   - Confirm all tests pass
   - Confirm coverage is 100% (all statements, functions, lines, branches)
8. **Commit**:
   - Commit test + implementation together
   - Use descriptive commit message
9. **Update Documentation**:
   - If changes affect CLAUDE.md or docs/, update those files
   - Keep documentation in sync with code changes
10. **Update ISSUES.md**:
   - If issue was rejected: Remove ❌ REJECTED, add 🔄 REQUESTING RE-REVIEW, keep ✅ DONE
   - If new issue: Mark as ✅ DONE
   - Delete any issues marked as 👍 APPROVED from the file
11. **Continue**: Move to next issue immediately

## ABSOLUTE RULES:

### NEVER:
- ❌ Implement code before writing the test (for non-CSS changes)
- ❌ Skip running tests after writing them
- ❌ Commit without running full test suite
- ❌ Mark issue as APPROVED (only user can approve)
- ❌ Batch multiple issues into one commit
- ❌ Continue if coverage is not 100%
- ❌ Continue if unexpected test failures occur

### ALWAYS:
- ✅ Write test FIRST (except CSS-only changes)
- ✅ Run tests after every change
- ✅ Commit each issue separately
- ✅ Update ISSUES.md immediately after commit
- ✅ Mark issues only as "✅ DONE"
- ✅ Include user journey context in test assertions

## When to STOP and Ask User:

1. Issue requirements are unclear or ambiguous
2. Test fails for unexpected reason
3. Cannot achieve 100% coverage after reasonable attempt
4. Multiple equally valid implementation approaches exist
5. Issue seems to conflict with existing functionality
6. Need to use `istanbul ignore` (requires permission)

## Issue Management:

### When Completing an Issue:
- **New issue**: Mark as ✅ DONE
- **Rejected issue being fixed**: Remove ❌ REJECTED, add 🔄 REQUESTING RE-REVIEW, keep ✅ DONE
- **Approved issues**: Delete from ISSUES.md entirely

### Example ISSUES.md Updates:

Before:
```
1. ✅ DONE - Issue description ❌ REJECTED - needs more work
2. ✅ DONE - Another issue 👍 APPROVED
3. Issue not started yet
```

After fixing issue 1 and working on issue 3:
```
1. ✅ DONE - Issue description 🔄 REQUESTING RE-REVIEW - made requested changes
3. ✅ DONE - Issue not started yet
```
(Issue 2 deleted because it was approved)

## Response Format for Each Issue:

```
## Issue #X: [Issue Title]

**Status**: [New / Fixing rejected issue]
**Type**: [CSS-only / Requires tests]

[For non-CSS:]
### Test Written:
[Describe the test]

### Test Run (Should Fail):
[Show test output]

### Implementation:
[Describe code changes]

### Test Run (Should Pass):
[Show test output]

### Full Suite:
[Show coverage results]

### Committed:
[Show commit hash]

### ISSUES.md Updated:
[Show what changed - marking as DONE, requesting re-review, or deleting approved]

Moving to next issue...
```

Continue this process until all issues are complete or you must stop.
