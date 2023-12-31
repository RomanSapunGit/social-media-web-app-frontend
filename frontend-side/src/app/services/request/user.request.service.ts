import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthRequestService} from "./auth.request.service";
import {switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserRequestService {
    private baseUrl = environment.backendUrl;
    constructor(private http: HttpClient, private authRequestService: AuthRequestService) {
    }
    getUsers(page: number, pageSize?: number) {
        let params = new HttpParams();
        params = params.set('page', page.toString());
        if (pageSize)
            params = params.set('pageSize', pageSize.toString());
        return this.http.get(`${this.baseUrl}/api/v1/user`, {withCredentials: true, params});
    }
    getUsersByText(text: string, page: number, pageSize: number) {
        let params = new HttpParams();
        params = params.set('page', page.toString());
        params = params.set('pageSize', pageSize.toString());
        return this.http.get(`${this.baseUrl}/api/v1/user/${text}`, {withCredentials: true, params})
    }

    getUser() {
        return this.http.get(`${this.baseUrl}/api/v1/user/current`, {
            withCredentials: true
        })
    }

    sendUserConsentToServer(consent: boolean) {
        console.log(consent)
        return this.authRequestService.getCsrf().pipe(
            switchMap((token: any) => {
                console.log(token.token)
                return this.http.put(`${this.baseUrl}/api/v1/user/consent`, {consent: consent}, {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': token.token})
                })
            })
        )
    }

    getConsent() {
        return this.http.get(`${this.baseUrl}/api/v1/user/consent`, {
            withCredentials: true
        })
    }
}