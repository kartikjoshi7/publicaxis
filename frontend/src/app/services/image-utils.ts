/**
 * PublicAxis Frontend — Image Utility Service
 * Shared image processing functions used by Vision Validator and Infra Tracker.
 * Extracted to a single service to follow the DRY principle.
 */
import { Injectable } from '@angular/core';

/** Maximum image width before compression (pixels). */
const MAX_IMAGE_WIDTH = 1080;

/** JPEG compression quality (0.0 - 1.0). */
const JPEG_QUALITY = 0.7;

@Injectable({
  providedIn: 'root'
})
export class ImageUtils {

  /**
   * Compress an image file by resizing to a max width and re-encoding as JPEG.
   * Reduces upload payload size for faster Cloud Run processing.
   * @param file - Original image file from the user's device or file picker.
   * @returns A compressed JPEG File, or the original file if compression fails.
   */
  compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > MAX_IMAGE_WIDTH) {
            height *= MAX_IMAGE_WIDTH / width;
            width = MAX_IMAGE_WIDTH;
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
          }, 'image/jpeg', JPEG_QUALITY);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Trigger a short haptic vibration for tactile feedback on mobile devices.
   * Silently no-ops if the Vibration API is not supported.
   */
  triggerHaptic(): void {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }
}
