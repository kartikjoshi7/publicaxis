import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private container: HTMLElement | null = null;

  private ensureContainer(): HTMLElement {
    if (!this.container || !document.body.contains(this.container)) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  show(message: string, type: ToastType = 'info', durationMs = 3000): void {
    const container = this.ensureContainer();
    const toast = document.createElement('div');
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.className = `toast toast-${type}`;
    toast.textContent = `${icon} ${message}`;
    container.appendChild(toast);

    // Haptic feedback on success
    if (type === 'success' && navigator.vibrate) {
      navigator.vibrate(10);
    }

    setTimeout(() => {
      toast.remove();
    }, durationMs);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }
}
