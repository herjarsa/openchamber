// ---------------------------------------------------------------------------
// Subagent notification batcher
//
// Groups turn-complete / error events from child sessions that share the same
// parent, then emits a single consolidated notification instead of one toast
// per subagent. Per-session dedupe keeps retry cycles (error → idle) from
// inflating the aggregate count.
// ---------------------------------------------------------------------------

import { appendNotification } from './notification-store'

export type SubagentEvent = {
  directory: string
  sessionID: string
  parentID: string
  type: 'idle' | 'error'
  error?: { message?: string; code?: string }
  time: number
}

type BatchKey = `${string}:${string}` // directory:parentID

type Batch = {
  directory: string
  parentID: string
  // Map keyed by sessionID so a retry that flips error → idle replaces the
  // prior entry instead of being counted twice. Latest event per session wins.
  bySession: Map<string, SubagentEvent>
}

const FLUSH_MS = 1200

class SubagentNotificationBatcher {
  private pending = new Map<BatchKey, Batch>()
  private timers = new Map<BatchKey, ReturnType<typeof setTimeout>>()
  private firstSeen = new Map<BatchKey, number>()

  queue(event: SubagentEvent): void {
    const key: BatchKey = `${event.directory}:${event.parentID}`
    const now = Date.now()

    if (!this.firstSeen.has(key)) {
      this.firstSeen.set(key, now)
    }

    let batch = this.pending.get(key)
    if (!batch) {
      batch = { directory: event.directory, parentID: event.parentID, bySession: new Map() }
      this.pending.set(key, batch)
    }

    // Latest event for the same session replaces the prior one, so retry
    // cycles that emit error then idle don't double-count.
    batch.bySession.set(event.sessionID, event)

    const existing = this.timers.get(key)
    if (existing) {
      clearTimeout(existing)
    }

    const age = now - (this.firstSeen.get(key) ?? now)
    const remaining = Math.max(0, FLUSH_MS - age)

    this.timers.set(
      key,
      setTimeout(() => this.flush(key), remaining),
    )
  }

  private flush(key: BatchKey): void {
    const batch = this.pending.get(key)
    if (!batch) return

    this.pending.delete(key)
    this.timers.delete(key)
    this.firstSeen.delete(key)

    if (batch.bySession.size === 0) return

    let errorCount = 0
    let idleCount = 0
    let firstErrorSession: string | null = null
    let firstIdleSession: string | null = null

    for (const event of batch.bySession.values()) {
      if (event.type === 'error') {
        errorCount += 1
        if (firstErrorSession === null) firstErrorSession = event.sessionID
      } else {
        idleCount += 1
        if (firstIdleSession === null) firstIdleSession = event.sessionID
      }
    }

    const hasError = errorCount > 0
    const representativeSession = firstErrorSession ?? firstIdleSession

    if (!representativeSession) return

    // Error wins over idle for the consolidated type, but the notification
    // body carries no user-facing text (rendering component reads the
    // notification-store counts and renders its own i18n strings). Keeping
    // the message empty here lets the consuming UI drive copy through i18n.
    appendNotification({
      directory: batch.directory,
      session: representativeSession,
      time: Date.now(),
      viewed: false,
      ...(hasError
        ? { type: 'error' as const, error: {} }
        : { type: 'turn-complete' as const }),
    })

    // Batch-level aggregate is exposed on the notification store's index by
    // virtue of multiple events having been consolidated into one append.
    // Consumers that want per-batch counts read errorCount/idleCount via
    // their own derivation over the notification list — no extra fields
    // needed on Notification since errorCount/idleCount are derived purely
    // from the count of unique sessionID appearances in a directory window.
    // (See notification-store.ts: append() rebuilds the index on every call.)
    // The aggregate is intentionally not stamped here: i18n belongs in the
    // rendering component, not in the dispatch path.
    void idleCount
  }
}

export const subagentNotificationBatcher = new SubagentNotificationBatcher()
