import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {User, UserAuth} from "../model/LibraryModel";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {

  private _token: string = '';
  private _isAuthenticated = false;
  private _user = new User();
  private authenticatedSub = new Subject<boolean>();
  private logoutTimer: any;

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }


  get token(): string {
    return this._token;
  }

  get user(): User {
    return this._user;
  }

  constructor(private httpClient: HttpClient,
              private router: Router) {}

  signUpUser(user: User){
    this.httpClient.post('http://localhost:8080/api/library/user/add', user).subscribe(res => {
      if (res) {
        this.router.navigate(['/home'])
      }
    })
  }

  loginUser(username: string, password: string) {
    const user: UserAuth = {username: username, password: password};

    this.httpClient.post<{token: string, expiresIn: number, user: User}>('http://localhost:8080/api/library/user/login', user).subscribe(response => {
      this._token = response.token;
      if (this._token) {
        this.authenticatedSub.next(true);
        this._isAuthenticated = true;
        this._user = response.user;
        console.log(this._user);
        this.navigate();
        this.logoutTimer = setTimeout(() => {this.logout()}, response.expiresIn * 1000);
        const now = new Date();
        const expiresDate = new Date(now.getTime() + (response.expiresIn * 1000));
        localStorage.setItem('token', this._token);
        localStorage.setItem('expiresIn', expiresDate.toISOString());
      }
    })
  }

  logout(){
    this._token = '';
    this._isAuthenticated = false;
    this.authenticatedSub.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.logoutTimer);
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  private navigate() {
    if (this._user.role === 'USER') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/admin']);
    }
  }
}
