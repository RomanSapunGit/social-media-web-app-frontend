import {catchError, defaultIfEmpty, map, Observable, of} from "rxjs";
import {Router, UrlTree} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import {Injectable} from "@angular/core";
import {MatDialogService} from "../services/mat-dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthRequestService} from "../services/request/auth.request.service";

@Injectable()
export class AuthGuard {
    errorMessage: string

    constructor(private requestService: AuthRequestService, private authService: AuthService,
                private router: Router, private matDialogService: MatDialogService, private translateService: TranslateService) {
        this.errorMessage = '';
    }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.requestService.validateSession().pipe(
            map((isValid: boolean) => {
                console.log(isValid);
                localStorage.setItem('isLoggedIn', JSON.stringify(isValid))
                if(!isValid)
                    this.router.navigate(['/login'])
                return isValid;
            }),
            catchError((error: any) => {
                if (error && error.error && error.error.message && error.error.message.startsWith("JWT expired")) {
                    return this.handleExpiredSessionError();
                } else {
                    return of(false);
                }
            })
        );
    }

    private handleExpiredSessionError(): Observable<UrlTree> {
        return new Observable<UrlTree>((observer) => {
            this.translateService.get('EXPIRED_SESSION').subscribe((translation: string) => {
                this.matDialogService.displayError(translation as string);
                observer.next(this.router.createUrlTree(['/login']));
                observer.complete();
            });
        });
    }
}
