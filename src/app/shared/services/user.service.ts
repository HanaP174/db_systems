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

  public addUser(user: User): Observable<any> {
    user.password = btoa(user.password);
    const apirUrl = `${this.API_BASE}/user/add`;

    return this.httpClient.post(apirUrl, user);
  }

  public getAllUsers(): Observable<User[]> {
    const apiUrl = `${this.API_BASE}/user/list`;

    return this.httpClient.get<User[]>(apiUrl);
  }

  public getUser(userId: string): Observable<User> {
    const apirUrl = `${this.API_BASE}/user/${userId}`;

    return this.httpClient.get<User>(apirUrl);
  }

  public updateUser(userId: string, user: User): Observable<any> {
    const apirUrl = `${this.API_BASE}/user/${userId}`;

    return this.httpClient.put(apirUrl, user);
  }

  public deleteUser(userId: string): Observable<any> {
    const apirUrl = `${this.API_BASE}/user/${userId}`;

    return this.httpClient.delete(apirUrl);
  }
}
