import { Component, computed, effect, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { WorkspaceViewComponent } from '../../../shared/components/workspace-view/workspace-view';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormMapperChangeTracker } from '../../../shared/utils/FormMapperChangeTracker';
import { MatExpansionModule  } from '@angular/material/expansion';
import { MatIconModule  } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventConfigurationService } from '../../../core/services/event-configuration.service';
import { Router } from '@angular/router';
import { EventConfigurationModel } from '../../../shared/models/shared.models';

// Use a unique storage key (optionally include the route or feature name)
const PANEL_STATE_STORAGE_KEY = 'cms_panel_open_states';


@Component({
  selector: 'app-cms',
  templateUrl: './cms.html',
  styleUrls: ['./cms.scss'],
    imports: [CommonModule, WorkspaceViewComponent,
    // 1. Keep the high-level Angular Material Modules
    MatExpansionModule, 
    MatIconModule,  
    MatButtonModule, 
 

    ],
})
export class CmsComponent implements OnInit {
 
    private router = inject(Router);
   protected readonly eventService = inject(EventConfigurationService);


  // 2. Wire directly to the service's working signal (replaces your local signal({...}))
   protected readonly eventConfiguration:any = this.eventService.eventConfiguration;

  // Optional: Expose the "Before" snapshot and diff signals directly to your template
  protected readonly baselineEvent = this.eventService.baselineEvent;
  protected readonly hasUnsavedChanges = this.eventService.hasUnsavedChanges;

  protected readonly zzzzzeventConfiguration  = signal({
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
  });





 private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));


  // 20261107 20:30:12: Root form tracker instance managing overall document edits
// Keep your class field assignments as pure definitions:
protected readonly mapperChanges = new FormMapperChangeTracker();

protected readonly templateMetaChanges = this.mapperChanges.forChild('template_meta');
protected readonly singleMetaChanges = this.mapperChanges.forChild('single_meta');
protected readonly paymentMetaChanges = this.mapperChanges.forChild('payment_meta');
protected readonly promotionCodeChanges = this.mapperChanges.forChild('promotionCodes');
protected readonly attendeeMetaChanges = this.mapperChanges.forChild('attendees_meta');
protected readonly offeringsChanges = this.mapperChanges.forChild('offerings');

  protected readonly validationErrors = signal<{ [path: string]: boolean }>({
    'name': true,
    'promotionCodes.1': true,
    'payment_meta.paymentRequired': true
  });



// 1. Keep it as a plain object dictionary, but remove the ':any' type buster
protected readonly openStates = signal<{ [key: number]: boolean }>({
  1: false, 2: false, 3: false, 4: false, 5: false, 7: false, 8: false, 9: false, 10: false
}); 

// 2. Safe panel checker method using object property lookup
protected isPanelExpanded(id: number): boolean { 
  return !!this.openStates()[id];
}

// 3. Safe toggle method that guards against infinite loops by skipping redundant updates
protected togglePanel(id: number, forceState?: boolean): void {
  this.openStates.update(prev => {
    const nextState = forceState !== undefined ? forceState : !prev[id];
    
    // 🛑 CRITICAL GUARD: If the state isn't actually changing, return the exact 
    // same reference to completely halt the change-detection infinite loop!
    if (prev[id] === nextState) {
      return prev;
    }
    
    return { ...prev, [id]: nextState };
  });
}

// 4. Safe global expansion method
protected setGlobalExpansion(state: boolean): void {
 
  this.openStates.update((prev:any) => {
    // Check if anything actually needs to change first
    const needsUpdate = Object.values(prev).some(v => v !== state);
    if (!needsUpdate) return prev;

    const next = { ...prev };
    Object.keys(next).forEach(k => next[Number(k)] = state);
    return next;
  });
}

      // Add this property to your class variables
protected readonly sectionIds = [1, 2, 3, 4, 5, 7, 8, 9, 10];

// 1. Change your computed signal to calculate a pure Set of invalid IDs
protected readonly invalidSections:any = computed(() => {
  // Read the dependencies cleanly at the start
  this.mapperChanges.version;
  const activePaths = this.mapperChanges.getChangedPaths();
  const errors = this.validationErrors();

  const pathHasError = (prefix: string) => activePaths.some(p => p.startsWith(prefix) && errors[p]);
  
  const cms01HasError = pathHasError('promotionCodes') || activePaths.some(p => !p.includes('.') && errors[p]);

  const invalidSet = new Set<number>();
  
  if (cms01HasError) invalidSet.add(1);
  if (pathHasError('template_meta')) invalidSet.add(2);
  if (pathHasError('overview')) invalidSet.add(3);
  if (pathHasError('footer')) invalidSet.add(4);
  if (pathHasError('organisation')) invalidSet.add(5);
  if (pathHasError('payment_meta')) invalidSet.add(7);
  if (pathHasError('single_meta')) invalidSet.add(8);
  if (pathHasError('attendees_meta')) invalidSet.add(9);
  if (pathHasError('offerings')) invalidSet.add(10);

  return invalidSet;
});

