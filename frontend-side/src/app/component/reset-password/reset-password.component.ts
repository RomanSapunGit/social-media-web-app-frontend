import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SseRequestService} from "../../services/request/sse.request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../services/entity/notification.service";
import {interval, map, Observable, of, share, takeWhile, tap} from "rxjs";
import {AuthRequestService} from "../../services/request/auth.request.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    token = '';
    email: string;
    newPassword = '';
    confirmPassword = '';
    image = 'assets/image/bg1.jpg'
    message: string;
    isErrorMessage: boolean;
    timerValue$: Observable<number> = interval(0);
    isTimerRunning$: Observable<boolean> = interval(0).pipe(map(() => false));

    constructor(private route: ActivatedRoute, private requestService: AuthRequestService,
                private notificationService: NotificationService, private changeDetectorRef: ChangeDetectorRef,
                private router: Router) {
        this.message = '';
        this.email = '';
        this.isErrorMessage = false;
        let isTimerRunning = localStorage.getItem('isTimerRunning')
        console.log(isTimerRunning)
        if (isTimerRunning != null) {
            this.isTimerRunning$ = of(true);
            this.startTimer(60)
        }
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
        });
        this.notificationService.notification$.subscribe(message => {
            this.message = (message.message);
            this.isErrorMessage = message.isErrorMessage;
            this.changeDetectorRef.detectChanges();
        });
    }

    startTimer(seconds: number): void {
        this.timerValue$ = interval(1000).pipe(
            map(count => seconds - count),
            takeWhile(value => value >= 0),
            share()
        );

        this.isTimerRunning$ = this.timerValue$.pipe(
            tap(value =>{
                if (value === 0) localStorage.removeItem('isTimerRunning')
            }),
            map(value => value > 0),
        share());
    }

    submitForm(): void {
        if (this.token) {
            this.submitResetForm();
        } else {
            this.submitForgotForm();
        }
    }

    submitForgotForm(): void {
        this.requestService.forgotPassword(this.email).subscribe(
            {
                next: () => {
                    this.notificationService.showNotification('Email sent successfully', false);
                    localStorage.setItem('isTimerRunning', 'true')
                    this.startTimer(60);
                },
            }
        );
    }

    submitResetForm(): void {
        this.requestService.resetPassword(this.token, this.newPassword, this.confirmPassword).subscribe(
            {
                next: () => {
                    this.notificationService.showNotification('Password reset successfully. Redirecting to login page...', false);
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 5000);
                },
                error: (error: any) => {
                    this.notificationService.showNotification('Error resetting password' + error, true)
                },
            }
        );
    }

    confirmPasswordMismatch(): boolean {
        return !(this.confirmPassword === this.newPassword);
    }
}
