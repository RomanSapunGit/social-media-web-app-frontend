import {Component} from '@angular/core';
import {BehaviorSubject, map, Observable, of, ReplaySubject, Subscription, switchMap, take, tap} from "rxjs";
import {MatDialogService} from "../../../services/mat-dialog.service";
import {SearchByTextService} from "../../../services/search-by-text.service";
import {TagModel} from "../../../model/tag.model";
import {AuthService} from "../../../services/auth/auth.service";
import {SseRequestService} from "../../../services/request/sse.request.service";
import {ActivatedRoute} from "@angular/router";
import {TagRequestService} from "../../../services/request/tag.request.service";

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
    page: number;
    tags: ReplaySubject<TagModel[]>;
    subscription: Subscription;
    totalPages!: number;
    isLoading: BehaviorSubject<boolean>;
    isMobileView: boolean;
    private pageSize!: number;

    constructor(private matDialogService: MatDialogService, private searchByTextService: SearchByTextService,
                private authService: AuthService, private requestService: TagRequestService,
                private route: ActivatedRoute) {
        this.subscription = new Subscription();
        this.page = 0;
        this.isLoading = new BehaviorSubject<boolean>(true);
        this.isMobileView = JSON.parse(localStorage.getItem('isMobileView') || 'false');
        if (this.isMobileView) {
            this.route.queryParams.subscribe(params => {
                this.pageSize = params['pageSize'] || 20;
            })
        } else {
            this.pageSize = 5;
        }
        this.tags = new ReplaySubject<TagModel[]>(1);
        this.getTags().subscribe({
            next: (tags) => {
                console.log(tags)
                this.tags.next(tags);
            }
        });
        this.isLoading.next(false);
    }

    ngOnInit() {
        this.subscription = this.searchByTextService.textFound$.subscribe({
            next: (text) => {
                this.page = 0;
                if (!text) {
                    this.getTags().subscribe({
                        next: (tags) => {
                            this.tags.next(tags);
                        }
                    });
                } else {
                    this.getTagsByText(text).subscribe({
                        next: (tags) => {
                            this.tags.next(tags);
                        }
                    });
                }
            }
        })
    }

    nextTagPage() {
        console.log(this.isLoading.getValue());
        if (!this.isLoading.getValue()) {
            this.isLoading.next(true);
            console.log('check');
            this.page = this.page + 1;
            this.tags.pipe(
                    take(1),
                    switchMap(tags =>
                        this.getTags().pipe(
                            map(newTags => [...tags, ...newTags]))))
                .subscribe(updatedUsers => {
                    this.tags.next(updatedUsers);
                    this.isLoading.next(false);
                });
        }
        this.tags.pipe(tap(tags => console.log(tags.length))).subscribe();
    }

    getTags(): Observable<TagModel[]> {
        return this.requestService.getTags(this.page, this.pageSize).pipe(
            map((response: any) => {
                this.totalPages = response['totalPages'];
                return response['entities'] as TagModel[];
            })
        );
    }

    showPostsByTag(tag: string) {
        this.matDialogService.showPostsByTag(tag);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getTagsByText(text: string): Observable<TagModel[]> {
        let token = this.authService.getAuthToken();
        return this.requestService.getTagsByText(token, text,this.page, this.pageSize).pipe(
            map((response: any) => {
                this.totalPages = response['totalPages'];
                return response['entities'] as TagModel[]
            })
        );
    }
}
