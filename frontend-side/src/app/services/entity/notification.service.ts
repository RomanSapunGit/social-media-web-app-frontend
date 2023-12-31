import {Injectable} from '@angular/core';
import { Subject, Subscription} from "rxjs";
import {NotificationModel} from "../../model/notification.model";
import {NotificationRequestService} from "../request/notification.request.service";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject: Subject<NotificationModel> = new Subject<NotificationModel>();
  private subscription: Subscription;
  constructor(private requestService: NotificationRequestService) {
    this.subscription = new Subscription();
  }

  get notification$() {
    return this.notificationSubject.asObservable();
  }

  showNotification(message: string, isError: boolean): void {
    this.notificationSubject.next(new NotificationModel(message, isError));
  }

  sendErrorNotificationToSlack(message: string, causedBy:string, timestamp: Date): void {
    console.log(message)
     this.subscription = this.requestService.sendNotificationToSlack(message, causedBy, timestamp).subscribe();
    
  }
}
