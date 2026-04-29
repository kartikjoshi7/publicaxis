import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'http://localhost:8000/api';
  private http = inject(HttpClient);

  sendChatMessage(query: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat`, { query });
  }

  validateForm(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/validate-form`, formData);
  }

  getCandidate(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/${id}`);
  }
}
