import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Api } from '../../services/api';

@Component({
  selector: 'app-infra-tracker',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './infra-tracker.html',
  styleUrls: ['./infra-tracker.css']
})
export class InfraTracker {
  private api = inject(Api);
  reportResult = signal<any>(null);
  loading = signal(false);
  error = signal('');
  locationStatus = signal('Waiting for image upload...');

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.loading.set(true);
      this.error.set('');
      this.reportResult.set(null);
      this.locationStatus.set('Acquiring GPS coordinates...');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.locationStatus.set('GPS Acquired. Analyzing image via Gemini Vision...');
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            this.api.reportIssue(file, lat, lng).subscribe({
              next: (res: any) => {
                this.reportResult.set(res);
                this.loading.set(false);
                this.locationStatus.set('Analysis Complete.');
              },
              error: (err) => {
                this.error.set('Failed to submit report: ' + (err.error?.detail || err.message));
                this.loading.set(false);
                this.locationStatus.set('Error.');
              }
            });
          },
          (geoError) => {
            this.error.set('Location access denied or unavailable. Please enable GPS.');
            this.loading.set(false);
            this.locationStatus.set('Error.');
          }
        );
      } else {
        this.error.set('Geolocation is not supported by your browser.');
        this.loading.set(false);
        this.locationStatus.set('Error.');
      }
    }
  }

  getSeverityColor(score: number): string {
    if (score < 4) return '#10b981'; // Green
    if (score < 8) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  }
}
