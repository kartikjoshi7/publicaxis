/**
 * PublicAxis Frontend — API Service
 * Centralized HTTP client for all backend communication.
 * All methods return strongly-typed Observables matching backend Pydantic models.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ToastService } from './toast';
import {
  ChatResponse,
  FormValidationResponse,
  CandidateProfile,
  FactCheckResult,
  InfrastructureReport
} from '../models/api.models';

/** Backend API base URL (Google Cloud Run). */
const BASE_URL = 'https://publicaxis-backend-23063176487.us-central1.run.app/api';

/** Default timeout for AI inference calls (ms). */
const AI_TIMEOUT_MS = 60000;

/** Default timeout for lightweight lookups (ms). */
const LOOKUP_TIMEOUT_MS = 30000;

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly baseUrl = BASE_URL;
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  /**
   * Centralized error handler for all API calls.
   * Displays a user-friendly toast and re-throws for component-level handling.
   */
  private handleError = (err: { status: number; error?: { detail?: string }; message?: string }): Observable<never> => {
    const message = err.status === 0
      ? 'Connection interrupted. Please try again.'
      : err.status >= 500
        ? 'Server error. Please try again later.'
        : err.error?.detail || err.message || 'An unexpected error occurred.';
    this.toast.error(message);
    return throwError(() => err);
  };

  /** Send a civic query to the Omni-Civic Copilot and receive a step-by-step response. */
  sendChatMessage(query: string, language: string = 'English'): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/chat`, { query, language }).pipe(
      timeout(AI_TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  /** Upload a Form 6 image for AI-powered document validation. */
  validateForm(file: File): Observable<FormValidationResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FormValidationResponse>(`${this.baseUrl}/validate-form`, formData).pipe(
      timeout(AI_TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  /** Retrieve an AI-generated candidate background profile. */
  getCandidate(id: string): Observable<CandidateProfile> {
    return this.http.get<CandidateProfile>(`${this.baseUrl}/candidate/${id}`).pipe(
      timeout(LOOKUP_TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  /** Upload a suspicious image for misinformation fact-checking. */
  factCheckImage(file: File): Observable<FactCheckResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FactCheckResult>(`${this.baseUrl}/fact-check`, formData).pipe(
      timeout(AI_TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  /** Submit a geo-tagged infrastructure issue report with image evidence. */
  reportIssue(file: File, latitude: number, longitude: number): Observable<InfrastructureReport> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    return this.http.post<InfrastructureReport>(`${this.baseUrl}/report-issue`, formData).pipe(
      timeout(AI_TIMEOUT_MS),
      catchError(this.handleError)
    );
  }
}
