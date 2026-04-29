import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';
import { ToastService } from './toast';

const BASE_URL = 'https://publicaxis-backend-6enzsdbexa-uc.a.run.app/api';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = BASE_URL;
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private handleError = (err: any): Observable<never> => {
    const message = err.status === 0
      ? 'Connection interrupted. Please try again.'
      : err.status >= 500
        ? 'Server error. Please try again later.'
        : err.error?.detail || err.message || 'An unexpected error occurred.';
    this.toast.error(message);
    return throwError(() => err);
  };

  sendChatMessage(query: string, language: string = 'English'): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat`, { query, language }).pipe(
      timeout(60000),
      catchError(this.handleError)
    );
  }

  validateForm(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/validate-form`, formData).pipe(
      timeout(60000),
      catchError(this.handleError)
    );
  }

  getCandidate(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/${id}`).pipe(
      timeout(30000),
      catchError(this.handleError)
    );
  }

  factCheckImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/fact-check`, formData).pipe(
      timeout(60000),
      catchError(this.handleError)
    );
  }

  reportIssue(file: File, latitude: number, longitude: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    return this.http.post(`${this.baseUrl}/report-issue`, formData).pipe(
      timeout(60000),
      catchError(this.handleError)
    );
  }
}
