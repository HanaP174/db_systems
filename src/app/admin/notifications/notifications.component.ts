import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../shared/services/notification.service";
import {Notification, NotificationType} from "../../shared/model/LibraryModel";
import {AuthService} from "../../shared/services/auth-service";
import {Router} from "@angular/router";

export enum SelectionType {
  NEW = 'NEW',
  EDITED = 'EDITED'
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  newAccounts: Notification[] = [];
  editedAccounts: Notification[] = [];
  selectedNew: Notification[] = [];
  selectedEdited: Notification[] = [];

  private notifications: Notification[] = [];
  readonly SelectedType = SelectionType;

  constructor(private notificationService: NotificationService,
              private authService: AuthService,
              private router: Router) {
}

  ngOnInit() {
    this.notificationService.getAllNotifications().subscribe(response => {
      this.notifications = response.filter(n => !n.published);
      this.init();
    })
  }

  onSelect(change: any, type: SelectionType, notification: Notification) {
    if (type === SelectionType.NEW) {
      if (change) {
        this.selectedNew.push(notification);
      } else {
        this.selectedNew.splice(this.selectedNew.indexOf(notification), 1);
      }
    }
    if (type === SelectionType.EDITED) {
      if (change) {
        this.selectedEdited.push(notification);
      } else {
        this.selectedEdited.splice(this.selectedEdited.indexOf(notification), 1);
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/admin'])
  }

  approve(type: SelectionType) {
    if (type === SelectionType.NEW) {
      this.notificationService.publishNotifications(this.selectedNew, true).subscribe(d => {
        if (!isNaN(d) && Number(d) === this.selectedNew.length) {
          this.selectedNew.forEach((sn) => this.newAccounts.splice(this.newAccounts.indexOf(sn)));
        }
      });
    }
    if (type === SelectionType.EDITED) {
      this.notificationService.publishNotifications(this.selectedEdited, true).subscribe(d => {
        if (!isNaN(d) && Number(d) === this.selectedEdited.length) {
          this.selectedEdited.forEach((se) => this.editedAccounts.splice(this.editedAccounts.indexOf(se)));
        }
      });
    }
  }

  decline(type: SelectionType) {
    if (type === SelectionType.NEW) {
      this.notificationService.publishNotifications(this.selectedNew, false).subscribe(d => {
        if (!isNaN(d) && Number(d) === this.selectedNew.length) {
          this.selectedNew.forEach((sn) => this.newAccounts.splice(this.newAccounts.indexOf(sn)));
        }
      });
    }
    if (type === SelectionType.EDITED) {
      this.notificationService.publishNotifications(this.selectedEdited, false).subscribe(d => {
        if (!isNaN(d) && Number(d) === this.selectedEdited.length) {
          this.selectedEdited.forEach((se) => this.editedAccounts.splice(this.editedAccounts.indexOf(se)));
        }
      });
    }
  }

  private init() {
    this.newAccounts = this.notifications.filter(not => not.type === NotificationType.NEW_ACCOUNT);
    this.editedAccounts = this.notifications.filter(not => not.type === NotificationType.ACCOUNT_CHANGE);
  }
}
