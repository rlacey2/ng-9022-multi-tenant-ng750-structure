import { Injectable, signal } from '@angular/core';

export interface ToastConfig {
  id?: number;
  header?: string;          // Optional custom header title string
  body: string;             // The main message content block
  type?: 'success' | 'danger' | 'warning' | 'info'; // Bootstrap theme mapping
  duration?: number;        // Milliseconds before auto-dismissal (set to 0 to keep open indefinitely)
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Read-only public signal driving the reactive stack list
  readonly toasts = signal<Required<ToastConfig>[]>([]);
  private counter = 0;

  /**
   * Broadcasts a fully flexible notification package onto the workspace screen framework.
   */
  show(config: ToastConfig): void {
    const id = this.counter++;
    
    // Inject sensible architectural defaults if properties are omitted
    const completeConfig: Required<ToastConfig> = {
      id,
      header: config.header || this.getDefaultHeader(config.type || 'success'),
      body: config.body,
      type: config.type || 'success',
      duration: config.duration !== undefined ? config.duration : 3000
    };

    // Append into reactive layout pipeline
    this.toasts.update(current => [...current, completeConfig]);

    // Handle auto-expiry configuration tracking
    if (completeConfig.duration > 0) {
      setTimeout(() => this.dismiss(id), completeConfig.duration);
    }
  }

  dismiss(id: number): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  private getDefaultHeader(type: string): string {
    switch (type) {
      case 'danger': return 'System Error';
      case 'warning': return 'Attention Required';
      case 'info': return 'Notification';
      default: return 'Success';
    }
  }
}
