# Resolve Frontend Design

## Visual Identity

**Mood:** Warm, encouraging, emotionally safe - like a supportive friend, not a drill sergeant. Dark mode first with soft ambers and corals.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#121212` | App background |
| `--bg-surface` | `#262220` | Cards, elevated elements |
| `--bg-surface-hover` | `#302c28` | Interactive hover states |
| `--accent-amber` | `#E8A850` | Progress, completions, rewards |
| `--accent-coral` | `#D4836A` | CTAs, action prompts |
| `--text-primary` | `#F5F0EB` | Main text (warm off-white) |
| `--text-secondary` | `#9A9590` | Supporting text |
| `--text-disabled` | `#5A5550` | Inactive states |

### Typography

- **Headlines/goal titles:** Outfit (600/700 weight) - rounded geometric, warm personality
- **Body/actions:** Inter (400/500 weight) - humanist sans, clean readability
- **Scale:** 14px body, 18px subheads, 24px+ headlines

### Cards

- Border radius: 14px
- Background: `--bg-surface` with subtle warm-tinted shadow
- Shadow: `0 4px 12px rgba(30, 25, 20, 0.4)`
- Hover/press: slight lift + shift to `--bg-surface-hover`

---

## Layout Architecture

### Navigation

**Pattern:** Contextual home-base

- Today view is the default/home screen
- Top bar: app icon (left), "Today" title (center), Goals + Settings icons (right)
- Other views one tap away, not competing tabs

### Today View Structure

```
┌─────────────────────────────────────┐
│  Top Bar (minimal)                  │
│  ┌─────┐              ┌───┐ ┌───┐  │
│  │ Logo│  "Today"     │ 📊│ │ ⚙️ │  │
│  └─────┘              └───┘ └───┘  │
├─────────────────────────────────────┤
│  Today's Focus (sticky)             │
│  ┌─────────────────────────────────┐│
│  │ "3 actions today"               ││
│  │ ○ Run 3x this week (1/3)    [+] ││
│  │ ○ Review budget             [+] ││
│  │ ○ Call mom                  [+] ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  Goals (scrollable)                 │
│  ┌─────────────────────────────────┐│
│  │ ◐ Run a 5K           78%       ││
│  │   "I am becoming a runner"     ││
│  │   ● ● ◐ ○  (past 4 weeks)     ││
│  │   ─────────────────────────    ││
│  │   ○ Run 3x this week (1/3)     ││
│  │   ○ Interval session (0/1)     ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ ◐ Financial clarity    45%     ││
│  │   ...                          ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Today's Focus Section

- Sticky at top while scrolling goals
- Shows only actions needing attention today (incomplete, relevant this week)
- Pulled from all goals, max 4-5 items shown ("+2 more" if exceeded)
- Coral accent on tap targets - the "do this" prompt
- Completing here updates the goal card below in real-time

### Goal Cards

- Progress ring (amber fill) + percentage on the right
- Identity statement in muted text below title (if set)
- Past weeks as 4 small dots: ● filled, ◐ partial, ○ missed (all in muted amber tones)
- Actions listed with tap-to-complete, showing progress (1/3)

### Handling 5+ Goals

- Goals scroll vertically, no hard limit
- Sticky "Today's Focus" keeps daily interaction fast regardless of goal count
- Users with many goals still get the quick "open, complete, close" experience

---

## Goals View

Accessed via icon in top bar. Full management of cycle and goals.

```
┌─────────────────────────────────────┐
│  ← Back         Goals        [+ Add]│
├─────────────────────────────────────┤
│                                     │
│  Cycle: "Q1 2025"                   │
│  Week 7 of 12 · Ends Mar 24         │
│  ████████████░░░░░░  58% complete   │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ ◐ Run a 5K               78%   ││
│  │ "I am becoming a runner"       ││
│  │                                ││
│  │ Weekly Actions                 ││
│  │   ○ Run 3x · ○ Intervals      ││
│  │                                ││
│  │ Milestones                     ││
│  │   ✓ Complete C25K Week 4       ││
│  │   ○ Register for local 5K     ││
│  │                            [⋮] ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

**Differences from Today View:**
- Shows cycle context at top (which week, overall progress)
- Goal cards expanded by default (full detail)
- Milestones visible (hidden in Today view to reduce noise)
- Edit actions via [⋮] menu: edit goal, reorder, archive
- [+ Add] for new goals (warns if exceeding 4)

---

## Progress Visualization

**Core principle:** No streaks, ever. Trends only.

### Progress Ring

- Amber fill showing completion percentage
- 0% shows warm muted amber outline (not gray/empty - says "ready when you are")
- Animates smoothly when completing actions

### Past Weeks Indicator

4 small dots below each goal showing recent history:
- ● Filled - good week (solid amber)
- ◐ Partial - some progress (half amber)
- ○ Missed - no progress (muted warm outline, not punishing gray)

### Weekly Score

- Rolling percentage: "73% over the last 4 weeks"
- Never "you missed X days"

