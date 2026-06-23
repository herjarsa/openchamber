export type RuntimeAuthCredential =
  | { type: 'bearer'; token: string }
  | { type: 'basic'; username: string; password: string }
| null;

export type RuntimeAuthCredentialProvider = () => RuntimeAuthCredential | Promise<RuntimeAuthCredential>;

const BASIC_AUTH_STORAGE_KEY = 'openchamber.credentials';

type StoredBasicAuth = { username?: unknown; password?: unknown };

const normalizeBasicAuth = (value: { username: string; password: string } | null | undefined): { username: string; password: string } | null => {
  if (!value) return null;
  const username = typeof value.username === 'string' ? value.username.trim() : '';
  const password = typeof value.password === 'string' ? value.password : '';
  if (!username || !password) return null;
  return { username, password };
};

const readPersistedBasicAuth = (): { username: string; password: string } | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage?.getItem(BASIC_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredBasicAuth;
    return normalizeBasicAuth({
      username: typeof parsed.username === 'string' ? parsed.username : '',
      password: typeof parsed.password === 'string' ? parsed.password : '',
    });
  } catch {
    return null;
  }
};

const writePersistedBasicAuth = (value: { username: string; password: string } | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (value) {
      window.localStorage?.setItem(BASIC_AUTH_STORAGE_KEY, JSON.stringify(value));
    } else {
      window.localStorage?.removeItem(BASIC_AUTH_STORAGE_KEY);
    }
  } catch {
    // localStorage may be disabled (private mode, quota); the in-memory credential
    // still works for the current session, it just won't survive a reload.
  }
};

let credentialProvider: RuntimeAuthCredentialProvider = () => null;
let runtimeBearerToken = '';
let runtimeUrlAuthToken = '';
let runtimeUrlAuthTokenExpiresAt = 0;
let runtimeUrlAuthRefreshPromise: Promise<string> | null = null;
let runtimeAuthGeneration = 0;
let runtimeBasicAuth: { username: string; password: string } | null = readPersistedBasicAuth();

const URL_AUTH_REFRESH_SKEW_MS = 10_000;

const normalizeBearerToken = (token: string | null | undefined): string => {
  if (typeof token !== 'string') return '';
  return token.trim();
};

const readInjectedBearerToken = (): string => {
  if (typeof window === 'undefined') return '';
  const injected = (window as typeof window & { __OPENCHAMBER_CLIENT_TOKEN__?: string }).__OPENCHAMBER_CLIENT_TOKEN__;
  return normalizeBearerToken(injected);
};

const readInjectedApiBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const injected = (window as typeof window & { __OPENCHAMBER_API_BASE_URL__?: string }).__OPENCHAMBER_API_BASE_URL__;
  return typeof injected === 'string' ? injected.trim() : '';
};

const buildAuthUrl = (apiBaseUrl: string | null | undefined, path: string): string => {
  const base = typeof apiBaseUrl === 'string' && apiBaseUrl.trim()
    ? apiBaseUrl.trim()
    : readInjectedApiBaseUrl();
  if (!base) return path;
  try {
    return new URL(path, `${base.replace(/\/+$/, '')}/`).toString();
  } catch {
    return path;
  }
};

export const clearRuntimeUrlAuthToken = (): void => {
  runtimeUrlAuthToken = '';
  runtimeUrlAuthTokenExpiresAt = 0;
};

const resetRuntimeAuthGeneration = (): void => {
  runtimeAuthGeneration += 1;
  runtimeUrlAuthRefreshPromise = null;
  clearRuntimeUrlAuthToken();
  // Credentials changed: if a consumer is active, re-mint promptly.
  scheduleUrlAuthRefresh();
};

// Resolve the default credential in priority order: Bearer (explicit or
// injected) > persisted Basic > null. The explicit provider
// (`setRuntimeAuthCredentialProvider`) overrides this default when set.
const resolveDefaultCredential = (): RuntimeAuthCredential => {
  const bearer = getRuntimeBearerTokenSync();
  if (bearer) return { type: 'bearer', token: bearer };
  if (runtimeBasicAuth) {
    return { type: 'basic', username: runtimeBasicAuth.username, password: runtimeBasicAuth.password };
  }
  return null;
};

export const setRuntimeAuthCredentialProvider = (provider: RuntimeAuthCredentialProvider): void => {
  runtimeBearerToken = '';
  resetRuntimeAuthGeneration();
  credentialProvider = provider;
};

export const clearRuntimeAuthCredentialProvider = (): void => {
  runtimeBearerToken = '';
  resetRuntimeAuthGeneration();
  credentialProvider = () => null;
};

