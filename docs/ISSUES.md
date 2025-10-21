INSTRUCTIONS: Use the `tdd-issues` skill to work through these issues.
See .claude/skills/tdd-issues.md for the complete TDD workflow and requirements.

10. In apply couple UI... when restored from localStorage, configured couples are
    shown in the count (the "N couples configured" text), but when you expand it
    the rows of form fields for those couples are not displayed, so cannot be
    removed.
11. Start over modal buttons have low contrast, can't read text well. Use
    colors we use on other buttons.
12. The PNG does not display the results in carousel order like the web page
    does.
13. MAJOR BUG: I got results like this:
    alice → charlie
    bob → dana
    charlie → evan
    dana → bob
    evan → fran
    fran → alice
    --
    Notice bob->dana and dana->bob. This is strictly not allowed to happen!
