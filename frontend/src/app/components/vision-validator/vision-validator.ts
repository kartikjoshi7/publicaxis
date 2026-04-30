/**
 * PublicAxis — Form 6 Vision Validator Component
 * Uses Gemini 2.5 Flash multimodal vision to analyze voter registration documents.
 * Supports camera capture, file upload, and drag-and-drop.
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { ToastService } from '../../services/toast';
import { ImageUtils } from '../../services/image-utils';
import { ValidationResult, FormValidationResponse } from '../../models/api.models';

@Component({
  selector: 'app-vision-validator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vision-validator.html',
  styleUrls: ['./vision-validator.css']
})
export class VisionValidator {
  private api = inject(Api);
  private toast = inject(ToastService);
  private imageUtils = inject(ImageUtils);

  validationResult = signal<ValidationResult | null>(null);
  loading = signal(false);
  error = signal('');
  isDragActive = signal(false);

  /** Open the device's native camera for high-resolution document capture. */
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
   * Compress and upload a document image for AI-powered validation.
   * Uses the shared ImageUtils service for client-side compression.
   */
  private async processFile(originalFile: File): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    this.validationResult.set(null);
    this.imageUtils.triggerHaptic();
    
    const file = await this.imageUtils.compressImage(originalFile);
    
    this.api.validateForm(file).subscribe({
      next: (res: FormValidationResponse) => {
        this.validationResult.set(res.validation_result);
        this.loading.set(false);
        this.toast.success('Document Successfully Analyzed');
      },
      error: (err) => {
        this.error.set('Validation failed: ' + (err.error?.detail || err.message));
        this.loading.set(false);
      }
    });
  }
}
