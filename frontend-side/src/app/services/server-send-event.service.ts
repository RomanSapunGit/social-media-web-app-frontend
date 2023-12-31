import {Injectable} from '@angular/core';
import { map, Observable,  take} from "rxjs";
import {SseRequestService} from "./request/sse.request.service";
import {UserNotificationModel} from "../model/user-notification.model";
import {environment} from "../../environments/environment";
import {NotificationService} from "./entity/notification.service";
import {NotificationRequestService} from "./request/notification.request.service";

@Injectable({
    providedIn: 'root'
})
export class ServerSendEventService {
    private baseUrl = environment.backendUrl;
    private eventSources: Map<string, EventSource>;

    constructor( private requestService: NotificationRequestService, private sseRequestService: SseRequestService,
                private notificationService: NotificationService) {
        this.eventSources = new Map<string, EventSource>();
    }

    getNotificationsFromServer(): Observable<MessageEvent> {
        let username = localStorage.getItem("username");
        if (username) {
            this.eventSources.set('notifications', new EventSource(`${this.baseUrl}/sse/notifications?username=${username}`));
            return new Observable(observer => {
                const notificationEventSource = this.eventSources.get('notifications');
                if (notificationEventSource) {
                    notificationEventSource.onmessage = event => {
                        if (event.data.trim() !== ':heartbeat') {
                            observer.next(event);
                        }
                    };
                    notificationEventSource.onerror = error => {
                        if (error.eventPhase === EventSource.CLOSED) {
                            console.log('SSE connection closed by the client');
                        } else {
                            console.log('SSE connection error:', error);
                            observer.error(error);
                        }
                    };
                    window.addEventListener('beforeunload', () => {
                        if (this.eventSources.has('notifications')) {
                            this.completeSSENotificationConnection( username);
                        }
                    });
                    return () => {
                        console.log('SSE connection error:');
                        notificationEventSource.close();
                    };
                } else {
                    this.notificationService.sendErrorNotificationToSlack(
                        'connection related to notifications SSE has been lost', 'In ServerSendEventService', new Date());
                    observer.complete();
                }
                return;
            });
        }
        return new Observable();
    }

    completeSSENotificationConnection(username: string | null) {
        if ( username) {
            this.sseRequestService.completeNotificationSSE(username).pipe(take(1)).subscribe();
            this.eventSources.get('notifications')?.close();
        } else {
            console.log('Username is null');
        }

    }

    getNotifications(): Observable<UserNotificationModel[]> {
        let username = localStorage.getItem('username');
        if (username) {
            return this.requestService.getNotifications(username).pipe(
                map((response: any) => {
                    return response as UserNotificationModel[];
                })
            );
        }
        return new Observable<UserNotificationModel[]>();
    }
}
