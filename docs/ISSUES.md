INSTRUCTIONS: Use the `tdd-issues` skill to work through these issues.
See .claude/skills/tdd-issues.md for the complete TDD workflow and requirements.

9. ✅ DONE - In the apply couple UI, if you hit apply couple twice, the second time it removes
    them. seems like we don't really need so many buttons then. we can replace
    apply couple with remove after they are applied. ❌ REJECTED there are
    still two buttons for each couple row. i think the one labeled "x" is there
    so you can remove a row without first clicking "Apply Couple". instead
    let's change the original issue. Let's have a trash can icon for the remove
    action (NOT a button, just a small icon). The apply couple button will
    exist after you click "Add Couple" or "Add Another Couple". After you click
    "Apply Couple" that button can disappear. The trash can icon action can
    always be present for each row. ✅ DONE - Replaced delete button with trash
    can icon (🗑️) that is always visible. Apply Couple button now disappears
    after applying. Trash icon deletes row and removes exclusions if applied.
    Includes keyboard accessibility (Enter/Space keys).
14. ✅ DONE - Disable the Next button on step 1 (Enter Names) if fewer than 3 names have
    been entered. This will prevent impossible draw scenarios. Note: We need a
    way to bypass this restriction in the test environment since we have a test
    that uses 2 participants to verify bidirectional assignment prevention.
    ❌ REJECTED - the button is disabled but does not appear disabled to the
    user. just makes teh site look broken. the button UI should indicate it is
    disabled and next to the button (when disabled) it should say "enter at
    least 3 names to continue). ✅ DONE - Added visual disabled state with reduced
    opacity and gray background. Message "(enter at least 3 names to continue)"
    appears next to button when disabled. Message disappears when ≥3 names entered.
15. ✅ DONE - When you remove a couple after applying, the exclusions aren't removed.
    Fixed as part of issue 9. The handleDeleteCouple function now removes
    exclusions when deleting an applied couple. Test coverage added to verify
    exclusions are removed when trash icon is clicked on applied couple.
