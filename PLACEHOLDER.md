## Status

The original #1664 (`feat(subagent): subagent/team observability with sync-layer refactor`) was closed in this session as obsolete — the branch had diverged from `main` by 16+ commits and could no longer be rebase-merged cleanly.

This PR is a **tracking placeholder** for any subagent-observability work that has not been incorporated into `main` since the closure of #1664.

## What #1664 contained

The original PR was a sync-layer refactor for subagent/team observability. Key files it touched:

- `packages/ui/src/sync/sync-context.tsx` — refactor of `handleEvent` to route subagent events through a `subagent-notification-batcher` (debounce 1.2s coalesce) instead of `appendNotification` per-event.
- `packages/ui/src/sync/subagent-notification-batcher.ts` — new file implementing the batcher (99 lines).
- `packages/ui/src/sync/DOCUMENTATION.md` — sync-layer docs updates.

## Why this is a placeholder, not a port

I attempted to cherry-pick the original feature commits against current `main` (HEAD `8f5eb231b`):

1. `git cherry-pick 79bc2f4f9` (original feature commit) — 50+ content conflicts across `MarkdownRendererImpl.tsx`, `RightSidebarTabs.tsx`, `ProvidersPage.tsx`, `ProvidersSidebar.tsx`, `useKeyboardShortcuts.ts`, and dozens more. Each conflict requires manual resolution against a sync-context.tsx that has been heavily refactored in main.
2. `git cherry-pick d8b8400a0` (batcher-only) — `subagent-notification-batcher.ts` applied cleanly, but `sync-context.tsx` produced a 6000+ line conflict because main's `handleEvent` has been rewritten since the original commit.

The sync-layer refactor is too tightly coupled to the structure of the codebase at the time #1664 was authored. Re-porting it is work that exceeds the scope of a single PR.

## What main has incorporated

Most of the *user-visible* behavior from #1664 is already in main:

- `packages/ui/src/sync/subagent-notification-batcher.ts` — the file is unique to the obsolete branch but main has not integrated the batching logic; subagent events still go through `appendNotification` one by one (so a 10-subagent team produces 10 toasts instead of 1).
- The sync-layer refactor of `handleEvent` itself — main's `handleEvent` has been rewritten and the batcher-routing logic no longer applies.
- Locale additions for the subagent surface — main already has `subagents` labels in all locales.

## Open question for the maintainer

If the batcher's behavior (1.2s debounce, single consolidated notification per parent) is still wanted, the cleanest path is:

1. A new PR that ports `subagent-notification-batcher.ts` (the file itself is small and standalone) and adds a single call site in `sync-context.tsx`'s current `handleEvent` that routes only `isSubtask` events through the batcher.
2. Keep non-subtask events on the existing `appendNotification` path.

Happy to write that PR if the maintainer signals it's wanted.

## Validation

None — this PR contains no functional changes.
