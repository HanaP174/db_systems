import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/LibraryModel";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_BASE = 'http://localhost:8080/api/library';

  constructor(private httpClient: HttpClient) { }

  public getAllUsers(): Observable<User[]> {
    const apiUrl = `${this.API_BASE}/user/list`;

    return this.httpClient.get<User[]>(apiUrl);
  }
}
