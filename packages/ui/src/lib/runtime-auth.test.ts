import { describe, expect, test } from 'bun:test';
import {
  buildRuntimeAuthHeaders,
  clearRuntimeAuthCredentialProvider,
  clearRuntimeBasicAuthCredential,
  getRuntimeBasicAuthCredentialSync,
  getRuntimeBearerTokenSync,
  setRuntimeAuthCredentialProvider,
  setRuntimeBasicAuthCredential,
  setRuntimeBearerToken,
} from './runtime-auth';

const withWindow = <T>(value: unknown, callback: () => T): T => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value });
    return callback();
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, 'window', previousWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }
  }
};

const clearAllAuthState = (): void => {
  clearRuntimeAuthCredentialProvider();
  clearRuntimeBasicAuthCredential();
};

describe('runtime auth headers', () => {
  test('does not add authorization by default', async () => {
    clearAllAuthState();
    const headers = await buildRuntimeAuthHeaders({ Accept: 'application/json' });

    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.has('Authorization')).toBe(false);
  });

  test('adds bearer token when configured', async () => {
    try {
      setRuntimeBearerToken('token-123');
      const headers = await buildRuntimeAuthHeaders();

      expect(headers.get('Authorization')).toBe('Bearer token-123');
    } finally {
      clearAllAuthState();
    }
  });

  test('preserves explicit authorization header', async () => {
    try {
      setRuntimeAuthCredentialProvider(() => ({ type: 'bearer', token: 'runtime-token' }));
      const headers = await buildRuntimeAuthHeaders({ Authorization: 'Bearer explicit-token' });

      expect(headers.get('Authorization')).toBe('Bearer explicit-token');
    } finally {
      clearAllAuthState();
    }
  });

  test('falls back to injected desktop client token', async () => {
    withWindow({ __OPENCHAMBER_CLIENT_TOKEN__: ' injected-token ' }, () => {
      clearAllAuthState();

      expect(getRuntimeBearerTokenSync()).toBe('injected-token');

      return (async () => {
        const headers = await buildRuntimeAuthHeaders();
        expect(headers.get('Authorization')).toBe('Bearer injected-token');
      })();
    });
  });

  test('adds Basic auth header when basic credential is set', async () => {
    try {
      clearAllAuthState();
      setRuntimeBasicAuthCredential({ username: 'opencode', password: 'secret-pw' });

      const headers = await buildRuntimeAuthHeaders();
      const expected = `Basic ${btoa('opencode:secret-pw')}`;
      expect(headers.get('Authorization')).toBe(expected);
      expect(getRuntimeBasicAuthCredentialSync()).toEqual({ username: 'opencode', password: 'secret-pw' });
    } finally {
      clearAllAuthState();
    }
  });

  test('Bearer takes priority over Basic', async () => {
    try {
      clearAllAuthState();
      setRuntimeBasicAuthCredential({ username: 'opencode', password: 'secret-pw' });
      setRuntimeBearerToken('bearer-token');

      const headers = await buildRuntimeAuthHeaders();
      expect(headers.get('Authorization')).toBe('Bearer bearer-token');
    } finally {
      clearAllAuthState();
    }
  });

  test('clearing Bearer restores Basic fallback', async () => {
    try {
      clearAllAuthState();
      setRuntimeBasicAuthCredential({ username: 'opencode', password: 'secret-pw' });
      setRuntimeBearerToken('bearer-token');
      expect((await buildRuntimeAuthHeaders()).get('Authorization')).toBe('Bearer bearer-token');

      setRuntimeBearerToken(null);
      const expected = `Basic ${btoa('opencode:secret-pw')}`;
      expect((await buildRuntimeAuthHeaders()).get('Authorization')).toBe(expected);
    } finally {
      clearAllAuthState();
    }
  });

  test('rejects empty basic credential values', async () => {
    try {
      clearAllAuthState();
      setRuntimeBasicAuthCredential({ username: '', password: 'secret-pw' });
      expect(getRuntimeBasicAuthCredentialSync()).toBeNull();

      setRuntimeBasicAuthCredential({ username: 'opencode', password: '' });
      expect(getRuntimeBasicAuthCredentialSync()).toBeNull();

      setRuntimeBasicAuthCredential(null);
      expect(getRuntimeBasicAuthCredentialSync()).toBeNull();

      const headers = await buildRuntimeAuthHeaders();
      expect(headers.has('Authorization')).toBe(false);
    } finally {
      clearAllAuthState();
    }
  });

  test('persists Basic credential to localStorage and restores on next read', async () => {
    const storage = (() => {
      const map = new Map<string, string>();
      return {
        getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
        setItem: (key: string, value: string) => { map.set(key, value); },
        removeItem: (key: string) => { map.delete(key); },
      };
    })();

    withWindow({ localStorage: storage }, () => {
      try {
        clearAllAuthState();
        setRuntimeBasicAuthCredential({ username: 'opencode', password: 'topsecret' });
        const raw = storage.getItem('openchamber.credentials');
        expect(raw).not.toBeNull();
        expect(JSON.parse(raw!)).toEqual({ username: 'opencode', password: 'topsecret' });

        clearRuntimeBasicAuthCredential();
        expect(storage.getItem('openchamber.credentials')).toBeNull();
      } finally {
        clearAllAuthState();
      }
    });
  });
});

