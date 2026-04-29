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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.loading.set(true);
      this.error.set('');
      this.validationResult.set(null);
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
}
