INSTRUCTIONS: Use the `tdd-issues` skill to work through these issues.
See .claude/skills/tdd-issues.md for the complete TDD workflow and requirements.

1. ✅ DONE - The help modal icon covers up part of the app title 🔄
   REQUESTING RE-REVIEW - moved to top-left corner inside header box (left:
   20px, top: 20px), balancing circus emojis in top-right
2. ✅ DONE - The app title still doesn't look much like a sign since its
   background blends in with the page background (same color just no stripes).
   It should have more contrast with the background. 🔄 REQUESTING RE-REVIEW -
   changed header gradient to warmer tan tones (#f5e6d3 to #ead5bd) for better
   contrast against cream page background
3. ✅ DONE - The "ticket stub" design of the steps is not coming through. They
   do not look like ticket stubs at all. The design is good, so if we can't
   think of a way to make them look like ticket stubs then just extend the
   "perforation" effect to the width of the box. 🔄 REQUESTING RE-REVIEW -
   extended perforation effect from 30% width to full width (left: 0, right:
   0) across all step boxes
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
7. The import button and surrouding element are in a weird position. The
    surrounding element bumps right up into the "start draw" button. Since the
    two options are to start a new draw or import one, they can be side-by-side
    with explanatory text below.
8. Warn the user if they enter the same name twice. The text box should turn
    pink with a red border indicating error (after they press enter on a
    duplicate name). The error message should appear above the text box.
9. IN the apply couple UI, if you hit apply couple twice, the second time it removes
    them. seems like we don't really need so many buttons then. we can replace
    apply couple with remove after they are applied.
10. In apply couple UI... when restored from localStorage, configured couples are
    shown in the count (the "N couples configured" text), but when you expand it
    the rows of form fields for those couples are not displayed, so cannot be
    removed.
11. Start over modal buttons have low contrast, can't read text well. Use
    colors we use on other buttons.
