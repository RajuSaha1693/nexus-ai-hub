import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class Ai {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  askNexus(message: string, model: string) {
    return this.http.post<{ reply: string }>(this.apiUrl, { message, model });
  }
}
