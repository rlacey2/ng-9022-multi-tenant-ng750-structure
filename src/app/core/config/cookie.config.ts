// 20261106: Enable categories implemented by the application.
// 20261106: Both are enabled in this demo so the consent prompt and choice controls are visible.
// 20261106: Set a category to false when the corresponding integration is not part of the app.
// 20261106: If both are false, no initial prompt is needed; a reset or /consent visit still forces an explicit overlay choice.
export const COOKIE_FEATURES = {
  analytics: false,
  marketing: false
} as const;

// 20261106: Set to null for no automatic expiry.
export const COOKIE_CONSENT_OPTIONS = {
  expiryDays: 365
} as const;

// 20261106: A changed feature set requires a fresh consent decision.
export const COOKIE_FEATURE_SET = `analytics:${Number(COOKIE_FEATURES.analytics)}|marketing:${Number(COOKIE_FEATURES.marketing)}`;
