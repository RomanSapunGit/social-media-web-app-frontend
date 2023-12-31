import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../services/entity/notification.service";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {AuthService} from "../../services/auth/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CredentialsService} from "../../services/auth/credentials.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    loginForm: FormGroup;
    authSubscription: Subscription = new Subscription();
    socialUser!: SocialUser;
    errorMessage: string = '';
    isErrorMessage: boolean = false;
    image: string = 'assets/image/bg1.jpg';

    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private socialAuthService: SocialAuthService,
        private authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private credentialsService: CredentialsService
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
        this.checkLoginStatus();
        this.authSubscription.add(this.subscribeToNotifications());
        this.authSubscription.add(this.subscribeToGoogleAuth());
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }

    async login(): Promise<void> {
        const loginData = this.loginForm.value;
        this.credentialsService.loginAndRedirect(loginData);
    }

    private async checkLoginStatus(): Promise<void> {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            await this.router.navigate(['/main']);
        }
    }

    private subscribeToNotifications() {
        return this.notificationService.notification$.subscribe(message => {
            this.errorMessage = message.message;
            this.isErrorMessage = message.isErrorMessage;
            this.changeDetectorRef.detectChanges();
        });
    }

    private subscribeToGoogleAuth() {
        return this.authSubscription = this.socialAuthService.authState.subscribe(async user => {
            this.socialUser = user;
            if (this.socialUser && this.socialUser.idToken) {
                this.credentialsService.loginViaGoogleAndRedirect(this.socialUser.idToken);
                this.authService.setIsGoogleAccount();
            }
        });
    }
}
