import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import { switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthRequestService {
    private baseUrl = environment.backendUrl;
    private csrfToken!: any;

    constructor(private http: HttpClient) {
    }

    getCsrfToken() {
        return this.csrfToken;
    }

    setCsrfToken(csrfToken: any) {
        this.csrfToken = csrfToken;
    }


    login(loginData: { username: string, password: string }) {
        return this.getCsrf().pipe(
            switchMap((csrfToken: any) => {
                this.csrfToken = csrfToken;
                return this.http.post(`${this.baseUrl}/api/v1/account/login`, loginData, {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
                });
            })
        )
    }

    logout() {
        return this.getCsrf().pipe(
            switchMap((csrfToken: any) => {
                this.csrfToken = csrfToken;
                return this.http.delete(`${this.baseUrl}/api/v1/account/logout`,  {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
                });
            })
        )
    }

    register(registerData: FormData) {
       return this.getCsrf().pipe(
            switchMap((csrfToken: any) => {
                this.csrfToken = csrfToken;
                return this.http.post(`${this.baseUrl}/api/v1/account`, registerData, {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
                });
            })
        )
    }

    validateSession() {
        return this.http.get<boolean>(`${this.baseUrl}/api/v1/account`, {withCredentials: true});
    }


    loginViaGoogle(token: string) {
       return this.getCsrf().pipe(
            switchMap((csrfToken: any) => {
                this.csrfToken = csrfToken;
                return this.http.post(`${this.baseUrl}/api/v1/account/google/login`, null, {
                    withCredentials: true,
                    headers: new HttpHeaders({
                        'X-CSRF-TOKEN': csrfToken.token,
                        'Authorization': `Bearer ${token}`
                    })
                });
            })
        )
    }

    forgotPassword(email: string) {
       return this.getCsrf().pipe(
            switchMap((csrfToken: any) => {
                this.csrfToken = csrfToken;
                return this.http.post(`${this.baseUrl}/api/v1/account/${email}`, {}, {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
                });
            })
        )
    }

    resetPassword(token: string, password: string, matchPassword: string) {
        return this.getCsrf().pipe(
            switchMap((csrfToken: any) => {
                this.csrfToken = csrfToken;
                return this.http.put<void>(`${this.baseUrl}/api/v1/account/${token}`, {password, matchPassword}, {
                    withCredentials: true,
                    headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token})
                });
            }))
    }

    getCsrf() {
      return this.http.get(`${this.baseUrl}/api/v1/csrf/token`, {withCredentials: true});
    }
}