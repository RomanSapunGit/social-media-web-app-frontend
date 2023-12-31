import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthRequestService} from "./auth.request.service";
import {switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CommentRequestService {
    private baseUrl = environment.backendUrl;

    constructor(private http: HttpClient, private authRequestService: AuthRequestService) {
    }

    getCommentsByPost(postId: string, pageNumber: number) {
        let params = new HttpParams();
        params = params.set('pageNumber', pageNumber.toString());
        return this.http.get(`${this.baseUrl}/api/v1/comment/${postId}`, {withCredentials: true, params});
    }

    getSavedComments(pageNumber: number) {
        let params = new HttpParams();
        params = params.set('pageNumber', pageNumber.toString());
        return this.http.get(`${this.baseUrl}/api/v1/comment/saved`, {withCredentials: true, params})
    }

    addCommentToSavedList(identifier: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => this.http.post(`${this.baseUrl}/api/v1/comment/saved/${identifier}`, {}, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token as string})
            }))
        )
    }

    deleteCommentFromSavedList(identifier: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => this.http.delete(`${this.baseUrl}/api/v1/comment/saved/${identifier}`, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token as string})
            }))
        )
    }

    findCommentInSavedList(identifier: string) {
        return this.http.get(`${this.baseUrl}/api/v1/comment/saved/${identifier}`, {withCredentials: true})
    }

    createComment(postIdentifier: string | null, token: string | null, creationData: {
        title: string;
        description: string
    }) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => this.http.post(`${this.baseUrl}/api/v1/comment`, {postIdentifier, ...creationData}, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token as string})
            })))
    }

    updateComment(updateData: { title: string; description: string }, token: string | null, id: string | null) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => this.http.patch(`${this.baseUrl}/api/v1/comment/${id}`, {...updateData}, {
                withCredentials: true,
                headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token as string})
            }))
        )
    }
}