// ✅ Use a plain helper method to keep lookups reference-stable
protected sectionHasError(n: number): boolean {
  // Read version cleanly to record the reactive dependency update map
  this.mapperChanges.version;

  const activePaths = this.mapperChanges.getChangedPaths();
  const errors = this.validationErrors();

  const pathHasError = (prefix: string) => activePaths.some(p => p.startsWith(prefix) && errors[p]);
  const cms01HasError = pathHasError('promotionCodes') || activePaths.some(p => !p.includes('.') && errors[p]);

  switch (n) {
    case 1: return cms01HasError;
    case 2: return pathHasError('template_meta');
    case 3: return pathHasError('overview');
    case 4: return pathHasError('footer');
    case 5: return pathHasError('organisation');
    case 7: return pathHasError('payment_meta');
    case 8: return pathHasError('single_meta');
    case 9: return pathHasError('attendees_meta');
    case 10: return pathHasError('offerings');
    default: return false;
  }
}


  // 1. Automatically receives 'eventId' from the route (transforms string | undefined to number | undefined)
  readonly eventId = input<number | undefined, string | undefined>(undefined, {
    transform: (val:any) => {
      if (!val) return undefined;
      const parsed = Number(val);
      return Number.isNaN(parsed) ? undefined : parsed;
    },
  });


  constructor() { 
       // 2. Reacts automatically whenever eventId changes; cleans up automatically on destroy
    effect(() => {
      const id = this.eventId();
      if (id !== undefined) {
        this.eventService.loadEventById(id).subscribe();
      }
    });
  

  }

   
  ngOnInit(): void {
       console.log('CmsComponent initialized');
    // Automatically check localStorage on component load/render
    this.recallPanelStates();

  }


  // Source 1: Called when user picks an event from your Search Dialog
  onSelectFromSearchDialog(selectedEventId: number, forceRefresh = false): void {
    // Updating the URL keeps browser history in sync and triggers paramMap above,
    // or call loadEventById(selectedEventId, forceRefresh) directly if not changing the URL
    this.router.navigate(['/cms', selectedEventId]);
  }

  // Force bypasses cache and hits the server API
  onForceRefresh(): void {
    const currentId = this.eventConfiguration().eventId;
    if (currentId !== null) {
      this.eventService.loadEventById(currentId, true).subscribe();
    }
  }
 
  // Source 3: Called by your "New" sidebar menu (Alpha / Beta)
  onCreateNew(type: 'Alpha' | 'Beta'): void {
    console.log('onCreateNew')
    this.eventService.initNewEvent({ name: `New ${type} Event` });
    this.router.navigate(['/cms']);
  }

  

    /**
   * Saves the current boolean map from openStates() to localStorage
   */
  storePanelStates(): void {
    if (!this.isBrowser) return;

    try {
      const serialized = JSON.stringify(this.openStates());
      localStorage.setItem(PANEL_STATE_STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to store panel states to localStorage:', error);
    }
  }

  /**
   * Reads saved boolean states from localStorage and updates the openStates signal
   */
  recallPanelStates(): void {
    if (!this.isBrowser) return;

    try {
      const raw = localStorage.getItem(PANEL_STATE_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);

      // Validate that the parsed data is a plain object before applying to the signal
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        const sanitized: Record<number, boolean> = {};

        for (const id of this.sectionIds) {
          if (typeof parsed[id] === 'boolean') {
            sanitized[id] = parsed[id];
          }
        }

        this.openStates.set(sanitized);
      }
    } catch (error) {
      console.error('Failed to recall panel states from localStorage:', error);
    }
  }
 
  // ✅ Safe, non-looping count string evaluator
protected getAccordionCountText(id: number): string {
  const data:any = this.eventConfiguration();
  
  const countStats = (arr: any[]) => {
    const total = arr?.length || 0;
    const active = arr?.filter(i => this.checkActive(i)).length || 0;
    return `[${active}:${total}]`;
  };

  switch (id) {
    case 1: return countStats(data.promotionCodes);
    case 2: return `[0:0]`;
    case 3: return countStats(data.overview.data);
    case 4: return countStats(data.footer.data);
    case 5: return `[${this.checkActive(data.organisation.meta) ? 1 : 0}:1]`;
    case 7: return `[0:0]`;
    case 8: return countStats(data.single_meta.optional_fields);
    case 9: return countStats(data.attendees_meta.optional_fields);
    case 10: return countStats(data.offerings.data);
    default: return `[0:0]`;
  }
}

  private checkActive(item: any): boolean {
    if (item.enabled !== undefined) return !!item.enabled;
    if (item.visible !== undefined) return !!item.visible;
    if (item.active !== undefined) return !!item.active;
    return false;
  }


  protected filterFields(fields: any[], type: 'h' | 'f'): any[] { return fields.filter(item => item.which === type); }

protected jumpToAccordion(id: number): void {
  // 1. Force the expansion panel state to open first
  this.openStates.update(prev => {
    if (prev[id] === true) return prev; 
    return { ...prev, [id]: true };
  });
  
  // 2. Wait for Angular's slide animations to complete
  setTimeout(() => {
    const viewport = document.querySelector('.local-scroll-viewport') as HTMLElement;
    const targetPanel = document.querySelector(`.panel-node[data-id="${id}"]`) as HTMLElement;

    if (viewport && targetPanel) {
      // Calculate layout coordinates relative to screen boundaries
      const viewportRect = viewport.getBoundingClientRect();
      const targetRect = targetPanel.getBoundingClientRect();

      // Compute how far down the panel sits from the top of the container scroll track
      const relativeTop = targetRect.top - viewportRect.top + viewport.scrollTop;

      // Execute a precise container scroll update
      viewport.scrollTo({
        top: relativeTop,
        behavior: 'smooth'
      });
    }
  }, 150); // 150ms accommodates Material expansion animations
}



}