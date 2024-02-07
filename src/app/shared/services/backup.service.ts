import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private readonly API_BASE = 'http://localhost:8080/api/library';

  constructor(private httpClient: HttpClient) { }

  public export(): Observable<any> {
    const apiUrl = `${this.API_BASE}/backup/export`;

    return this.httpClient.get(apiUrl);
  }

}
