// 20261105: Essential cookies are always enabled; optional categories are configuration-controlled.
export interface CookieConsent {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  featureSet: string;
  decidedAt: number;
  expiresAt: number;
}
