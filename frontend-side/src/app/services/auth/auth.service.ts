import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {CookieService} from 'ngx-cookie-service';
import {GoogleLoginProvider, SocialAuthService} from "@abacritt/angularx-social-login";
import {SseRequestService} from "../request/sse.request.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authTokenCookieName = 'authToken';
    private usernameCookieName = 'username';
    private isGoogleAccountName = 'is_google_account';

    constructor(private router: Router, private cookieService: CookieService, private socialService: SocialAuthService,) {
    }
    getAccessToken(): void {
        this.socialService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => console.log(accessToken));
    }
    private encodeToken(token: string): string {
        return btoa(token);
    }

    public decodeToken(encodedToken: string | null): string {
        if (encodedToken === null) {
            return "";
        }
        return atob(encodedToken);
    }

    public setIsGoogleAccount(): void {
        this.cookieService.set(this.isGoogleAccountName, 'true')
    }

    public getIsGoogleAccount(): string {
        return this.cookieService.get(this.isGoogleAccountName)
    }

    public getAuthToken(): string | null {
        const encodedToken = this.cookieService.get(this.authTokenCookieName);
        return this.decodeToken(encodedToken)
    }

    public getUsername(): string | null {
        return this.cookieService.get(this.usernameCookieName);
    }

    public clearIsGoogleAccount(): void {
        this.cookieService.delete(this.isGoogleAccountName)
    }

    async logout(): Promise<void> {
        if (this.getIsGoogleAccount() == 'true') {
            this.socialService.signOut().then(() => console.log("Google user signed out"));
            this.clearIsGoogleAccount()
        }
    }
}
