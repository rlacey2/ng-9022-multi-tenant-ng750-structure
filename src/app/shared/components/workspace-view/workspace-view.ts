// src/app/shared/components/workspace-view/workspace-view.component.ts
import { Component, input, signal, HostListener, inject, contentChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceSettingsService } from '../../../core/services/workspace-settings.service';

@Component({
  selector: 'app-workspace-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-view.html'
})
export class WorkspaceViewComponent {
  protected globalSettings = inject(WorkspaceSettingsService);

  pageTitle = input<string>('Workspace Node');
  hasLeftSidebar = input<boolean>(true);
  hasRightSidebar = input<boolean>(true);

  isMobile = signal<boolean>(false);
  leftSidebarOpen = signal<boolean>(false);
  rightSidebarOpen = signal<boolean>(false);

  projectedLeft = contentChild<ElementRef<HTMLElement>>('leftSidebarRef');
  projectedRight = contentChild<ElementRef<HTMLElement>>('rightSidebarRef');

  constructor() {
    this.checkScreenSize();

    // 🚀 THE ANIMATION & ACCESSIBILITY CORE FIX: Inject smooth cubic transitions and pure white blocks
    effect(() => {
      const mobile = this.isMobile() || this.globalSettings.headerLaunchButtons();
      const leftOpen = this.leftSidebarOpen();
      const rightOpen = this.rightSidebarOpen();
      
      const leftNode = this.projectedLeft()?.nativeElement;
      const rightNode = this.projectedRight()?.nativeElement;

      if (leftNode) {
        // Enforce solid, opaque background plates unconditionally to fix the transparency issue
        leftNode.style.backgroundColor = '#ffffff'; 
        
        if (mobile) {
          leftNode.style.position = 'absolute';
          leftNode.style.top = '0';
          leftNode.style.bottom = '0';
          leftNode.style.left = '0';
          leftNode.style.height = '100%';
          leftNode.style.width = '260px';
          leftNode.style.zIndex = '1040';
          leftNode.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'; // Restore smooth slide speed
          leftNode.style.transform = leftOpen ? 'translateX(0)' : 'translateX(-100%)';
          leftNode.style.boxShadow = leftOpen ? '4px 0 15px rgba(0,0,0,0.15)' : 'none';
        } else {
          leftNode.style.position = 'relative';
          leftNode.style.top = '';
          leftNode.style.bottom = '';
          leftNode.style.left = '';
          leftNode.style.height = '100%';
          leftNode.style.width = '260px';
          leftNode.style.zIndex = '10';
          leftNode.style.transform = 'translateX(0)';
          leftNode.style.boxShadow = 'none';
          leftNode.style.transition = '';
        }
      }

      if (rightNode) {
        rightNode.style.backgroundColor = '#f8f9fa'; // Solid light gray plate for right context drawer
        
        if (mobile) {
          rightNode.style.position = 'absolute';
          rightNode.style.top = '0';
          rightNode.style.bottom = '0';
          rightNode.style.right = '0';
          rightNode.style.height = '100%';
          rightNode.style.width = '290px';
          rightNode.style.zIndex = '1040';
          rightNode.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'; // Restore smooth slide speed
          rightNode.style.transform = rightOpen ? 'translateX(0)' : 'translateX(100%)';
          rightNode.style.boxShadow = rightOpen ? '-4px 0 15px rgba(0,0,0,0.15)' : 'none';
        } else {
          rightNode.style.position = 'relative';
          rightNode.style.top = '';
          rightNode.style.bottom = '';
          rightNode.style.right = '';
          rightNode.style.height = '100%';
          rightNode.style.width = '290px';
          rightNode.style.zIndex = '10';
          rightNode.style.transform = 'translateX(0)';
          rightNode.style.boxShadow = 'none';
          rightNode.style.transition = '';
        }
      }
    });
  }

  @HostListener('window:resize')
  onResize() { this.checkScreenSize(); }

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
