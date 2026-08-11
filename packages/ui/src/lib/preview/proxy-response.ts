export const PREVIEW_TARGET_ERROR_HEADER = 'x-openchamber-preview-target-error';

type PreviewTargetErrorCode = 'missing' | 'expired' | 'invalid-token' | 'unreachable';

export const getPreviewTargetErrorCode = (headers: Pick<Headers, 'get'>): PreviewTargetErrorCode | null => {
  const value = headers.get(PREVIEW_TARGET_ERROR_HEADER);
  return value === 'missing' || value === 'expired' || value === 'invalid-token' || value === 'unreachable'
    ? value
    : null;
};

export const getPreviewTargetRecoveryAction = (
  headers: Pick<Headers, 'get'>,
  recoveryAttempted: boolean,
): 'none' | 'retry-registration' | 'stop-retrying' | 'retry-grace' => {
  const code = getPreviewTargetErrorCode(headers);
  if (!code) return 'none';
  // The target itself is valid, but the upstream origin is not accepting
  // connections (ECONNREFUSED & friends). Re-registering would not help;
  // give the dev server a startup grace window, then stop retrying.
  if (code === 'unreachable') return 'retry-grace';
  return recoveryAttempted ? 'stop-retrying' : 'retry-registration';
};
