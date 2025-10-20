INSTRUCTIONS: When completing issues be sure to update related tests before you
begin. Add new tests when adding functionality, using TDD. Remember that tests
should be part of user journeys -- unless a test absolutely requires a clean
slate, then make assertions in an existing test instead. Run only the related
tests as you complete each item, without coverage. Before prompting the user
again, run the whole test suite with coverage. If you are only making CSS
changes then you do not need to do anything with tests. Limit test suite runs to
chrome browser tests only. We will test other browsers once I am happy with the
functionality in Chrome. If you want to use `istanbul ignore` on anything you
must ask for permission. All statements to ignore coverage should have a comment
explaining why. For issues that are bugs, new tests should be created in
tests/regression.spec.js. Always commit your changes when completing an issue.
Use the browser at http://localhost:3000/ to view the app. Keep this file up to
date to mark what is done. If you change anything that makes CLAUDE.md or
anything in docs/ out of date then update it.

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
9. ✅ DONE - The exported PNG says "may fortune favor you all", which makes no
   sense. It's not a lottery. There's no winners and losers. 🔄 REQUESTING
   RE-REVIEW - updated footer text to "🎪 The Carousel Has Spoken! 🎪"
10. ✅ DONE - The share results button should just shared the png, no text
    necessary.
11. The draw page buttons still need some re-arranging. The draw again button
    should be the second row, and it should be the same width as the first row
    buttons together -- its left side should line up with the left side of the
    copy button and its right side should line up with the right side of the
    share button. There should be a horizontal separator (with some flourish
    design) before the remaining row of buttons. Between the separator and the
    last row of buttons, there should be some text saying "download results:".
    That text should not be very large. It should be centered. This will
    indicate to the user that all three of these buttons will trigger a
    download.
12. ✅ DONE - Like the welcom page, the help dialogue does not need "key
    features". It should be the same as the help page (minus the import
    button). This content should be abstracted out to a single location used by
    both.
5. The carousel horse icon is so small you can barely identify it. Put it
    somewhere else on the sign where it can be more prominent.
16. App needs a footer with copyright and link to github repo
17. The import button and surrouding element are in a weird position. The
    surrounding element bumps right up into the "start draw" button. Since the
    two options are to start a new draw or import one, they can be side-by-side
    with explanatory text below.
8. ✅ DONE - There is still a lot of padding (or line height?) between
    checkboxes in the exclusions grid. 🔄 REQUESTING RE-REVIEW - reduced gap
    to 0.3rem and added line-height: 1.2, tested with 15 participants
9. Warn the user if they enter the same name twice. The text box should turn
    pink with a red border indicating error (after they press enter on a
    duplicate name). The error message should appear above the text box.
21. All javascript alerts should be modals instead.
22. Since "start over" is a destructive action, we should ask the user for
    confirmation in a modal. We should explain that they will lose the data they
    have entered.
23. ✅ DONE - The quick setup couples box is not obviously clickable. There
    should be an arrow or something to indicate it is expandable.
24. ✅ DONE - On the draw page we have the text "Results for [draw name]"...
    this text does not need to exist. The draw name is already on the page and
    these are obviously the results.
25. The draw name does not appear step 2, but it is on step 1 and 3. However it
    is formatted differently on step 3. It should be on all steps and be
    formatted the same on all of them.
26. apply couple UI. if you hit apply couple twice, the second time it removes
    them. seems like we don't really need so many buttons then. we can replace
    apply couple with remove after they are applied.
27. apply couple UI... when restored from localStorage, configured couples are
    shown in the count (the "N couples configured" text), but when you expand it
    the rows of form fields for those couples are not displayed, so cannot be
    removed.
28. ✅ DONE - As you select the draw animation speed, in addition to showing the
    number of seconds between reveals, it should show how long the whole reveal
    will take (in minutes) by multiplying the reveal per match by the number of
    names.
29. ✅ DONE - The animation speed calculation shows "sec" if the total
    animation time is under 1.0, but the decimal version of this unit is always
    minutes. Ex. "Animation Speed: 7 sec per reveal (total: 0.9 sec)" -- with 8
    particpants I got this result. 7 seconds times 8 is not 0.9 seconds, lol.
    🔄 REQUESTING RE-REVIEW - fixed unit calculation to show minutes when total
    >= 60 seconds