export const setRuntimeBearerToken = (token: string | null | undefined): void => {
  const normalized = normalizeBearerToken(token);
  runtimeBearerToken = normalized;
  resetRuntimeAuthGeneration();
  // Re-route through the default resolver so an empty Bearer does not strand
  // a previously-set Basic credential — the resolver consults both.
  credentialProvider = resolveDefaultCredential;
};

export const getRuntimeBearerTokenSync = (): string => runtimeBearerToken || readInjectedBearerToken();

export const setRuntimeBasicAuthCredential = (
  credential: { username: string; password: string } | null | undefined,
): void => {
  runtimeBasicAuth = normalizeBasicAuth(credential ?? null);
  writePersistedBasicAuth(runtimeBasicAuth);
  resetRuntimeAuthGeneration();
  // Re-route through the default resolver so the next request picks the new
  // credential without depending on the caller's explicit Bearer state.
  credentialProvider = resolveDefaultCredential;
};

export const getRuntimeBasicAuthCredentialSync = (): { username: string; password: string } | null => runtimeBasicAuth;

export const clearRuntimeBasicAuthCredential = (): void => {
  setRuntimeBasicAuthCredential(null);
};

export const setRuntimeUrlAuthToken = (token: string | null | undefined, expiresAt: number | null | undefined): void => {
  const normalized = normalizeBearerToken(token);
  if (!normalized || typeof expiresAt !== 'number' || !Number.isFinite(expiresAt)) {
    clearRuntimeUrlAuthToken();
    return;
  }
  const previous = runtimeUrlAuthToken;
  runtimeUrlAuthToken = normalized;
  runtimeUrlAuthTokenExpiresAt = expiresAt;
  // Notify only on a real replacement (existing token swapped for a fresh one),
  // not on the initial mint, so consumers remount token-bearing assets only
  // when the URL token actually changed underneath them.
  if (previous && previous !== normalized) {
    notifyRuntimeUrlAuthListeners();
  }
};

const readValidRuntimeUrlAuthTokenSync = (): string => {
  if (!runtimeUrlAuthToken || runtimeUrlAuthTokenExpiresAt <= Date.now() + URL_AUTH_REFRESH_SKEW_MS) {
    clearRuntimeUrlAuthToken();
    return '';
  }
  return runtimeUrlAuthToken;
};

export const getRuntimeUrlAuthTokenSync = (): string => {
  const token = readValidRuntimeUrlAuthTokenSync();
  if (!token && (getRuntimeBearerTokenSync() || typeof window !== 'undefined')) {
    void refreshRuntimeUrlAuthToken().catch(() => {});
  }
  return token;
};

export const getRuntimeAuthCredential = async (): Promise<RuntimeAuthCredential> => {
  const credential = await credentialProvider();
  if (!credential) return null;
  if (credential.type === 'bearer') {
    const token = normalizeBearerToken(credential.token);
    return token ? { type: 'bearer', token } : null;
  }
  if (credential.type === 'basic') {
    const normalized = normalizeBasicAuth(credential);
    return normalized ? { type: 'basic', username: normalized.username, password: normalized.password } : null;
  }
  return null;
};

// Performs the actual network mint and swaps the new token in atomically (the
// previous token stays valid until `setRuntimeUrlAuthToken` replaces it — no
// empty-token window). Concurrent callers share one in-flight request.
const mintRuntimeUrlAuthToken = (apiBaseUrl?: string | null): Promise<string> => {
  if (runtimeUrlAuthRefreshPromise) return runtimeUrlAuthRefreshPromise;
  const generation = runtimeAuthGeneration;

  const refreshPromise = (async () => {
    const credential = await getRuntimeAuthCredential();
    const headers = new Headers();
    if (credential?.type === 'bearer') {
      headers.set('Authorization', `Bearer ${credential.token}`);
    } else if (credential?.type === 'basic') {
      headers.set('Authorization', `Basic ${btoa(`${credential.username}:${credential.password}`)}`);
    }
    const response = await fetch(buildAuthUrl(apiBaseUrl, '/auth/url-token'), {
      method: 'POST',
      headers,
      credentials: 'include',
    });
    if (!response.ok) {
      if (generation === runtimeAuthGeneration) {
        clearRuntimeUrlAuthToken();
      }
      throw new Error(`Failed to mint runtime URL auth token (${response.status})`);
    }
    const payload = await response.json().catch(() => null) as { token?: unknown; expiresAt?: unknown } | null;
    const token = typeof payload?.token === 'string' ? payload.token.trim() : '';
    const expiresAt = typeof payload?.expiresAt === 'number' ? payload.expiresAt : 0;
    if (generation !== runtimeAuthGeneration) {
      throw new Error('Runtime URL auth token response is stale');
    }
    setRuntimeUrlAuthToken(token, expiresAt);
    if (!runtimeUrlAuthToken) {
      throw new Error('Runtime URL auth token response was invalid');
    }
    return runtimeUrlAuthToken;
  })();
  const trackedPromise = refreshPromise.finally(() => {
    if (runtimeUrlAuthRefreshPromise === trackedPromise) {
      runtimeUrlAuthRefreshPromise = null;
    }
  });
  runtimeUrlAuthRefreshPromise = trackedPromise;

  return runtimeUrlAuthRefreshPromise;
};

