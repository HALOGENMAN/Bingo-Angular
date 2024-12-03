
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get('/assets/jsons/config.json'))
      .then((config) => {
        this.config = config;
      })
      .catch((error) => {
        console.error('Could not load configuration', error);
        throw error;
      });
  }

  getConfig(): any {
    return this.config;
  }
}
