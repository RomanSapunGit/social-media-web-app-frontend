import {Injectable} from "@angular/core";
import {RxStomp} from '@stomp/rx-stomp';
import {CommentModel} from "../../model/comment.model";
import {environment} from "../../../environments/environment";
import {ReplaySubject, Subscription} from "rxjs";
import {AuthRequestService} from "../request/auth.request.service";

@Injectable({
    providedIn: 'root'
})
export class WebsocketCommentService {
    private stompClient: RxStomp;
    private commentReceived$: ReplaySubject<any>;
    private commentUpdated$: ReplaySubject<any>;
    private subscription: Subscription;

    constructor(private requestService: AuthRequestService) {
        this.subscription = new Subscription();
        this.commentUpdated$ = new ReplaySubject<any>();
        this.commentReceived$ = new ReplaySubject<any>();
        this.stompClient = new RxStomp();
        this.stompClient.configure({
            brokerURL: environment.brokerURL,
            connectHeaders: {
                'X-CSRF-TOKEN': requestService.getCsrfToken().token
            },
            debug: (str) => {
                console.log(str);
            }
        })
    }

    getCommentReceived$() {
        return this.commentReceived$;
    }

    getCommentUpdated$() {
        return this.commentUpdated$;
    }

    connect() {
        this.stompClient.activate();
    }

    subscribeToCommentActions(postId: string) {
        const createSubscription = this.stompClient
            .watch({destination: '/topic/comments/create/' + postId})
            .subscribe((comment: any) => {
                const parsedComment = JSON.parse(comment.body);
                console.log(parsedComment)
                this.commentReceived$.next(parsedComment);
            });

        const updateSubscription = this.stompClient
            .watch({destination: '/topic/comments/update/' + postId})
            .subscribe((comment: any) => {
                const parsedComment = JSON.parse(comment.body);
                console.log(parsedComment)
                this.commentUpdated$.next(parsedComment);
            });
        this.subscription.add(createSubscription);
        this.subscription.add(updateSubscription);
        };


    publishCommentUpdated(comment: CommentModel, postId: string) {
        const commentToSend = {
            identifier: comment.identifier,
            title: comment.title,
            description: comment.description,
            username: comment.username,
            creationTime: comment.creationTime,
            postAuthorUsername: comment.postAuthorUsername
        };

        this.stompClient.publish({
            destination: '/app/comment/update/' + postId,
            body: JSON.stringify(commentToSend)
        });
    }

    publishCommentCreated(comment: CommentModel, postId: string) {
        const commentToSend = {
            identifier: comment.identifier,
            title: comment.title,
            description: comment.description,
            username: comment.username,
            creationTime: comment.creationTime,
            postAuthorUsername: comment.postAuthorUsername
        };

        this.stompClient.publish({
            destination: '/app/comment/create/' + postId,
            body: JSON.stringify(commentToSend)
        });
    }

    disconnect() {
        console.log('disconnect works');
        this.subscription = new Subscription();
        this.commentReceived$ = new ReplaySubject<any>();
        this.commentUpdated$ = new ReplaySubject<any>();
        this.stompClient.deactivate();
    }
}