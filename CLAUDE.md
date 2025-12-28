# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Resolve** is a goal achievement app combining 12 Week Year cycles, Atomic Habits behavioral science, and ADHD-friendly design patterns. It sits between simple goal lists and complex project management tools.

Key differentiators:
- Structured cycles (4/8/12 weeks) with hierarchical goals
- Trend-focused progress (no streaks or shame)
- 30-second daily interactions, flexible-depth weekly reviews
- Identity-based goal framing ("I am becoming...")

## Architecture

### Planned Tech Stack
- **Frontend**: React 18 + TypeScript, Vite, TailwindCSS, PWA with offline support
- **State**: Zustand or React Query
- **Backend**: Node.js + Express API
- **Database**: Supabase (PostgreSQL with row-level security)
- **Auth**: Supabase Auth (email + Google/Apple)
- **Notifications**: Web Push API, Supabase Edge Functions for scheduling

### Data Model Hierarchy
```
User → Cycles → Goals → Weekly Actions + Milestones
                    └→ Action Completions (per-week instances)
Weekly Reviews tie to specific weeks within cycles
```

### User Roles
- `free` - Default tier (1 cycle, 3 goals max)
- `premium` - Paid subscriber (unlimited cycles, 8 goals, analytics)
- `beta_tester` - Full access, no payment
- `admin` - Full access + admin capabilities

## Design Principles

These must inform every UX and implementation decision:

1. **Reduce friction ruthlessly** - One-tap interactions, smart defaults, no multi-step wizards for daily use
2. **Prevent forgetting with gentle nudges** - Scheduled notifications with graceful escalation
3. **Avoid shame, show trends not streaks** - Rolling averages, curious language ("What got in the way?" not "Why didn't you?")
4. **Constrain to reduce overwhelm** - Soft cap of 4 goals, only show current week's actions

## Project Status

This is a greenfield project. See `docs/plans/2025-12-28-resolve-design.md` for the complete design specification including MVP scope, data model details, and future roadmap.
