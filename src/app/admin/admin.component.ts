import {Component, OnInit} from "@angular/core";
import {AuthService} from "../shared/services/auth-service";
import {Router} from "@angular/router";
import {User} from "../shared/model/LibraryModel";
import {UserService} from "../shared/services/user.service";

@Component({
  selector: 'admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css']
})
export class AdminComponent implements OnInit {

  users: User[] = [];
  approvedUsers = 0;
  pendingUsers = 0;

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService) {
  }

  // todo load notification, users, library
  ngOnInit() {
    this.init();
  }

  logout() {
    this.authService.logout();
  }

  openNotifications() {
    this.router.navigate(['/notifications']);
  }

  openUsers() {
    this.router.navigate(['/users']);
  }

  openLibrary() {
    this.router.navigate(['/library']);
  }

  private init() {
    this.userService.getAllUsers().subscribe(response => {
      if (response) {
        this.users = response;
        this.pendingUsers = this.users.filter(user => !user.activated).length;
        this.approvedUsers = this.users.filter(user => user.activated).length;
      }
    });
  }

}
