import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service'

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: ` 
    <!-- Floating view stack canvas overlay pinned to top-right -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080;">
      
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast show mb-2 shadow-lg border-0" 
             role="alert" 
             aria-live="assertive" 
             aria-atomic="true">
          
          <!-- TOAST CARD HEADER BAR AREA -->
          <div class="toast-header text-white"
               [class.bg-success]="toast.type === 'success'"
               [class.bg-danger]="toast.type === 'danger'"
               [class.bg-warning]="toast.type === 'warning' || toast.type === 'info'"
               [class.text-dark]="toast.type === 'warning' || toast.type === 'info'">
            
            <!-- Contextual Status Visual Bubble -->
            <span class="rounded me-2 d-inline-block" 
                  style="width: 12px; height: 12px;"
                  [style.background-color]="toast.type === 'warning' ? '#212529' : 'rgba(255,255,255,0.7)'">
            </span>
            
            <!-- Dynamic Custom Title Text -->
            <strong class="me-auto text-uppercase small">{{ toast.header }}</strong>
            
            <!-- X CLOSE BUTTON COMPONENT WRAPPER -->
            <button type="button" 
                    class="btn-close" 
                    [class.btn-close-white]="toast.type !== 'warning' && toast.type !== 'info'"
                    (click)="toastService.dismiss(toast.id)" 
                    aria-label="Close"></button>
          </div>
          
          <!-- TOAST CARD BODY PANEL CONTENT -->
          <div class="toast-body bg-white text-dark fw-normal py-3 border border-top-0 rounded-bottom">
            {{ toast.body }}
          </div>
          
        </div>
      }
      
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
