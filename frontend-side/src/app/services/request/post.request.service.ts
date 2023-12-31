import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AuthRequestService} from "./auth.request.service";
import {environment} from "../../../environments/environment";
import {RequestUpdatePostModel} from "../../model/request-update-post.model";
import {switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostRequestService {
    private baseUrl = environment.backendUrl;

    constructor(private http: HttpClient, private authRequestService: AuthRequestService) {
    }

    getPosts(page: number, token: string | null, pageSize?: number, sortByValue?: string) {
        let params = new HttpParams();
        params = params.set('page', page.toString());
        if (pageSize)
            params = params.set('pageSize', pageSize.toString());
        if (sortByValue)
            params = params.set('sortBy', sortByValue);
        return this.http.get(`${this.baseUrl}/api/v1/post/search`, {withCredentials: true, params});
    }

    getPostsByTag(page: number, token: string | null, tag: string | null, pageSize?: number, sortByValue?: string) {
        let params = new HttpParams();
        params = params.set('page', page.toString());
        if (pageSize)
            params = params.set('pageSize', pageSize.toString());
        if (sortByValue)
            params = params.set('sortBy', sortByValue);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.baseUrl}/api/v1/post/tag/${tag}`, {withCredentials: true, params, headers});
    }

    addPostToSavedList(identifier: string) {
       return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => this.http.post(`${this.baseUrl}/api/v1/post/saved/${identifier}`, {}, {
                withCredentials: true,
                headers: new HttpHeaders({
                    'X-CSRF-TOKEN': csrfToken.token as string,
                })
            })))
    }

    deletePostFromSavedList(identifier: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken:any) => this.http.delete(`${this.baseUrl}/api/v1/post/saved/${identifier}`, {
                withCredentials: true,
                headers: new HttpHeaders({
                    'X-CSRF-TOKEN': csrfToken.token as string,
                })
            })))
    }

    findPostInSavedList(identifier: string) {
        return this.http.get(`${this.baseUrl}/api/v1/post/saved/${identifier}`, {withCredentials: true})
    }

    getPostsByUsername(page: number, token: string | null, username: string | null, pageSize?: number, sortByValue?: string) {
        let params = new HttpParams();
        params = params.set('page', page.toString());
        if (pageSize)
            params = params.set('pageSize', pageSize.toString());
        if (sortByValue)
            params = params.set('sortBy', sortByValue);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.baseUrl}/api/v1/post/author/${username}`, {
            withCredentials: true,
            params,
            headers
        });
    }
    getPostsBySubscription(token: string | null, page: number, pageSize?: number, sortByValue?: string) {
        let params = new HttpParams();
        params = params.set('page', page.toString());
        if (pageSize)
            params = params.set('pageSize', pageSize.toString());
        if (sortByValue)
            params = params.set('sortByValue', sortByValue);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.baseUrl}/api/v1/post/follower`, {withCredentials: true, params, headers})
    }

    createPost(token: string | null, postData: FormData) {
       return  this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) =>
                this.http.post(`${this.baseUrl}/api/v1/post`, postData, {withCredentials: true,
                    headers: new HttpHeaders({
                        'X-CSRF-TOKEN': csrfToken.token as string,
                    })})))
    }

    updatePost(postUpdateData: RequestUpdatePostModel) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) =>
                this.http.put(`${this.baseUrl}/api/v1/post`, postUpdateData, {
                    withCredentials: true,
                    headers: new HttpHeaders({
                        'X-CSRF-TOKEN': csrfToken.token as string,
                    })
                })))
    }

    searchPostsByText(text: string, page: number, pageSize: number, sortBy: string) {
        let params = new HttpParams();
        params = params.set('page', page.toString());
        params = params.set('pageSize', pageSize.toString());
        params = params.set('sortBy', sortBy);
        return this.http.get(`${this.baseUrl}/api/v1/post/search/${text}`, {withCredentials: true, params})
    }

    getSavedPosts(page: number, pageSize: number, sortBy: string) {
        let params = new HttpParams();
        params = params.set('page', page.toString());
        params = params.set('pageSize', pageSize.toString());
        params = params.set('sortBy', sortBy);
        return this.http.get(`${this.baseUrl}/api/v1/post/saved`, {withCredentials: true, params})
    }

    getPostById(token: string | null, identifier: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.baseUrl}/api/v1/post/${identifier}`, {withCredentials: true, headers})
    }

    deletePost(token: string | null, identifier: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) =>
                this.http.delete(`${this.baseUrl}/api/v1/post/${identifier}`, {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token as string})
                })))
    }
}