import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';

@Component({
  selector: 'app-vision-validator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vision-validator.html',
  styleUrls: ['./vision-validator.css']
})
export class VisionValidator {
  private api = inject(Api);
  validationResult = signal<any>(null);
  loading = signal(false);
  error = signal('');
  isFlashOn = signal(false);

  async toggleFlash() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      if (capabilities.torch) {
        this.isFlashOn.set(!this.isFlashOn());
        track.applyConstraints({ advanced: [{ torch: this.isFlashOn() }] as any });
      } else {
        alert("Flash/Torch is not supported on this device's camera.");
      }
    } catch (err) {
      alert("Could not access camera for flash: " + err);
    }
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

  async onFileSelected(event: any) {
    const originalFile: File = event.target.files[0];
    if (originalFile) {
      this.loading.set(true);
      this.error.set('');
      this.validationResult.set(null);
      this.triggerHaptic();
      
      const file = await this.compressImage(originalFile);
      
      this.api.validateForm(file).subscribe({
        next: (res: any) => {
          this.validationResult.set(res.validation_result);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Validation failed: ' + (err.error?.detail || err.message));
          this.loading.set(false);
        }
      });
    }
  }

  triggerHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }
}
