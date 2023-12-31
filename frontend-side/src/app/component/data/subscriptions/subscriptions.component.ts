import {Component, Input} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {NotificationService} from "../../../services/entity/notification.service";
import {SubscriptionService} from "../../../services/entity/subscription.service";
import {ValidatorModel} from "../../../model/validator.model";
import {SseRequestService} from "../../../services/request/sse.request.service";
import {map} from "rxjs";
import {UserModel} from "../../../model/user.model";
import {UserRequestService} from "../../../services/request/user.request.service";
import {NotificationRequestService} from "../../../services/request/notification.request.service";

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent {
    @Input() targetUsername: string;
    authToken: string | null;
    loggedInUser: string | null;
    isUserSubscribed: boolean;
    isConfirmationShown: boolean;
    isConfirmed: boolean;

    constructor(private notificationService: NotificationService,
                private subscriptionService: SubscriptionService, private userRequestService: UserRequestService,
                private notificationRequestService: NotificationRequestService) {
        this.targetUsername = '';
        this.isUserSubscribed = false;
        this.loggedInUser = '';
        this.isConfirmationShown = false;
        this.isConfirmed = false;
        this.authToken = '';
    }
    ngOnInit() {
        this.loggedInUser = localStorage.getItem('username');
        console.log(this.loggedInUser)
        if (!this.loggedInUser) {
            this.fetchCurrentUser();
        } else if (this.loggedInUser !== this.targetUsername) {
            this.checkIfUserIsFollowed();
        }
    }

    fetchCurrentUser() {
        this.userRequestService.getUser().pipe(map(user => user as UserModel)).subscribe({
            next: user => {
                localStorage.setItem('username', user.username);
                this.loggedInUser = user.username;
            }
        })
    }

    checkIfUserIsFollowed() {
        this.subscriptionService.findFollowingByUsername( this.targetUsername).subscribe({
            next: (isSubscribed: ValidatorModel) => {
                this.isUserSubscribed = isSubscribed.valid;
            }
        })
    }

    subscribeToUser() {
        this.subscriptionService.addSubscription(this.targetUsername).subscribe({
            next: () => {
                this.notifyUserOfNewSubscription();
                this.isUserSubscribed = true;
            }
        })
    }

    notifyUserOfNewSubscription() {
        this.notificationRequestService.sendNewSubscriptionNotification(this.authToken, this.targetUsername, `${this.loggedInUser} subscribed on you`)
            .subscribe({
                next: () => {
                    this.notificationService.showNotification('Successfully subscribed', false)
                    console.log('check')
                }
            })
    }

    confirmUnsubscription(): void {
        this.isConfirmationShown = true;
    }

    confirmUnsubscriptionAction(): void {
        this.isConfirmed = true;
        this.isConfirmationShown = false;
        this.unsubscribeFromUser();
    }

    cancelUnsubscription(): void {
        this.isConfirmationShown = false;
    }

    unsubscribeFromUser(): void {
        this.subscriptionService.removeSubscription(this.targetUsername).subscribe({
            next: () => {
                this.isUserSubscribed = false;
            }
        });
    }

    findFollowingByUsername() {
        this.subscriptionService.findFollowingByUsername( this.targetUsername).subscribe({
            next: (isSubscribed: ValidatorModel) => {
                this.isUserSubscribed = isSubscribed.valid;
            }
        })
    }

    addSubscription() {
        this.subscriptionService.addSubscription(this.targetUsername).subscribe({
            next: () => {
                this.notificationRequestService.sendNewSubscriptionNotification(this.authToken, this.targetUsername,
                    `${this.loggedInUser} subscribed on you`)
                    .subscribe({
                        next: () => {
                            this.notificationService.showNotification('Successfully subscribed', false)
                            console.log('check')
                        }
                    })
                this.isUserSubscribed = true;
            }
        })
    }

    confirmUnsubscribe(): void {
        this.isConfirmationShown = true;
    }

    onConfirm(): void {
        this.isConfirmed = true;
        this.isConfirmationShown = false;
        this.logout();
    }

    onCancel(): void {
        this.isConfirmationShown = false;
    }

    logout(): void {
        this.subscriptionService.removeSubscription(this.targetUsername).subscribe({
            next: () => {
                this.isUserSubscribed = false;
            }
        });
    }
}
