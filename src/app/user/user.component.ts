import {Component, OnInit} from "@angular/core";
import {AuthService} from "../shared/services/auth-service";
import {User} from "../shared/model/LibraryModel";

@Component({
  selector: 'user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css']
})
export class UserComponent implements OnInit {

  user: User = new User();

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.user = this.authService.user;
  }

  logout() {
    this.authService.logout();
  }
}
