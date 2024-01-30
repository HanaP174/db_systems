import {Component, OnInit} from "@angular/core";
import {AuthService} from "../shared/services/auth-service";
import {User} from "../shared/model/LibraryModel";
import {Router} from "@angular/router";

@Component({
  selector: 'user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css']
})
export class UserComponent implements OnInit {

  user: User = new User();

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.user = this.authService.user;
  }

  logout() {
    this.authService.logout();
  }

  history() {
    this.router.navigate(['/history'])
  }

  personPage() {
    this.router.navigate(['/person-page'])
  }
}