---

## Interactions & Micro-animations

### Completing an Action

1. Tap the circle or anywhere on the action row
2. Circle fills with amber, ring pulses outward (soft glow, 200ms)
3. Subtle haptic tap (iOS: light, Android: tick)
4. Count updates: "(1/3)" → "(2/3)"
5. If completed (3/3): row subtly dims, checkmark appears, item fades to bottom
6. Progress ring on goal card animates to new percentage

### Today's Focus ↔ Goal Card Sync

- Completing in focus section: goal card ring updates live
- Completing in goal card: item disappears from focus section with soft fade-out

### Card Interactions

- Tap goal card (outside actions): expands to show all actions, milestones, notes
- Long-press: quick actions menu (edit, add action, focus mode)
- Swipe action row left: reveal "skip this week" option (muted, non-punishing)

### Transitions

- View changes: horizontal slide (300ms ease-out)
- Cards entering: fade up + scale from 0.97 (staggered 50ms)
- Modal/sheets: slide up from bottom with backdrop fade

### Empty/Zero States

- 0% ring: warm muted amber outline (not gray/empty)
- No actions today: "Nothing on deck today. Enjoy the space."
- All complete: ring fills, message: "You showed up today." with subtle confetti (optional, can disable)

---

## Weekly Review

### Entry Point

- Top bar icon pulses gently with coral dot on review day (user-configured)
- Tapping opens full-screen sheet sliding up from bottom

### Quick Mode (60-90 seconds)

```
┌─────────────────────────────────────┐
│  Week 7 Review              [Done]  │
├─────────────────────────────────────┤
│                                     │
│  Your week: 73%                     │
│  ████████████░░░░░  (amber bar)     │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ ✓ Run a 5K              3/4    ││
│  │ ✓ Financial clarity     2/3    ││
│  │ ○ Learn Spanish         0/2    ││
│  └─────────────────────────────────┘│
│                                     │
│  "What got in the way?"             │
│  ┌─────────────────────────────────┐│
│  │ (optional text area)            ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │    Plan next week    [coral]   ││
│  └─────────────────────────────────┘│
│                                     │
│  "Skip to next week →" (muted link) │
└─────────────────────────────────────┘
```

### Key Design Choices

- Auto-calculated score shown immediately (no manual tallying)
- Per-goal breakdown shows completion fraction
- Missed goals shown with ○ not ✗ (curious, not punishing)
- Reflection prompt is optional - visible but skippable
- "Plan next week" is the primary CTA (coral button)
- Can skip entirely with muted link (no guilt)

### Plan Next Week Flow

- Shows each goal with its recurring actions pre-filled
- User can adjust targets: "Run 3x → Run 2x" (life happens)
- Can add one-time actions for the week
- Confirm → returns to Today view

### Deeper Mode (Premium)

- Additional prompts: "What worked?", "What will you try differently?"
- Reflection history visible (past weeks' notes)
- Trends graph showing 4-week rolling average

---

## Notifications & Reminders

### Tone

Warm, conversational, never shaming. Always actionable.

### Daily Check-in

- Push notification at user-configured time
- Message: "Your 3 actions are waiting" (actual count)
- Tapping opens directly to Today view
- If all complete already: no notification sent

### Weekly Review Nudge (Escalating)

| Timing | Message |
|--------|---------|
| Review day, morning | "Ready for your Week 7 review?" |
| Review day, evening | "Still time to check in on your week" |
| Day after (if missed) | "Quick catch-up? It takes 60 seconds" |
| 2+ days (final) | "Week 7 is in the books. Start fresh?" |

### Settings

```
Daily reminder         [9:00 AM  ▼]
Weekly review day      [Sunday   ▼]
Email summaries        [Off      ▼]  (Premium)

[ ] Celebration when all complete
    (shows confetti, can disable)
```

---

## Component Structure

```
src/
  styles/
    tokens.css          # CSS custom properties (colors, spacing, shadows)
    typography.css      # Font imports, type scale
  components/
    Card/               # Base card component with warm elevation
    ProgressRing/       # Animated SVG ring with amber fill
    ActionItem/         # Tap-to-complete row with pulse animation
    TodayFocus/         # Sticky focus section
    GoalCard/           # Full goal card with ring, dots, actions
    WeekDots/           # Past 4 weeks indicator
    WeeklyReview/       # Review bottom sheet
    PlanWeek/           # Plan next week flow
  views/
    Today/              # Home view with focus + goals
    Goals/              # Goals management with cycle context
    Settings/           # Profile & notification preferences
```

---

## Design Principles Checklist

Every component should be validated against these ADHD-friendly principles:

- [ ] **Reduce friction** - Can this be done in fewer taps? Are defaults smart?
- [ ] **Prevent forgetting** - Is the reminder helpful, not nagging?
- [ ] **Avoid shame** - Does the empty/missed state feel curious, not critical?
- [ ] **Reduce overwhelm** - Is only what's needed visible? Can more be hidden?
