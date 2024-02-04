import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../shared/services/notification.service";
import {Notification, NotificationType} from "../../shared/model/LibraryModel";
import {AuthService} from "../../shared/services/auth-service";

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
              private authService: AuthService) {
}

  ngOnInit() {
    this.notificationService.getAllNotifications().subscribe(response => {
      this.notifications = response;
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
      this.selectedEdited.push(notification);
    }
  }

  logout() {
    this.authService.logout();
  }

  approve(type: SelectionType) {
    if (type === SelectionType.NEW) {
      // todo
    }
    if (type === SelectionType.EDITED) {
      // todo
    }
  }

  decline(type: SelectionType) {
    if (type === SelectionType.NEW) {
      // todo
    }
    if (type === SelectionType.EDITED) {
      // todo
    }
  }

  private init() {
    this.newAccounts = this.notifications.filter(not => not.type === NotificationType.NEW_ACCOUNT);
    this.editedAccounts = this.notifications.filter(not => not.type === NotificationType.ACCOUNT_CHANGE);
  }
}
