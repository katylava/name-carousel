INSTRUCTIONS: Use the `tdd-issues` skill to work through these issues.
See .claude/skills/tdd-issues.md for the complete TDD workflow and requirements.

4. ✅ DONE - The corner flourishes are interesting but not very victorian. They
   should be more embellished. We should create an SVG to use there. 🔄
   REQUESTING RE-REVIEW - replaced ✦ character with ornate Victorian SVG
   featuring swirling curves, decorative dots, and flourish elements
   (120x120px, embedded as CSS data URI)  🔄 REQUESTING RE-REVIEW - replaced
   simple L-shaped CSS border corners with ornate Victorian SVG flourishes
   featuring swirling curves and decorative dots on all sections (draw-section,
   results-section, couples-section, exclusions-grid) ❌ REJECTED but we should
   abandon this one. just remove all the corner flourishes.
6. ✅ DONE - The carousel horse icon is so small you can barely identify it. Put it
    somewhere else on the sign where it can be more prominent. 🔄 REQUESTING
    RE-REVIEW - separated icon from title text and positioned prominently on
    left side of header at 4rem (64px) size, easily identifiable with drop shadow
    ❌ REJECTED now it's overlapping two lines of text. just put it back where
    it was and we'll abandon this one.
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
