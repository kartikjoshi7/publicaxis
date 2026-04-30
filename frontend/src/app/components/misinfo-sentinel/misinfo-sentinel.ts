/**
 * PublicAxis — Misinfo Sentinel Component
 * Uses Gemini 2.5 Flash to fact-check uploaded images of suspicious circulars.
 * Supports file upload and drag-and-drop.
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Api } from '../../services/api';
import { ToastService } from '../../services/toast';
import { FactCheckResult } from '../../models/api.models';

@Component({
  selector: 'app-misinfo-sentinel',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './misinfo-sentinel.html',
  styleUrls: ['./misinfo-sentinel.css']
})
export class MisinfoSentinel {
  private api = inject(Api);
  private toast = inject(ToastService);

  factCheckResult = signal<FactCheckResult | null>(null);
  loading = signal(false);
  error = signal('');
  isDragActive = signal(false);

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.isDragActive.set(true);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragActive.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragActive.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  /** Upload a suspicious image for AI-powered misinformation analysis. */
  private processFile(file: File): void {
    this.loading.set(true);
    this.error.set('');
    this.factCheckResult.set(null);
    this.api.factCheckImage(file).subscribe({
      next: (res: FactCheckResult) => {
        this.factCheckResult.set(res);
        this.loading.set(false);
        this.toast.success('Fact-Check Analysis Complete');
      },
      error: (err) => {
        this.error.set('Fact-check failed: ' + (err.error?.detail || err.message));
        this.loading.set(false);
      }
    });
  }

  /** Get a color code based on risk score (green < 30, yellow < 70, red >= 70). */
  getRiskColor(score: number): string {
    if (score < 30) return '#10b981';
    if (score < 70) return '#f59e0b';
    return '#ef4444';
  }
}
