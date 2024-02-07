import {Component, OnInit} from "@angular/core";
import {AuthService} from "../shared/services/auth-service";
import {Router} from "@angular/router";
import {Notification, NotificationType, User} from "../shared/model/LibraryModel";
import {UserService} from "../shared/services/user.service";
import {NotificationService} from "../shared/services/notification.service";

@Component({
  selector: 'admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css']
})
export class AdminComponent implements OnInit {

  users: User[] = [];
  approvedUsers = 0;
  pendingUsers = 0;
  notifications: Notification[] = [];

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private notificationService: NotificationService) {
  }

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

  openBackup() {
    this.router.navigate(['/backup']);
  }

  getNotificationDescription(notification: Notification) {
    switch (notification.type) {
      case NotificationType.NEW_ACCOUNT:
        return 'NEW ACCOUNT: ' + notification.description;
      case NotificationType.ACCOUNT_CHANGE:
        return 'ACCOUNT CHANGE: ' + notification.description;
      default:
        return notification.description;
    }
  }

  private init() {
    this.userService.getAllUsers().subscribe(response => {
      if (response) {
        this.users = response;
        this.pendingUsers = this.users.filter(user => !user.activated).length;
        this.approvedUsers = this.users.filter(user => user.activated).length;
      }
    });
    this.notificationService.getAllNotifications().subscribe(response => {
      if (response) {
        this.notifications = response.filter(n => !n.published);
      }
    })
  }

}
