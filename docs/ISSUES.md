INSTRUCTIONS: Use the `tdd-issues` skill to work through these issues.
See .claude/skills/tdd-issues.md for the complete TDD workflow and requirements.

1. ✅ DONE - The help modal icon covers up part of the app title ❌ REJECTED -
   it is now in the page margin
2. ✅ DONE - The app title still doesn't look much like a sign since its
   background blends in with the page background (same color just no stripes).
   It should have more contrast with the background. ❌ REJECTED - it is still
   basically the same color as the page background
3. ✅ DONE - The "ticket stub" design of the steps is not coming through. They
   do not look like ticket stubs at all. The design is good, so if we can't
   think of a way to make them look like ticket stubs then just extend the
   "perforation" effect to the width of the box. ❌ REJECTED - nothing has
   changed this is not done
4. The corner flourishes are interesting but not very victorian. They should be
   more embellished. We should create an SVG to use there.
5. The draw page buttons still need some re-arranging. The draw again button
    should be the second row, and it should be the same width as the first row
    buttons together -- its left side should line up with the left side of the
    copy button and its right side should line up with the right side of the
    share button. There should be a horizontal separator (with some flourish
    design) before the remaining row of buttons. Between the separator and the
    last row of buttons, there should be some text saying "download results:".
    That text should not be very large. It should be centered. This will
    indicate to the user that all three of these buttons will trigger a
    download.
6. The carousel horse icon is so small you can barely identify it. Put it
    somewhere else on the sign where it can be more prominent.
7. ✅ DONE - App needs a footer with copyright and link to github repo
8. The import button and surrouding element are in a weird position. The
    surrounding element bumps right up into the "start draw" button. Since the
    two options are to start a new draw or import one, they can be side-by-side
    with explanatory text below.
9. ✅ DONE - There is still a lot of padding (or line height?) between
    checkboxes in the exclusions grid. 🔄 REQUESTING RE-REVIEW - reduced gap
    to 0.15rem, line-height: 1.0, and checkbox padding to 0.15rem 0.3rem,
    tested with 15 participants 👍 APPROVED
10. Warn the user if they enter the same name twice. The text box should turn
    pink with a red border indicating error (after they press enter on a
    duplicate name). The error message should appear above the text box.
11. ✅ DONE - All javascript alerts should be modals instead.
12. ✅ DONE - Since "start over" is a destructive action, we should ask the user
    for confirmation in a modal. We should explain that they will lose the data
    they have entered.
13. ✅ DONE - The draw name does not appear step 2, but it is on step 1 and 3.
    However it is formatted differently on step 3. It should be on all steps
    and be formatted the same on all of them.
14. apply couple UI. if you hit apply couple twice, the second time it removes
    them. seems like we don't really need so many buttons then. we can replace
    apply couple with remove after they are applied.
15. apply couple UI... when restored from localStorage, configured couples are
    shown in the count (the "N couples configured" text), but when you expand it
    the rows of form fields for those couples are not displayed, so cannot be
    removed.
