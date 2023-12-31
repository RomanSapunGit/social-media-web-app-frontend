import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AuthRequestService} from "./auth.request.service";
import {switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TranslationRequestService {

    private baseUrl = environment.backendUrl;

    constructor(private http: HttpClient, private authRequestService: AuthRequestService) {
    }

    translateText(text: string, targetLanguage: string) {
        return this.authRequestService.getCsrf().pipe(
            switchMap((csrfToken: any) => {
                    let params = new HttpParams();
                    params = params.set('text', text);
                    params = params.set('targetLanguage', targetLanguage);
                    return this.http.put(`${this.baseUrl}/api/v1/translations`, {}, {
                        withCredentials: true,
                        headers: new HttpHeaders({'X-CSRF-TOKEN': csrfToken.token as string}), params
                    });
                }
            ))
    }
}