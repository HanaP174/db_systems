import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {User, UserAuth} from "../model/LibraryModel";

@Injectable({providedIn: 'root'})
export class AuthService {

  private _token: string = '';
  private _isAuthenticated = false;
  private authenticatedSub = new Subject<boolean>();

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }


  get token(): string {
    return this._token;
  }

  constructor(private httpClient: HttpClient) {}

  // todo
  signUpUser(user: User){
    this.httpClient.post('http://localhost:8080/signUp/', user).subscribe(res => {
      console.log(res);
    })
  }

  loginUser(username: string, password: string) {
    const user: UserAuth = {username: username, password: password};

    this.httpClient.post<{token: string}>('http://localhost:8080/login', user).subscribe(response => {
      this._token = response.token;
      if (this._token) {
        this.authenticatedSub.next(true);
        this._isAuthenticated = true;
      }
    })
  }
}
