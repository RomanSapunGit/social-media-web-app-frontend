import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ImageRequestService {
    private baseUrl = environment.backendUrl;

    constructor(private http: HttpClient) {
    }
    getImageByUser(token: string | null) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.get(`${this.baseUrl}/api/v1/image`, {withCredentials: true, headers})
    }

    getImageByUsername(username: string) {
        return this.http.get(`${this.baseUrl}/api/v1/image/${username}`, {withCredentials: true})
    }
    getImagesByPost(postId: string) {
        return this.http.get(`${this.baseUrl}/api/v1/image/post/${postId}`, {withCredentials: true})
    }
}