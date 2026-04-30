/**
 * PublicAxis — Civic Access Auditor Component
 * Uses device camera + GPS + Gemini 2.5 Flash to generate geo-tagged infrastructure audits.
 * Supports camera capture, file upload, and drag-and-drop.
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Api } from '../../services/api';
import { ToastService } from '../../services/toast';
import { ImageUtils } from '../../services/image-utils';
import { InfrastructureReport } from '../../models/api.models';

@Component({
  selector: 'app-infra-tracker',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './infra-tracker.html',
  styleUrls: ['./infra-tracker.css']
})
export class InfraTracker {
  private api = inject(Api);
  private toast = inject(ToastService);
  private imageUtils = inject(ImageUtils);

  reportResult = signal<InfrastructureReport | null>(null);
  loading = signal(false);
  error = signal('');
  locationStatus = signal('Waiting for image upload...');
  isDragActive = signal(false);

  /** Open the device's native camera for infrastructure capture. */
  openCamera(inputElement: HTMLInputElement): void {
    this.toast.info('Opening native camera for high-resolution capture...');
    inputElement.click();
  }

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
    const originalFile = input.files?.[0];
    if (originalFile) {
      this.processFile(originalFile);
    }
  }

  /**
   * Compress, geolocate, and upload an infrastructure image for AI evaluation.
   * Acquires GPS coordinates via the Geolocation API before submitting to the backend.
   */
  private async processFile(originalFile: File): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    this.reportResult.set(null);
    this.locationStatus.set('Compressing image for fast upload...');
    this.imageUtils.triggerHaptic();

    const file = await this.imageUtils.compressImage(originalFile);
    this.locationStatus.set('Acquiring GPS coordinates...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locationStatus.set('GPS Acquired. Analyzing image via Gemini Vision...');
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          this.api.reportIssue(file, lat, lng).subscribe({
            next: (res: InfrastructureReport) => {
              this.reportResult.set(res);
              this.loading.set(false);
              this.locationStatus.set('Analysis Complete.');
              this.toast.success('Infrastructure Audit Complete');
            },
            error: (err) => {
              this.error.set('Failed to submit report: ' + (err.error?.detail || err.message));
              this.loading.set(false);
              this.locationStatus.set('Error.');
            }
          });
        },
        () => {
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

  /** Get a color code based on severity score (green < 4, yellow < 8, red >= 8). */
  getSeverityColor(score: number): string {
    if (score < 4) return '#10b981';
    if (score < 8) return '#f59e0b';
    return '#ef4444';
  }
}
