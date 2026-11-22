import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { WorkspaceViewComponent } from '../../../shared/components/workspace-view/workspace-view';
import { TenantService } from '../../../core/http/tenant.service';
import { SafeHtml } from '@angular/platform-browser';
import { PublicAPIService } from '../../../core/services/public/public-api.service';
import { MessageResponseT55 } from '../../../core/models/message.response.model';
import { EventsPublicService } from '../../../shared/services/events-public.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, WorkspaceViewComponent],
  templateUrl: './events.html',
  styleUrl: './events.scss'
})
export class EventsComponent {


  private tenantService = inject(TenantService);
  private publicAPIService = inject(PublicAPIService)
  private eventsPublicService = inject(EventsPublicService)

  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);

  msMessageRefreshTime = 300000; // 5 minutes unless hard requery for long-term static messages

  // 1. Signal holding a map of tag -> sanitized HTML
  readonly t55_messages = signal<Record<string, SafeHtml | string>>({});
 

  constructor() {
    console.log('events constructor: ' + this.tenantService.cId() + "   " + this.tenantService.isLiveSystem())

  }

  ngOnInit(): void {


  }


  ngAfterViewInit(): void {
    // 2. Call on page load
    this.getMessage('training', this.msMessageRefreshTime); // let messages come from hard requery as changes are infrequent


  }



  getMessage(tag: string, t: number): void {
    const filterBody = { cId: this.tenantService.cId(), tag };

    this.publicAPIService
      .getMessage(tag, filterBody, t)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: (res) => {
          const data = res as MessageResponseT55[];
          const rawHtml = data?.[0]?.message;
          const safeValue = rawHtml ? this.sanitizer.bypassSecurityTrustHtml(rawHtml) : '';

          // 3. Immutably update the signal for this specific tag
          this.t55_messages.update((current) => ({
            ...current,
            [tag]: safeValue,
          }));
        },

        error: () => {
          this.t55_messages.update((current) => ({
            ...current,
            [tag]: '',
          }));
        },
      });
  }



}
