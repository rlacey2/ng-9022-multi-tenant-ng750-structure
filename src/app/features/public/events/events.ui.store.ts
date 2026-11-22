import { computed, Injectable, signal } from '@angular/core';

@Injectable() // No providedIn: 'root' -> scoped to the component tree
export class EventUiStore {
  // Independent granular signals (Option 2)
  readonly eventOffset = signal(-1);
  readonly eventId = signal('-1');
  readonly eventsListLength = signal(-1);
  readonly showChoices = signal(false);
  readonly paymentIntent = signal<{ id: string | null; amount: number }>({
    id: null,
    amount: -1,
  });

  // Nested hierarchy state (or split this into its own store if large!)
  readonly t3_meta = signal<any>({});

  // Derived UI state using computed()
  readonly isSubmitDisabled = computed(
    () => this.eventsListLength() <= 0 || !this.paymentIntent().id
  );

  readonly submitButtonText = computed(() => {
    const amount = this.paymentIntent().amount;
    return amount > 0 ? `Pay €${amount}` : 'Continue';
  });
}