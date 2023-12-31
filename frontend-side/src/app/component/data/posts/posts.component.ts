import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Page} from "../../../model/page.model";
import {of, tap} from "rxjs"
import {BehaviorSubject, concatMap, distinctUntilChanged, map, Observable, ReplaySubject, shareReplay, Subscription,
    switchMap, take,} from "rxjs";
import {PostService} from "../../../services/entity/post.service";
import {MatDialogService} from "../../../services/mat-dialog.service";
import {PostActionService} from "../../../services/entity/post-action.service";
import {PostModel} from "../../../model/post.model";
import {RoutingService} from "../../../services/routing.service";
import {SearchByTextService} from "../../../services/search-by-text.service";
import {ActivatedRoute} from "@angular/router";
import {FileDTO} from "../../../model/file.model";
import {SubscriptionService} from "../../../services/entity/subscription.service";
import {VoteService} from "../../../services/entity/vote.service";

@Component({
    selector: 'app-post',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
    @Input() tagName: string | null = '';
    @Input() username: string | null = '';
    @Input() displaySavedPosts: boolean = false;
    posts: ReplaySubject<Page> = new ReplaySubject<Page>(1);
    currentPostPage: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    isPostPaginationVisible$: Observable<boolean> = new Observable<boolean>();
    isUserSubscribed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    currentUser: string | null = localStorage.getItem('username');
    errorMessage: string = '';
    searchText: string = '';
    isDownVoteMade: boolean = false;
    isUpvoteMade: boolean = false;
    loadedPosts: PostModel[] = [];
    totalPages: BehaviorSubject<number> = new BehaviorSubject(0);
    pageSize: number = 20;
    sortBy: string = 'creationTime';
    private subscriptions: Subscription = new Subscription();

    constructor(
        private postService: PostService,
        private matDialogService: MatDialogService,
        private postActionService: PostActionService,
        private routingService: RoutingService,
        private searchByTextService: SearchByTextService,
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
        private subscriptionService: SubscriptionService,
        private voteService: VoteService
    ) {}

    ngOnInit(): void {
        this.subscribeToPostDeletion();
        this.subscribeToQueryParamsAndFetchPosts();
        this.subscribeToPostCreation();
        this.subscribeToTextSearch();
        this.subscribeToPosts();
    }

    private subscribeToPostDeletion(): void {
        const subscription = this.postActionService.deletePost$()
            .subscribe(post => {
                this.updatePostViewAfterDeletion(post);
            });
        this.subscriptions.add(subscription);
    }

    private subscribeToQueryParamsAndFetchPosts(): void {
        const subscription = this.route.queryParams.subscribe(params => {
            if(!this.displaySavedPosts) {
                this.pageSize = params['pageSize'] || 20;
                this.sortBy = params['sortBy'] || 'creationTime';
                this.currentPostPage.next(0);
                this.fetchPosts().pipe(
                    shareReplay(1),
                    take(1),
                    tap(page => this.posts.next(page))).subscribe();
            }
        });
        this.subscriptions.add(subscription);
    }

    private subscribeToPostCreation(): void {
        const subscription = this.postActionService.postCreated$.subscribe({
            next: (post: PostModel) => {
                this.updatePostView(post);
                this.changeDetectorRef.detectChanges();
            }
        });
        this.subscriptions.add(subscription);
    }

    private subscribeToTextSearch(): void {
        if (!(this.username || this.tagName || this.displaySavedPosts)) {
            const subscription = this.searchByTextService.textFound$.subscribe({
                next: (text) => {
                    this.isLoading.next(true);
                    this.currentPostPage.next(0);
                    if (!text) {
                        this.searchText = '';
                        this.fetchPosts().pipe(
                            take(1),
                            shareReplay(),
                            tap((page) => {
                                this.posts.next(page);
                            })
                        ).subscribe();
                    } else {
                        this.searchText = text;
                        this.postService.searchPostsByText(text, 0, this.pageSize, this.sortBy).pipe(
                            take(1),
                            tap((page) => {
                                this.loadedPosts = page.entities;
                                this.posts.next(page);
                            })
                        ).subscribe();
                    }
                    this.isPostPaginationVisible$ = this.isPostPaginationVisible(this.posts);
                    this.isLoading.next(false);
                }
            });
            this.subscriptions.add(subscription);
        }
    }

    private subscribeToPosts(): void {
        if (this.displaySavedPosts) {
            console.log('check')
            const savedPostsSubscription = this.fetchSavedPosts().pipe().subscribe({
                next: savedPostsPage => {
                    this.incorporateOldAndNewPostsToPostsViewList(savedPostsPage);
                }
            });
            this.subscriptions.add(savedPostsSubscription);
        } else {
            console.log('check')
            const subscription = this.subscriptionService.isUserHasSubscriptions(this.username, this.tagName).pipe(
                take(1),
                concatMap((isUserHasSubscriptions: boolean) => {
                    this.isUserSubscribed.next(isUserHasSubscriptions);
                    return this.route.data.pipe(
                        concatMap((data) => {
                            if (data['postData'] && this.currentPostPage.getValue() == 0) {
                                return of(data['postData'] as Page);
                            } else {
                                return this.fetchPosts();
                            }
                        })
                    );
                })).subscribe({
                next: (page) => {
                    this.incorporateOldAndNewPostsToPostsViewList(page);
                    this.hasPostsBySubscription();
                },
                error: (error: any) => {
                    this.errorMessage = 'Something went wrong:' + error.error.message
                },
            });
            this.subscriptions.add(subscription);
        }
    }

    incorporateOldAndNewPostsToPostsViewList(page: Page) {
        this.loadedPosts = [...this.loadedPosts, ...page.entities];
        console.log(this.loadedPosts);
        this.totalPages.next(page.totalPages);
        const pageData = new Page(this.loadedPosts, page.total, page.currentPage, page.totalPages);
        console.log(pageData)
        this.posts.next(pageData);
        this.isPostPaginationVisible$ = this.isPostPaginationVisible(this.posts);
        this.isLoading.next(false);
    }

    private hasPostsBySubscription(): void  {
        this.posts.pipe(
            take(1),
            map(postsData => {
                if (postsData.entities.length == 0 && this.isUserSubscribed.getValue()) {
                    this.onPostChange();
                }
            })
        ).subscribe();
    }
    addUpvote(identifier: string) {
        this.voteService.addUpvote(identifier).pipe(
            tap(upvotes => {
                this.posts.pipe(
                    take(1),
                    tap(posts => {
                        posts.entities.forEach(post => {
                            if (post.identifier === identifier) {
                                this.isUpvoteMade = true;
                                post.upvotes = upvotes;
                                this.changeDetectorRef.detectChanges()
                            }
                        });
                    })
                ).subscribe();
            })
        ).subscribe();
    }


    removeUpvote(identifier: string) {
        this.voteService.removeUpvote(identifier).pipe(
            tap(upvotes => {
                this.posts.pipe(
                    take(1),
                    tap(posts => {
                        posts.entities.forEach(post => {
                            if (post.identifier === identifier) {
                                this.isUpvoteMade = false;
                                post.upvotes = upvotes;
                                this.changeDetectorRef.detectChanges()
                            }
                        });
                    })
                ).subscribe();
            })
        ).subscribe();
    }

    addDownvote(identifier: string) {
        this.voteService.addDownvote(identifier).pipe(
            tap(downvotes => {
                this.posts.pipe(
                    take(1),
                    tap(posts => {
                        posts.entities.forEach(post => {
                            if (post.identifier === identifier) {
                                this.isDownVoteMade = true;
                                post.downvotes = downvotes;
                                console.log(post.downvotes)
                                this.changeDetectorRef.detectChanges()
                            }
                        });
                    })
                ).subscribe();
            })
        ).subscribe();
    }

    removeDownvote(identifier: string) {
        this.voteService.removeDownvote(identifier).pipe(
            tap(downvotes => {
                this.posts.pipe(
                    take(1),
                    tap(posts => {
                        posts.entities.forEach(post => {
                            if (post.identifier === identifier) {
                                this.isDownVoteMade = false;
                                post.downvotes = downvotes;
                                console.log(post.downvotes)
                                this.changeDetectorRef.detectChanges()
                            }
                        });
                    })
                ).subscribe();
            })
        ).subscribe();
    }

    nextPostPage() {
        if (!this.isLoading.getValue()) {
            this.currentPostPage.pipe(take(1)).subscribe((currentPage) => {
                take(1);
                this.isLoading.next(true);
                this.currentPostPage.next(currentPage + 1);
                this.fetchPosts().pipe(
                    tap((page) => {
                        this.loadedPosts = [...this.loadedPosts, ...page.entities];
                        const pageData = new Page(this.loadedPosts, page.total, currentPage, page.totalPages);
                        this.posts.next(pageData);
                        this.isLoading.next(false);
                    }),
                ).subscribe();
            });
        }
    }

    onPostChange() {
        window.scrollTo(0, 0);
        this.isLoading.next(true);
        this.isUserSubscribed.next(!this.isUserSubscribed.getValue());
        this.currentPostPage.next(0);
        this.fetchPosts().subscribe(posts => {
            this.loadedPosts = posts.entities;
            this.posts.next(posts);
            this.isLoading.next(false);
        });
        this.isPostPaginationVisible$ = this.isPostPaginationVisible(this.posts);
    }

    private fetchSavedPosts() {
        return this.currentPostPage.pipe(
            take(1),
            distinctUntilChanged(),
            switchMap((currentPage) =>
                this.postService.getSavedPosts(currentPage, this.pageSize, this.sortBy)));
    }
    private fetchPosts(): Observable<Page> {
        if (this.searchText) {
            return this.currentPostPage.pipe(
                take(1),
                distinctUntilChanged(),
                switchMap((currentPage) =>
                    this.postService.searchPostsByText(this.searchText, currentPage, this.pageSize, this.sortBy)));
        } else {
            return this.currentPostPage.pipe(
                take(1),
                distinctUntilChanged(),
                switchMap((currentPage) =>
                    this.isUserSubscribed.getValue()
                        ? this.postService.fetchPostsBySubscription(currentPage, this.pageSize)
                        : this.postService.fetchPostsByPage(currentPage, this.tagName, this.username, this.pageSize, this.sortBy)))
        }
    }

    updatePost(postIdentifier: string, title: string, description: string, images: FileDTO) {
        this.matDialogService.updatePost(postIdentifier, title, description, images);
    }

    private updatePostView(updatedPost: PostModel) {
        if (updatedPost) {
            const postIndex = this.loadedPosts.findIndex((post) => post.identifier === updatedPost.identifier);
            if (postIndex !== -1) {
                this.loadedPosts[postIndex] = updatedPost;
            }
            const updatedPageData = new Page([...this.loadedPosts], this.totalPages.getValue(),
                this.currentPostPage.getValue(), this.totalPages.getValue());
            this.posts.next(updatedPageData);
        }
    }

    private updatePostViewAfterDeletion(identifier: string) {
        if (identifier) {
            const postIndex = this.loadedPosts.findIndex((post) => post.identifier === identifier);
            if (postIndex !== -1) {
                this.loadedPosts.splice(postIndex, 1);
            }
            const updatedPageData = new Page([...this.loadedPosts], this.totalPages.getValue(),
                this.currentPostPage.getValue(), this.totalPages.getValue());
            this.posts.next(updatedPageData);
        }
    }

    private isPostPaginationVisible(posts: Observable<Page>): Observable<boolean> {
        return this.postService.isPostPaginationVisible(posts);
    }

    displaySinglePost(postIdentifier: string) {
        const queryParamsString = "pageSize=" + this.pageSize + "&sortBy=" + this.sortBy;

        const redirectUrl = "post/" + postIdentifier + "?" + queryParamsString;

        this.routingService.setPathVariable(redirectUrl);
        return this.matDialogService.displaySinglePost(postIdentifier);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
