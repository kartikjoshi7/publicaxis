/**
 * PublicAxis — KYC Radar Component
 * AI-generated candidate background profiles for informed civic participation.
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Api } from '../../services/api';
import { ToastService } from '../../services/toast';
import { CandidateProfile } from '../../models/api.models';

@Component({
  selector: 'app-kyc-radar',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './kyc-radar.html',
  styleUrls: ['./kyc-radar.css']
})
export class KycRadar {
  private api = inject(Api);
  private toast = inject(ToastService);

  candidateId = signal('');
  profile = signal<string | null>(null);
  loading = signal(false);
  error = signal('');

  /** Search for a candidate's AI-generated background profile. */
  searchCandidate(): void {
    if (!this.candidateId().trim()) return;
    this.loading.set(true);
    this.error.set('');
    this.profile.set(null);

    this.api.getCandidate(this.candidateId()).subscribe({
      next: (res: CandidateProfile) => {
        this.profile.set(res.profile);
        this.loading.set(false);
        this.toast.success('Candidate Profile Retrieved');
      },
      error: (err) => {
        this.error.set('Failed to fetch profile: ' + (err.error?.detail || err.message));
        this.loading.set(false);
      }
    });
  }

  /** Trigger the browser's print dialog for the current report. */
  printReport(): void {
    window.print();
  }
}
