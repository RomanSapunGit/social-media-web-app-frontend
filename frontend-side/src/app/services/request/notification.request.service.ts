import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthRequestService} from "./auth.request.service";
import {switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NotificationRequestService {
    private baseUrl = environment.backendUrl;
    constructor(private http: HttpClient, private authRequestService: AuthRequestService) {
    }
    sendCommentNotification(commentIdentifier: string, message: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) =>
                this.http.post(`${this.baseUrl}/api/v1/notifications/comments`, {commentIdentifier, message}, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
            }))
        )
    }

    sendNewSubscriptionNotification(token: string | null, username: string, message: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) =>
                this.http.post(`${this.baseUrl}/api/v1/notifications/subscriptions`, { username, message}, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
            }))
        )
    }

    getNotifications(username: string) {
        return this.http.get(`${this.baseUrl}/api/v1/notifications/${username}`, {withCredentials: true})
    }

    sendNotificationToSlack(message: string, causedBy: string, timestamp: Date) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) =>
                this.http.post(`${this.baseUrl}/api/v1/notifications/slack`, {causedBy, timestamp, message}, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
            })))
    }
}