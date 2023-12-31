import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthRequestService} from "./auth.request.service";
import {switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SseRequestService {
    private baseUrl = environment.backendUrl;

    constructor(private http: HttpClient, private authRequestService: AuthRequestService) {
    }

    completeNotificationSSE(username: string) {
        let params = new HttpParams();
        params = params.set('username', username.toString());
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) =>
                this.http.delete(`${this.baseUrl}/sse/notifications/complete`, {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token}), params
                })))
    }
}
