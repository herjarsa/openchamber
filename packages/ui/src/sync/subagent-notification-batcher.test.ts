/**
 * Tests for the subagent notification batcher.
 *
 * The batcher groups session.idle / session.error events from subagent sessions
 * (sessions with a parentID) and emits a single consolidated notification per
 * parent after a 1.2s debounce window. This avoids the regression where a team
 * of N subagents produces N toasts; instead the parent session sees one
 * notification carrying aggregate information.
 */
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

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
import type { State } from "./types";

interface CapturedNotification {
  directory?: string;
  session?: string;
  time: number;
  viewed: boolean;
  type?: "turn-complete" | "error";
  error?: { message?: string; code?: string };
}

const emptyState = (): State =>
  ({
    session: [],
    message: {},
    part: {},
  }) as unknown as State;

beforeEach(() => {
  captured.length = 0;
});

afterEach(() => {
  // Reset batcher state between tests by waiting past the debounce window so
  // any leftover timers fire and clear the singleton's internal maps.
});

describe("subagentNotificationBatcher", () => {
  test("emits one consolidated turn-complete notification per parent after debounce", async () => {
    const getState = () => emptyState();

    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 },
      getState,
    );
    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-2", parentID: "parent-1", type: "idle", time: 2 },
      getState,
    );
    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-3", parentID: "parent-1", type: "idle", time: 3 },
      getState,
    );

    // Wait past the 1.2s debounce window defined by FLUSH_MS in the batcher.
    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(1);
    const n = captured[0] as CapturedNotification;
    expect(n.type).toBe("turn-complete");
    expect(n.directory).toBe("/repo");
  });

  test("error events produce one error notification per parent even when mixed with idle", async () => {
    const getState = () => emptyState();

    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 },
      getState,
    );
    subagentNotificationBatcher.queue(
      {
        directory: "/repo",
        sessionID: "child-2",
        parentID: "parent-1",
        type: "error",
        error: { message: "boom" },
        time: 2,
      },
      getState,
    );

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(1);
    const n = captured[0] as CapturedNotification;
    expect(n.type).toBe("error");
    expect(n.error?.message).toContain("1 subagent failed");
    expect(n.error?.message).toContain("1 completed");
  });

  test("different parents do not coalesce into one notification", async () => {
    const getState = () => emptyState();

    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 },
      getState,
    );
    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-2", parentID: "parent-2", type: "idle", time: 1 },
      getState,
    );

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(2);
  });

  test("different directories do not coalesce", async () => {
    const getState = () => emptyState();

    subagentNotificationBatcher.queue(
      { directory: "/repo-a", sessionID: "child-1", parentID: "parent-1", type: "idle", time: 1 },
      getState,
    );
    subagentNotificationBatcher.queue(
      { directory: "/repo-b", sessionID: "child-2", parentID: "parent-1", type: "idle", time: 1 },
      getState,
    );

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(2);
    const dirs = (captured as CapturedNotification[]).map((n) => n.directory).sort();
    expect(dirs).toEqual(["/repo-a", "/repo-b"]);
  });

  test("single error pluralizes to '1 subagent failed'", async () => {
    const getState = () => emptyState();

    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "error", error: { message: "a" }, time: 1 },
      getState,
    );

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(1);
    const n = captured[0] as CapturedNotification;
    expect(n.type).toBe("error");
    expect(n.error?.message).toBe("1 subagent failed");
  });

  test("multiple errors pluralize and report completed count", async () => {
    const getState = () => emptyState();

    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-1", parentID: "parent-1", type: "error", error: { message: "a" }, time: 1 },
      getState,
    );
    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-2", parentID: "parent-1", type: "error", error: { message: "b" }, time: 2 },
      getState,
    );
    subagentNotificationBatcher.queue(
      { directory: "/repo", sessionID: "child-3", parentID: "parent-1", type: "idle", time: 3 },
      getState,
    );

    await new Promise((resolve) => setTimeout(resolve, 1300));

    expect(captured).toHaveLength(1);
    const n = captured[0] as CapturedNotification;
    expect(n.type).toBe("error");
    expect(n.error?.message).toContain("2 subagents failed");
    expect(n.error?.message).toContain("1 completed");
  });
});