// Returns a valid token without a network call, minting only when the current
// token is missing or already inside the skew window.
export const refreshRuntimeUrlAuthToken = async (apiBaseUrl?: string | null): Promise<string> => {
  const existing = readValidRuntimeUrlAuthTokenSync();
  if (existing) return existing;
  return mintRuntimeUrlAuthToken(apiBaseUrl);
};

// ── Proactive URL auth token refresh ──────────────────────────────────────
// The url token has a short server TTL. Instead of each consumer minting on its
// own timer (and clearing the shared token, which 401s other consumers during
// the refetch), a single scheduler refreshes it just before the skew window —
// but only while at least one consumer is active, so we never poll
// /auth/url-token in the background when nothing needs the token.
let urlAuthConsumerCount = 0;
let urlAuthRefreshTimer: ReturnType<typeof setTimeout> | null = null;
let urlAuthApiBaseUrl: string | null = null;
const urlAuthListeners = new Set<() => void>();
const URL_AUTH_PROACTIVE_BUFFER_MS = 5_000;

const notifyRuntimeUrlAuthListeners = (): void => {
  for (const listener of urlAuthListeners) {
    try {
      listener();
    } catch {
      // A listener throwing must not break the refresh loop.
    }
  }
};

const clearUrlAuthRefreshTimer = (): void => {
  if (urlAuthRefreshTimer !== null) {
    clearTimeout(urlAuthRefreshTimer);
    urlAuthRefreshTimer = null;
  }
};

const scheduleUrlAuthRefresh = (): void => {
  clearUrlAuthRefreshTimer();
  if (urlAuthConsumerCount <= 0 || typeof window === 'undefined') return;

  // Refresh before the skew window so the old token is still valid when the new
  // one swaps in. With no token yet (expiry 0), refresh immediately.
  const refreshAt = runtimeUrlAuthTokenExpiresAt - URL_AUTH_REFRESH_SKEW_MS - URL_AUTH_PROACTIVE_BUFFER_MS;
  const delay = runtimeUrlAuthTokenExpiresAt > 0 ? Math.max(0, refreshAt - Date.now()) : 0;

  urlAuthRefreshTimer = setTimeout(() => {
    urlAuthRefreshTimer = null;
    if (urlAuthConsumerCount <= 0) return;
    void mintRuntimeUrlAuthToken(urlAuthApiBaseUrl)
      .catch(() => {
        // Transient — the reschedule below retries (token is cleared on
        // failure → expiry 0 → delay 0 → prompt retry).
      })
      .finally(() => {
        scheduleUrlAuthRefresh();
      });
  }, delay);
};

// Register an active url-token consumer. While any consumer is held, the token
// is proactively refreshed before it expires. Returns a release function;
// the proactive loop stops once the last consumer releases.
export const acquireRuntimeUrlAuthToken = (apiBaseUrl?: string | null): (() => void) => {
  if (typeof apiBaseUrl === 'string' && apiBaseUrl.trim()) {
    urlAuthApiBaseUrl = apiBaseUrl.trim();
  }
  urlAuthConsumerCount += 1;
  scheduleUrlAuthRefresh();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    urlAuthConsumerCount = Math.max(0, urlAuthConsumerCount - 1);
    if (urlAuthConsumerCount === 0) {
      clearUrlAuthRefreshTimer();
    }
  };
};

// Subscribe to url-token *replacements* (an existing token swapped for a fresh
// one). Fires only on a real change — not the initial mint — so consumers can
// remount token-bearing assets without churning on first load. Returns an
// unsubscribe function.
export const subscribeRuntimeUrlAuthToken = (listener: () => void): (() => void) => {
  urlAuthListeners.add(listener);
  return () => {
    urlAuthListeners.delete(listener);
  };
};

export const buildRuntimeAuthHeaders = async (headers?: HeadersInit): Promise<Headers> => {
  const next = new Headers(headers);
  if (next.has('Authorization')) {
    return next;
  }

  const credential = await getRuntimeAuthCredential();
  if (credential?.type === 'bearer') {
    next.set('Authorization', `Bearer ${credential.token}`);
  } else if (credential?.type === 'basic') {
    next.set('Authorization', `Basic ${btoa(`${credential.username}:${credential.password}`)}`);
  }
  return next;
};
