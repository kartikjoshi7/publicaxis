import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Api } from '../../services/api';

@Component({
  selector: 'app-kyc-radar',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './kyc-radar.html',
  styleUrls: ['./kyc-radar.css']
})
export class KycRadar {
  private api = inject(Api);
  candidateId = signal('');
  profile = signal<any>(null);
  loading = signal(false);
  error = signal('');

  searchCandidate() {
    if (!this.candidateId().trim()) return;
    this.loading.set(true);
    this.error.set('');
    this.profile.set(null);

    this.api.getCandidate(this.candidateId()).subscribe({
      next: (res: any) => {
        this.profile.set(res.profile);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to fetch profile: ' + (err.error?.detail || err.message));
        this.loading.set(false);
      }
    });
  }

  printReport() {
    window.print();
  }
}
