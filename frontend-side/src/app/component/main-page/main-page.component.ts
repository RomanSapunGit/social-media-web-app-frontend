import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener} from '@angular/core';
import {NotificationService} from "../../services/entity/notification.service";
import {BehaviorSubject,  Subscription} from "rxjs";
import {MatDialogService} from "../../services/mat-dialog.service";
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {RoutingService} from "../../services/routing.service";


@Component({
    selector: 'app-mainPage',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})

export class MainPageComponent {
    image: string = 'assets/image/bg1.jpg';
    errorMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');
    isErrorMessage: boolean = false;
    isMobileView: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getIsMobileView());
    selectedList: string = 'posts';
    private subscriptions: Subscription[] = [];
    private scrollTimeout: any;

    constructor(
        private notificationService: NotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private matDialogService: MatDialogService,
        private route: ActivatedRoute,
        private routingService: RoutingService
    ) {}

    ngOnInit(): void {
        this.subscribeToDialogClosed();
        this.setSelectedList();
        this.subscribeToNotifications();
        this.subscribeToRouteParams();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.isMobileView.next(event.target.innerWidth < 1000);
        localStorage.setItem('isMobileView', JSON.stringify(this.isMobileView.value));
    }

    onWindowScroll(): void {
        const postBox = document.querySelector('.post-list') as HTMLElement;
        if (postBox) {
            postBox.style.userSelect = 'none';
        }

        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            if (postBox) {
                postBox.style.userSelect = '';
            }
        }, 500);
    }

    displaySinglePost(postIdentifier: string): void {
        this.matDialogService.displaySinglePost(postIdentifier);
    }

    private getIsMobileView(): boolean {
        return JSON.parse(localStorage.getItem('isMobileView') || 'false');
    }

    private subscribeToDialogClosed(): void {
        const subscription = this.matDialogService.isDialogClosed$.subscribe({
            next: isDialogClosed => {
                if (isDialogClosed) {
                    this.matDialogService.dialogClosed();
                    this.routingService.clearPathVariable(this.getQueryParams());
                }
            }
        });
        this.subscriptions.push(subscription);
    }

    private setSelectedList(): void {
        if (this.isMobileView.value) {
            const snapshot: ActivatedRouteSnapshot = this.route.snapshot;
            const url: string = snapshot.url.join('/');
            switch (url) {
                case 'main/tags':
                    this.selectedList = 'tags';
                    break;
                case 'main/posts':
                    this.selectedList = 'posts';
                    break;
                case 'main/users':
                    this.selectedList = 'users';
                    break;
                default:
                    this.selectedList = 'posts';
            }
        }
    }

    private subscribeToNotifications(): void {
        const subscription = this.notificationService.notification$.subscribe({
            next: message => {
                this.errorMessage.next(message.message);
                this.isErrorMessage = message.isErrorMessage;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.subscriptions.push(subscription);
    }

    private subscribeToRouteParams(): void {
        const subscription = this.route.paramMap.subscribe(params => {
            const identifier = params.get('id');
            if (identifier) {
                this.displaySinglePost(identifier);
            }
        });
        this.subscriptions.push(subscription);
    }

    private getQueryParams(): string {
        let queryParams = '';
        this.route.queryParams.subscribe(params => {
            if (params['pageSize'] && params['sortBy']) {
                queryParams = "?pageSize=" + params['pageSize'] + "&sortBy=" + params['sortBy'];
            }
        });
        return queryParams;
    }
}
