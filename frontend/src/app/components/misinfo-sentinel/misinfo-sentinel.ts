import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Api } from '../../services/api';

@Component({
  selector: 'app-misinfo-sentinel',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './misinfo-sentinel.html',
  styleUrls: ['./misinfo-sentinel.css']
})
export class MisinfoSentinel {
  private api = inject(Api);
  factCheckResult = signal<any>(null);
  loading = signal(false);
  error = signal('');

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.loading.set(true);
      this.error.set('');
      this.factCheckResult.set(null);
      this.api.factCheckImage(file).subscribe({
        next: (res: any) => {
          this.factCheckResult.set(res);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Fact-check failed: ' + (err.error?.detail || err.message));
          this.loading.set(false);
        }
      });
    }
  }

  getRiskColor(score: number): string {
    if (score < 30) return '#10b981'; // Green
    if (score < 70) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  }
}
