import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthRequestService} from "./auth.request.service";
import {switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionRequestService {
    private baseUrl = environment.backendUrl;

    constructor(private http: HttpClient, private authRequestService: AuthRequestService) {
    }


    isUserHasSubscriptions() {
        return this.http.get(`${this.baseUrl}/api/v1/user/follower`, {withCredentials: true})
    }

    addFollowing(username: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) =>
                this.http.post(`${this.baseUrl}/api/v1/user/follower`, {username}, {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token as string})
                })))
    }

    removeFollowing(username: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) =>
                this.http.delete(`${this.baseUrl}/api/v1/user/follower/${username}`, {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token as string})
                })))
    }

    findFollowingByUsername(username: string) {
        return this.http.get(`${this.baseUrl}/api/v1/user/follower/${username}`, {withCredentials: true})
    }
}