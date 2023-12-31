import {Component} from '@angular/core';
import {BehaviorSubject, map, Observable, ReplaySubject, shareReplay, Subscription, switchMap, take, tap
} from "rxjs";
import {MatDialogService} from "../../../services/mat-dialog.service";
import {SearchByTextService} from "../../../services/search-by-text.service";
import {UserModel} from "../../../model/user.model";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute} from "@angular/router";
import {UserRequestService} from "../../../services/request/user.request.service";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent {
    users: ReplaySubject<UserModel[]>;
    subscription: Subscription;
    page: number;
    private pageSize!: number;
     isMobileView: boolean;
    totalPages!: number;
    isLoading: BehaviorSubject<boolean>;
    currentUser: string | null;

    constructor(private matDialogService: MatDialogService, private searchByTextService: SearchByTextService,
                private authService: AuthService, private requestService: UserRequestService, private route: ActivatedRoute) {
        this.subscription = new Subscription();
        this.page = 0;
        this.currentUser = localStorage.getItem('username');
        this.isMobileView = JSON.parse(localStorage.getItem('isMobileView') || 'false');
        if (this.isMobileView) {
            this.route.queryParams.subscribe(params => {
                this.pageSize = params['pageSize'] || 20;
            })
        } else {
            this.pageSize = 5;
        }
        this.isLoading = new BehaviorSubject<boolean>(true);
        this.users = new ReplaySubject<UserModel[]>(1);
        this.getUsers().pipe().subscribe({
                next: (users) => {
                    this.users.next(users);
                }
            }
        );
        this.isLoading.next(false);
    }

    ngOnInit() {
        this.subscription = this.searchByTextService.textFound$.subscribe({
            next: (text) => {
                this.page = 0;
                if (!text) {
                    this.getUsers().pipe().subscribe({
                        next: (users) => {
                            this.page = 0;
                            this.users.next(users);
                        }
                    });
                } else {
                    console.log('check')
                    this.getUsersByText(text).pipe().subscribe({
                        next: (users) => {
                            this.users.next(users);
                        }
                    });
                }
            }
        })
    }


    showPostsByUsername(username: string) {
        this.matDialogService.showPostsByUsername(username);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    nextUserPage() {
        console.log(this.isLoading.getValue());
        if (!this.isLoading.getValue()) {
            this.isLoading.next(true);
            console.log('check');
            this.page = this.page + 1;
            this.users
                .pipe(
                    take(1),
                    switchMap(users =>
                        this.getUsers().pipe(
                            map(newUsers => [...users, ...newUsers]))))
                .subscribe(updatedUsers => {
                    this.users.next(updatedUsers);
                    this.isLoading.next(false);
                });
        }
        this.users.pipe(tap(users => console.log(users.length))).subscribe();
    }

    getUsers(): Observable<UserModel[]> {
        return this.requestService.getUsers(this.page, this.pageSize).pipe(
            shareReplay(),
            take(1),
            map((response: any) => {
                this.totalPages = response['totalPages'];
                return response['entities'] as UserModel[];
            }),
            map((users: UserModel[]) => users.filter(user => user.username !== this.currentUser)));
    }

    getUsersByText(text: string): Observable<UserModel[]> {
        return this.requestService.getUsersByText(text, this.page, this.pageSize).pipe(
            map((response: any) => {
                this.totalPages = response['totalPages'];
                return response['entities'] as UserModel[]
            }),
            map((users: UserModel[]) => users.filter(user => user.username !== this.currentUser))
        );
    }
}
