// src/app/shared/components/workspace-view/workspace-view.component.ts
import { Component, OnDestroy, input, signal, HostListener, inject, contentChild, ElementRef, effect, untracked, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceSettingsService } from '../../../core/services/workspace-settings.service';

@Component({
  selector: 'app-workspace-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-view.html' // Verify this matches your filename
})
export class WorkspaceViewComponent implements OnDestroy {
  protected globalSettings = inject(WorkspaceSettingsService);

  pageTitle = input<string>('Workspace Node');
  hasLeftSidebar = input<boolean>(true);
  hasRightSidebar = input<boolean>(true);

  projectedLeft = contentChild<ElementRef<HTMLElement>>('leftSidebarRef');
  projectedRight = contentChild<ElementRef<HTMLElement>>('rightSidebarRef');

  readonly isLeftPresent = computed(() => this.hasLeftSidebar() && !!this.projectedLeft());
  readonly isRightPresent = computed(() => this.hasRightSidebar() && !!this.projectedRight());

  isMobile = signal<boolean>(false);
  leftSidebarOpen = signal<boolean>(false);
  rightSidebarOpen = signal<boolean>(false);

  // Capture baseline trigger counts on init so route changes don't auto-open drawers
  private initialLeftTrigger = untracked(() => this.globalSettings.leftTriggerCount());
  private initialRightTrigger = untracked(() => this.globalSettings.rightTriggerCount());

  constructor() {
    this.checkScreenSize();

    // 1. Broadcast sidebar presence to global header
    effect(() => {
      this.globalSettings.setSidebarPresence(this.isLeftPresent(), this.isRightPresent());
    });

    // 2. Listen for elevated header button clicks (only fires on new clicks)
    effect(() => {
      const currentCount = this.globalSettings.leftTriggerCount();
      if (currentCount > this.initialLeftTrigger) {
        this.initialLeftTrigger = currentCount;
        untracked(() => this.toggleLeft());
      }
    });

    effect(() => {
      const currentCount = this.globalSettings.rightTriggerCount();
      if (currentCount > this.initialRightTrigger) {
        this.initialRightTrigger = currentCount;
        untracked(() => this.toggleRight());
      }
    });

    // 3. Apply responsive drawer styles to projected elements
    effect(() => {
      const mobile = this.isMobile(); // Strictly bound to viewport width
      const leftOpen = this.leftSidebarOpen();
      const rightOpen = this.rightSidebarOpen();

      const leftNode = this.projectedLeft()?.nativeElement;
      const rightNode = this.projectedRight()?.nativeElement;

      if (leftNode) {
        if (!this.hasLeftSidebar()) {
          leftNode.style.display = 'none';
        } else {
          leftNode.style.display = '';
          leftNode.style.backgroundColor = '#ffffff';
          leftNode.style.width = 'var(--sidebar-left-width)';
          leftNode.style.height = '100%';

          if (mobile) {
            leftNode.style.position = 'absolute';
            leftNode.style.top = '0';
            leftNode.style.bottom = '0';
            leftNode.style.left = '0';
            leftNode.style.zIndex = '1040';
            leftNode.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
            leftNode.style.transform = leftOpen ? 'translateX(0)' : 'translateX(-100%)';
            leftNode.style.boxShadow = leftOpen ? '4px 0 15px rgba(0,0,0,0.15)' : 'none';
          } else {
            leftNode.style.position = 'relative';
            leftNode.style.top = '';
            leftNode.style.bottom = '';
            leftNode.style.left = '';
            leftNode.style.zIndex = '10';
            leftNode.style.transition = '';
            leftNode.style.transform = 'translateX(0)';
            leftNode.style.boxShadow = 'none';
          }
        }
      }

      if (rightNode) {
        if (!this.hasRightSidebar()) {
          rightNode.style.display = 'none';
        } else {
          rightNode.style.display = '';
          rightNode.style.backgroundColor = '#f8f9fa';
          rightNode.style.width = 'var(--sidebar-right-width)';
          rightNode.style.height = '100%';

          if (mobile) {
            rightNode.style.position = 'absolute';
            rightNode.style.top = '0';
            rightNode.style.bottom = '0';
            rightNode.style.right = '0';
            rightNode.style.zIndex = '1040';
            rightNode.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
            rightNode.style.transform = rightOpen ? 'translateX(0)' : 'translateX(100%)';
            rightNode.style.boxShadow = rightOpen ? '-4px 0 15px rgba(0,0,0,0.15)' : 'none';
          } else {
            rightNode.style.position = 'relative';
            rightNode.style.top = '';
            rightNode.style.bottom = '';
            rightNode.style.right = '';
            rightNode.style.zIndex = '10';
            rightNode.style.transition = '';
            rightNode.style.transform = 'translateX(0)';
            rightNode.style.boxShadow = 'none';
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.globalSettings.setSidebarPresence(false, false);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      const mobileState = window.innerWidth < 992;
      this.isMobile.set(mobileState);
      if (!mobileState) this.closeBoth();
    }
  }

  toggleLeft() {
    this.leftSidebarOpen.update(v => !v);
    if (this.leftSidebarOpen()) this.rightSidebarOpen.set(false);
  }

  toggleRight() {
    this.rightSidebarOpen.update(v => !v);
    if (this.rightSidebarOpen()) this.leftSidebarOpen.set(false);
  }

  closeBoth() {
    this.leftSidebarOpen.set(false);
    this.rightSidebarOpen.set(false);
  }
}
