import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Api } from '../../services/api';
import { ToastService } from '../../services/toast';

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
  factCheckResult = signal<any>(null);
  loading = signal(false);
  error = signal('');
  isDragActive = signal(false);

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    this.isDragActive.set(true);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragActive.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragActive.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  private processFile(file: File) {
    this.loading.set(true);
    this.error.set('');
    this.factCheckResult.set(null);
    this.api.factCheckImage(file).subscribe({
      next: (res: any) => {
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

  getRiskColor(score: number): string {
    if (score < 30) return '#10b981';
    if (score < 70) return '#f59e0b';
    return '#ef4444';
  }
}
