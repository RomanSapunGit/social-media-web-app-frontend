import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class TagRequestService {

    private baseUrl = environment.backendUrl;
    constructor(private http: HttpClient) {
    }
    getTags(page: number, pageSize?: number, sortByValue?: string) {
        let params = new HttpParams();
        params = params.set('page', page.toString());
        if (pageSize)
            params = params.set('pageSize', pageSize.toString());
        if (sortByValue)
            params = params.set('sortBy', sortByValue);
        return this.http.get(`${this.baseUrl}/api/v1/tag`, {withCredentials: true, params});
    }

    getTagsByText(token: string | null, text: string, page: number, pageSize: number) {
        let params = new HttpParams();
        console.log(page, pageSize);
        params = params.set('page', page.toString());
        params = params.set('pageSize', pageSize.toString());
        console.log('check');
        return this.http.get(`${this.baseUrl}/api/v1/tag/${text}`, {withCredentials: true, params});
    }
}