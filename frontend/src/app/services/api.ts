import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'http://localhost:8000/api';
  private http = inject(HttpClient);

  sendChatMessage(query: string, language: string = 'English'): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat`, { query, language });
  }

  validateForm(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/validate-form`, formData);
  }

  getCandidate(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/${id}`);
  }

  factCheckImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/fact-check`, formData);
  }

  reportIssue(file: File, latitude: number, longitude: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    return this.http.post(`${this.baseUrl}/report-issue`, formData);
  }
}
