import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Api } from '../../services/api';
import { ToastService } from '../../services/toast';

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
  reportResult = signal<any>(null);
  loading = signal(false);
  error = signal('');
  locationStatus = signal('Waiting for image upload...');
  isDragActive = signal(false);
  openCamera(inputElement: HTMLInputElement) {
    this.toast.info('Opening native camera for high-resolution capture...');
    inputElement.click();
  }

  async compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1080;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.7);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

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

  async onFileSelected(event: any) {
    const originalFile: File = event.target.files[0];
    if (originalFile) {
      this.processFile(originalFile);
    }
  }

  private async processFile(originalFile: File) {
    this.loading.set(true);
    this.error.set('');
    this.reportResult.set(null);
    this.locationStatus.set('Compressing image for fast upload...');
    this.triggerHaptic();

    const file = await this.compressImage(originalFile);
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
              this.toast.success('Infrastructure Audit Complete');
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

  getSeverityColor(score: number): string {
    if (score < 4) return '#10b981';
    if (score < 8) return '#f59e0b';
    return '#ef4444';
  }

  triggerHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }
}
