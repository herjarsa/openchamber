import { describe, expect, test } from 'bun:test';
import type { Session } from '@opencode-ai/sdk/v2';

import { computeProjectSessionLists, type ProjectSessionListsArgs } from './useProjectSessionLists';

const makeSession = (overrides: Partial<Session> = {}): Session =>
  ({
    id: 'session-id',
    slug: 'session-slug',
    projectID: 'project-id',
    directory: '/workspace',
    title: 'Test session',
    version: '1',
    time: { created: 0, updated: 0 },
    ...overrides,
  }) as Session;

const project = { normalizedPath: '/workspace' };

const baseArgs: ProjectSessionListsArgs = {
  isVSCode: false,
  sessions: [],
  archivedSessions: [],
  availableWorktreesByProject: new Map(),
  showSubagentSessionsInSidebar: false,
};

describe('useProjectSessionLists — subagent visibility toggle', () => {
  test('toggle OFF: getSessionsForProject excludes subagent sessions', () => {
    const parent = makeSession({ id: 'parent', title: 'Parent' });
    const subagent = makeSession({ id: 'sub', title: 'Sub', parentID: 'parent' } as unknown as Partial<Session>);
    const other = makeSession({ id: 'other', title: 'Other' });

    const lists = computeProjectSessionLists({ ...baseArgs, sessions: [parent, subagent, other] });

    expect(lists.getSessionsForProject(project).map((s) => s.id).sort()).toEqual(['other', 'parent']);
  });

  test('toggle ON: getSessionsForProject includes subagent sessions (legacy)', () => {
    const parent = makeSession({ id: 'parent', title: 'Parent' });
    const subagent = makeSession({ id: 'sub', title: 'Sub', parentID: 'parent' } as unknown as Partial<Session>);

    const lists = computeProjectSessionLists({
      ...baseArgs,
      showSubagentSessionsInSidebar: true,
      sessions: [parent, subagent],
    });

    const ids = lists.getSessionsForProject(project).map((s) => s.id).sort();
    expect(ids).toEqual(['parent', 'sub']);
  });

  test('toggle OFF: getSubtaskCountForProject returns the number of hidden subagents', () => {
    const parent = makeSession({ id: 'parent', title: 'Parent' });
    const subA = makeSession({ id: 'sub-a', title: 'A', parentID: 'parent' } as unknown as Partial<Session>);
    const subB = makeSession({ id: 'sub-b', title: 'B', parentID: 'parent' } as unknown as Partial<Session>);

    const lists = computeProjectSessionLists({ ...baseArgs, sessions: [parent, subA, subB] });

    expect(lists.getSubtaskCountForProject(project)).toBe(2);
  });

  test('toggle OFF: getArchivedSessionsForProject does not surface unrelated archived subagents', () => {
    const archivedParent = makeSession({
      id: 'arch-parent',
      title: 'Archived Parent',
      time: { created: 0, updated: 0, archived: 1 },
    });
    const archivedSub = makeSession({
      id: 'arch-sub',
      title: 'Archived Sub',
      parentID: 'arch-parent',
      time: { created: 0, updated: 0, archived: 1 },
    } as unknown as Partial<Session>);

    const lists = computeProjectSessionLists({ ...baseArgs, archivedSessions: [archivedParent, archivedSub] });

    const ids = lists.getArchivedSessionsForProject(project).map((s) => s.id);
    expect(ids).not.toContain('arch-sub');
  });
});
