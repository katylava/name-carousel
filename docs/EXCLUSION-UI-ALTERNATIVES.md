# Exclusion UI Alternative Patterns

This document explores alternative UI patterns for the exclusion selection
interface, should the current grid-based approach become inadequate for larger
groups.

---

## Current State

The app currently uses a **grid-based exclusions interface** where each person
has checkboxes for every other participant. This works well for small groups
(3-10 people) but could become unwieldy with larger groups.

---

## Alternative UI Patterns

### Option A: Tag/Chip-Based Selection

**Pattern:** Each person has a search/autocomplete field where you add
exclusions as chips/tags.

**Pros:**

- ✅ Scales better to large groups
- ✅ Familiar pattern (similar to email recipients)
- ✅ Visual clarity: Clear list of exclusions per person

**Cons:**

- ❌ More clicks required
- ❌ Harder to see "big picture" of all exclusions at once

**Example libraries:**

- react-select
- Downshift
- MUI Autocomplete

---

### Option B: Drag-and-Drop Pairing

**Pattern:** Visual board with two columns - drag people from "available" to
"excluded" per person.

**Pros:**

- ✅ Intuitive, visual feedback
- ✅ Feels like organizing
- ✅ Good for touch devices, tablet-friendly

**Cons:**

- ❌ Takes more screen space
- ❌ Harder to implement accessibility

**Example libraries:**

- react-beautiful-dnd
- @dnd-kit/core

---

### Option C: Matrix/Table View Enhanced (Current + Enhancements)

**Pattern:** Keep grid but add enhancements like:

- Search/filter participants
- Bulk select (e.g., "exclude all family members")
- Visual grouping (collapsible sections by family/category)
- Symmetry helper (auto-check reciprocal exclusions)

**Pros:**

- ✅ Builds on existing familiar UI
- ✅ Shows all relationships at once
- ✅ Power user friendly: Can see and edit everything quickly

**Cons:**

- ❌ Still struggles with 20+ participants

---

### Option D: Hybrid Approach

**Pattern:** Default to tag-based for simplicity, with "Advanced View" button
for power users to see grid.

**Pros:**

- ✅ Best of both worlds
- ✅ Progressive disclosure: new users aren't overwhelmed, power users have full
  control
- ✅ Flexibility for different use cases

**Cons:**

- ❌ More complex to build and maintain
- ❌ Two UIs to test and support

---

## Recommendations

### For Current Version

**Keep current grid UI** as the default - it works well for the primary use case
of 5-15 people.

### Potential Enhancements

If user feedback indicates issues with the current approach:

1. **Add search/filter** box above grid
2. **Quick Actions** like:
   - "Exclude all except..."
   - "Copy exclusions from [person]"
3. **Visual indicator** showing exclusion count per person
4. **Symmetry toggle**: "Auto-apply reverse exclusions"

### For Future Consideration

- Consider hybrid approach if user feedback indicates need for better
  large-group support
- Could gate it based on participant count (grid for <15, tag-based for 15+)

---

## User Research Questions

Before implementing alternatives, gather data on:

1. What's the typical group size for your use cases?
2. Do most users set up reciprocal exclusions (couples)?
3. Do exclusions change year-to-year or stay mostly the same?
4. Would "exclusion templates" (preset groups) be helpful?
5. At what group size does the current UI become frustrating?
