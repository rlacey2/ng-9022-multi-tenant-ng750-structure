/**
 * This service handles in-memory caching, forceRefresh overrides, URL/dialog loading, 
 * New defaults, and before/now diffing: typescript
 */


// src/app/core/services/event-configuration.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError, finalize } from 'rxjs';
import { EventConfigurationModel } from '../../shared/models/shared.models';
import { AnonymousSubject } from 'rxjs/internal/Subject';


@Injectable({
  providedIn: 'root'
})
export class EventConfigurationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/events'; // Replace with your actual endpoint

  // In-memory cache keyed by eventId
  private readonly cache = new Map<number, EventConfigurationModel>();

  // 1. BEFORE: Immutable baseline snapshot set on load, save, or "New"
  private readonly baselineSignal = signal<EventConfigurationModel>(this.createDefaultEventConfiguration());
  readonly baselineEvent = this.baselineSignal.asReadonly();

  // 2. NOW: Active working copy edited by your component forms
  readonly eventConfiguration: any = signal<EventConfigurationModel>(this.createDefaultEventConfiguration());

  // Loading & error state signals for UI spinners/banners
  readonly isLoading = signal<boolean>(false);

  // 3. DIFF: Automatically computes changed keys and dirty state between Before and Now
  readonly changedFields = computed(() => {
    const before = this.baselineSignal();
    const now = this.eventConfiguration();
    const diff: Partial<Record<keyof EventConfigurationModel, { before: unknown; now: unknown }>> = {};

    for (const key of Object.keys(now) as (keyof EventConfigurationModel)[]) {
      if (JSON.stringify(before[key]) !== JSON.stringify(now[key])) {
        diff[key] = { before: before[key], now: now[key] };
      }
    }
    return diff;
  });

  readonly hasUnsavedChanges = computed(() => Object.keys(this.changedFields()).length > 0);

  /**
   * Source 1 & 2: Load by eventId (from URL param like /cms/1234 or Search Dialog selection).
   * Uses cached copy unless forceRefresh is true.
   */
  loadEventById(eventId: number, forceRefresh = false): Observable<EventConfigurationModel> {

    if (!forceRefresh && this.cache.has(eventId)) {
      const cached = structuredClone(this.cache.get(eventId)!);
      this.commitBaseline(cached);
      return of(cached);
    }

    this.isLoading.set(true);
    return this.http.get<EventConfigurationModel>(`${this.apiUrl}/${eventId}`).pipe(
      tap(record => {
        this.cache.set(record.eventId!, structuredClone(record));
        this.commitBaseline(record);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  /**
   * Source 3: Initialize a fresh default record for the "New" action.
   */
  initNewEvent(overrides?: Partial<EventConfigurationModel>): void {
    const fresh: EventConfigurationModel = {
      ...this.createDefaultEventConfiguration(),
      ...overrides
    };
    this.commitBaseline(fresh);
  }

  /**
   * Commits the current working copy as the new baseline and updates the cache after a successful save.
   */
  markAsSaved(savedRecord: EventConfigurationModel): void {
    if (savedRecord.eventId !== null) {
      this.cache.set(savedRecord.eventId, structuredClone(savedRecord));
    }
    this.commitBaseline(savedRecord);
  }

  /**
   * Reverts working edits back to the last loaded/saved baseline snapshot.
   */
  revertChanges(): void {
    this.eventConfiguration.set(structuredClone(this.baselineSignal()));
  }

  /**
   * Sets both Before and Now signals to deep-cloned copies so mutating one never mutates the other.
   */
  private commitBaseline(record: EventConfigurationModel): void {
    this.baselineSignal.set(structuredClone(record));
    this.eventConfiguration.set(structuredClone(record));
  }

  createDefaultEventConfiguration(): EventConfigurationModel {
    return {
    name: "0 New Seminar mvjx7hfi",
    eventId: 521,
    eventStatus: "3) Released as Promotion",
    promotionCodes: [
      { code: 'PROMO1', visible: true, enabled: true },
      { code: 'PROMO2', visible: false, enabled: true },
      { code: 'PROMO3', active: true }
    ],
    template_meta: { type: "seminar_ng750", description: "Seminar/Workshop: 1:N" },
    overview: { meta: { visible: true }, data: [{ visible: true, text: "Overview Data String" }] },
    footer: { meta: { visible: false }, data: [] },
    organisation: { meta: { enabled: true, ui_text_to_display: "School" } },
    payment_meta: { paymentRequired: true, calculationModel: "perAttendee" },
    single_meta: {
      optional_fields: [
        { id: "1114488b4983", staticName: "alpha", which: "h", visible: true },
        { id: "2222488b4983", staticName: "Beta", which: "f", enabled: false, visible: true }
      ]
    },
    attendees_meta: {
      optional_fields: [
        { id: "d8244488b4983", which: "d", enabled: true }
      ]
    },
    offerings: {
      data: [
        { order: 1, visible: true, lines: [{ text: "Line Header A" }] }
      ]
    }
  };
  }
}
