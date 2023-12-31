import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthRequestService} from "./auth.request.service";
import {switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class VoteRequestService {
    private baseUrl = environment.backendUrl;

    constructor(private http: HttpClient, private authRequestService: AuthRequestService) {
    }

    addUpvote(identifier: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => this.http.post(`${this.baseUrl}/api/v1/post/upvote`, {identifier}, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
            })))
    }

    removeUpvote(identifier: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => this.http.delete(`${this.baseUrl}/api/v1/post/upvote/${identifier}`, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
            }))
        )
    }

    addDownvote(identifier: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => this.http.post(`${this.baseUrl}/api/v1/post/downvote`, {identifier}, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
            }))
        )
    }

    removeDownvote(identifier: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => this.http.delete(`${this.baseUrl}/api/v1/post/downvote/${identifier}`, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
            }))
        )
    }

    isPostUpvoted(identifier: string) {
        return this.http.get(`${this.baseUrl}/api/v1/post/upvote/${identifier}`, {withCredentials: true})
    }

    isPostDownvoted(identifier: string) {
        return this.http.get(`${this.baseUrl}/api/v1/post/downvote/${identifier}`, {withCredentials: true})
    }
}