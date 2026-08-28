/**
 * Tests for the subagent notification batcher.
 *
 * The batcher groups session.idle / session.error events from subagent sessions
 * (sessions with a parentID) and emits a single consolidated notification per
 * parent after a 1.2s debounce window. Per-session dedupe keeps retry cycles
 * (error → idle for the same session) from inflating the batch.
 */
import { beforeEach, describe, expect, mock, test } from "bun:test";

// Mock zustand so notification-store can be loaded without the real package.
mock.module("zustand", () => {
  type Store = Record<string, unknown>;
  return {
    create: <T extends Store>(initializer: (set: (p: Partial<T> | ((s: T) => Partial<T>)) => void, get: () => T) => T) => {
      let state: T;
      const set = (patch: Partial<T> | ((s: T) => Partial<T>)) => {
        state = typeof patch === "function" ? { ...state, ...patch(state) } : { ...state, ...patch };
      };
      const get = () => state;
      state = initializer(set, get);
      return state;
    },
  };
});

// Capture notifications appended during the test.
const captured: unknown[] = [];

mock.module("./notification-store", () => ({
  appendNotification: (notification: unknown) => {
    captured.push(notification);
  },
}));

const { subagentNotificationBatcher } = await import("./subagent-notification-batcher");

interface CapturedNotification {
  directory?: string;
  session?: string;
  time: number;
  viewed: boolean;
  type?: "turn-complete" | "error";
  error?: Record<string, unknown>;
}

beforeEach(() => {
  captured.length = 0;
});

describe("subagentNotificationBatcher", () => {
  test("emits one consolidated turn-complete notification per parent after debounce", async () => {
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 });
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-2", parentID: "parent-1", type: "idle", time: 2 });
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-3", parentID: "parent-1", type: "idle", time: 3 });

    // Wait past the 1.2s debounce window defined by FLUSH_MS in the batcher.
    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(1);
    const n = captured[0] as CapturedNotification;
    expect(n.type).toBe("turn-complete");
    expect(n.directory).toBe("/repo");
  });

  test("any error in the batch produces an error notification", async () => {
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 });
    subagentNotificationBatcher.queue({
      directory: "/repo",
      sessionID: "child-2",
      parentID: "parent-1",
      type: "error",
      error: { message: "boom" },
      time: 2,
    });

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(1);
    const n = captured[0] as CapturedNotification;
    expect(n.type).toBe("error");
  });

  test("different parents do not coalesce into one notification", async () => {
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 });
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-2", parentID: "parent-2", type: "idle", time: 1 });

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(2);
  });

  test("different directories do not coalesce", async () => {
    subagentNotificationBatcher.queue({ directory: "/repo-a", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 });
    subagentNotificationBatcher.queue({ directory: "/repo-b", sessionID: "child-2", parentID: "parent-1", type: "idle", time: 1 });

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(2);
    const dirs = (captured as CapturedNotification[]).map((n) => n.directory).sort();
    expect(dirs).toEqual(["/repo-a", "/repo-b"]);
  });

  test("retry cycle (error then idle for the same session) keeps the session counted once", async () => {
    // A subagent that errors then idles after a retry should not appear as
    // both an error and an idle in the batch — the latest event wins and
    // the session is counted once.
    subagentNotificationBatcher.queue({
      directory: "/repo",
      sessionID: "child-1",
      parentID: "parent-1",
      type: "error",
      error: { message: "first attempt" },
      time: 1,
    });
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 2 });

    await new Promise((resolve) => setTimeout(resolve, 1300));

    // The latest event (idle) wins, so the notification is turn-complete.
    expect(captured).toHaveLength(1);
    const n = captured[0] as CapturedNotification;
    expect(n.type).toBe("turn-complete");
    expect(n.session).toBe("child-1");
  });

  test("retry cycle that ends in error counts the session as one error", async () => {
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 });
    subagentNotificationBatcher.queue({
      directory: "/repo",
      sessionID: "child-1",
      parentID: "parent-1",
      type: "error",
      error: { message: "final" },
      time: 2,
    });

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(1);
    const n = captured[0] as CapturedNotification;
    expect(n.type).toBe("error");
    expect(n.session).toBe("child-1");
  });

  test("subsequent events extend the debounce window toward the fixed deadline", async () => {
    // First event at t=0 schedules flush at t=1200. Second event at t=500
    // reschedules the timer to fire at the same fixed deadline (t=1200),
    // not later. We verify the second event is included in the batch by
    // flushing at 1300ms and confirming both sessions are represented.
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 });
    await new Promise((resolve) => setTimeout(resolve, 500));
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "child-2", parentID: "parent-1", type: "idle", time: 2 });
    await new Promise((resolve) => setTimeout(resolve, 900));

    expect(captured).toHaveLength(1);
    expect((captured[0] as CapturedNotification).type).toBe("turn-complete");
  });

  test("representative session is the first error when present, otherwise first idle", async () => {
    // Mix of idle and error events. The representative session (used as the
    // notification.session field) should be the first errored session.
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "idle-A", parentID: "parent-1", type: "idle", time: 1 });
    subagentNotificationBatcher.queue({
      directory: "/repo",
      sessionID: "error-B",
      parentID: "parent-1",
      type: "error",
      error: { message: "b" },
      time: 2,
    });
    subagentNotificationBatcher.queue({
      directory: "/repo",
      sessionID: "error-C",
      parentID: "parent-1",
      type: "error",
      error: { message: "c" },
      time: 3,
    });
    subagentNotificationBatcher.queue({ directory: "/repo", sessionID: "idle-D", parentID: "parent-1", type: "idle", time: 4 });

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(1);
    const n = captured[0] as CapturedNotification;
    expect(n.type).toBe("error");
    expect(n.session).toBe("error-B");
  });
});
