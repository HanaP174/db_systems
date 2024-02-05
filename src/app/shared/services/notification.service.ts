import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification, NotificationType } from '../model/LibraryModel';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly API_BASE = 'http://localhost:8080/api/library';

  constructor(private httpClient: HttpClient) { }

  public addNotification(notification: Notification): Observable<any> {
    const apirUrl = `${this.API_BASE}/notification/add`;

    return this.httpClient.post(apirUrl, notification);
  }

  public getAllNotifications(): Observable<Notification[]> {
    const apiUrl = `${this.API_BASE}/notification/list`;

    return this.httpClient.get<Notification[]>(apiUrl);
  }

  public publishNotifications(notifications: Notification[], approved: boolean): Observable<any> {
    const apiUrl = `${this.API_BASE}/notification/publishList`;

    return this.httpClient.put(apiUrl, {notifications: notifications, approved: approved});
  }

  public getNotification(notificationId: string): Observable<Notification> {
    const apirUrl = `${this.API_BASE}/notification/${notificationId}`;

    return this.httpClient.get<Notification>(apirUrl);
  }

  public updateNotification(notificationId: string, notification: Notification): Observable<any> {
    const apirUrl = `${this.API_BASE}/notification/${notificationId}`;

    return this.httpClient.put(apirUrl, notification);
  }

  public deleteNotification(notificationId: string): Observable<any> {
    const apirUrl = `${this.API_BASE}/notification/${notificationId}`;

    return this.httpClient.delete(apirUrl);
  }
}
