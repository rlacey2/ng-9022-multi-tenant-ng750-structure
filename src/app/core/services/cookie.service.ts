import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CookieConsent } from '../models/cookie-consent.model';
import { COOKIE_CONSENT_OPTIONS, COOKIE_FEATURES, COOKIE_FEATURE_SET } from '../config/cookie.config';

const STORAGE_KEY = 'ng-9022-cookie-consent-granted';
const COOKIE_NAME = 'ng-9022-cookie-consent-granted';

// 20261105: Central service for consent state and browser persistence.
@Injectable({ providedIn: 'root' })
export class CookieService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly defaultPage = '/events'

  // 20261105: Null means the user has not made a choice.
  readonly consent = signal<CookieConsent | null>(this.readInitialConsent());

  // 20261106: Keep the originally requested protected URL while the user is making a consent decision.
  private readonly pendingReturnUrl = signal<string | null>(null);

  // 20261106: A reset or visit to the consent route always requires a fresh, explicit decision.
  private readonly forceConsentDecision = signal(false);

  // 20261106: Feature flags control available categories, not whether a reset can request a fresh decision.
  readonly hasConsentFeatures = computed(() => COOKIE_FEATURES.analytics || COOKIE_FEATURES.marketing);
  readonly requiresConsentDecision = computed(() =>
     this.forceConsentDecision() || this.consent() === null
   // this.forceConsentDecision() || (this.hasConsentFeatures() && this.consent() === null)
  );
  readonly hasChosenConsent = computed(() => !this.requiresConsentDecision());

  // 20261105: Indicates that a configured optional category has been allowed.
  readonly hasConsented = computed(() => {
    const current = this.consent();
    return current !== null &&
      ((COOKIE_FEATURES.analytics && current.analytics) ||
       (COOKIE_FEATURES.marketing && current.marketing));
  });

  constructor() {
    // 20261105: Synchronize each consent change to both storage mechanisms in browser contexts.
    effect(() => {
      const current = this.consent();
      if (!this.isBrowser) return;
      if (current === null) this.removeStoredConsent();
      else this.persistConsent(current);
    });
  }

  // 20261105: Accept all configured optional categories.
  acceptAll(): void { this.setConsent(COOKIE_FEATURES.analytics, COOKIE_FEATURES.marketing); }

  // 20261105: Reject all optional categories; essential functionality remains available.
  rejectNonEssential(): void { this.setConsent(false, false); }

  // 20261106: Require a fresh explicit choice, including when no optional categories are configured.
  requireFreshConsentDecision(): void {
    this.forceConsentDecision.set(true);
    this.consent.set(null);
  }

  // 20261106: Remember where the user should return before clearing the stored decision.
  resetConsent(returnUrl = this.defaultPage): void {
    this.pendingReturnUrl.set(this.isSafeInternalUrl(returnUrl) ? returnUrl : this.defaultPage);
    this.forceConsentDecision.set(true);
    this.consent.set(null);
  }

  // 20261106: Save the protected URL that was requested before the guard redirected to consent.
  setPendingReturnUrl(returnUrl: string): void {
    if (this.isSafeInternalUrl(returnUrl) && returnUrl !== '/consent') {
      this.pendingReturnUrl.set(returnUrl);
    }
  }

  // 20261106: Consume the return URL once a new decision has been made.
  takePendingReturnUrl(): string {
    const returnUrl = this.pendingReturnUrl() ?? this.defaultPage;
    this.pendingReturnUrl.set(null);
    return returnUrl;
  }

  // 20261106: Only allow local application paths as navigation targets.
  private isSafeInternalUrl(url: string): boolean {
    return url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\');
  }

  // 20261105: Store the current feature configuration with the decision.
  private setConsent(analytics: boolean, marketing: boolean): void {
    this.forceConsentDecision.set(false);
    const now = Date.now();
    const days = COOKIE_CONSENT_OPTIONS.expiryDays;
    this.consent.set({
      essential: true,
      analytics: COOKIE_FEATURES.analytics && analytics,
      marketing: COOKIE_FEATURES.marketing && marketing,
      featureSet: COOKIE_FEATURE_SET,
      decidedAt: now,
      expiresAt: days === null ? 0 : now + days * 86400000
    });
  }

  // 20261105: Read localStorage first, using the cookie as a fallback.
  private readInitialConsent(): CookieConsent | null {
    console.log('readInitialConsent')
 //   if (!this.isBrowser || !(COOKIE_FEATURES.analytics || COOKIE_FEATURES.marketing)) return null;
  if (!this.isBrowser) return null; // Only check if running in the browser

    try {
      const raw = this.getLocalStorageValue() ?? this.getCookieValue();
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      if (!this.isValidConsent(parsed)) return null;
      if (parsed.expiresAt !== 0 && parsed.expiresAt <= Date.now()) {
        this.removeStoredConsent();
        return null;
      }
      return parsed;
    } catch { return null; }
  }

  // 20261105: Validate browser data and require a decision for the current enabled categories.
  private isValidConsent(value: unknown): value is CookieConsent {
    if (typeof value !== 'object' || value === null) return false;
    const item = value as Record<string, unknown>;
    return item['essential'] === true
      && typeof item['analytics'] === 'boolean'
      && typeof item['marketing'] === 'boolean'
      && item['featureSet'] === COOKIE_FEATURE_SET
      && typeof item['decidedAt'] === 'number'
      && typeof item['expiresAt'] === 'number';
  }

  // 20261105: Keep both persistence mechanisms aligned.
  private persistConsent(value: CookieConsent): void {
    const serialized = JSON.stringify(value);
    try { this.document.defaultView?.localStorage.setItem(STORAGE_KEY, serialized); }
    catch {
      // 20261105: Continue with the cookie if localStorage is unavailable.
    }
    const maxAge = value.expiresAt === 0 ? '' : `; Max-Age=${Math.max(0, Math.floor((value.expiresAt - Date.now()) / 1000))}`;
    const secure = this.document.location?.protocol === 'https:' ? '; Secure' : '';
    this.document.cookie = `${COOKIE_NAME}=${encodeURIComponent(serialized)}; Path=/; SameSite=Lax${maxAge}${secure}`;
  }

  // 20261105: Clear both copies so reset cannot be undone by a stale fallback.
  private removeStoredConsent(): void {
    try { this.document.defaultView?.localStorage.removeItem(STORAGE_KEY); }
    catch {
      // 20261105: Cookie cleanup still proceeds if localStorage is unavailable.
    }
    this.document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
  }

  private getLocalStorageValue(): string | null {
    try { return this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null; }
    catch { return null; }
  }

  private getCookieValue(): string | null {
    const prefix = `${COOKIE_NAME}=`;
    const entry = this.document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith(prefix));
    if (!entry) return null;
    try { return decodeURIComponent(entry.slice(prefix.length)); }
    catch { return null; }
  }
}
