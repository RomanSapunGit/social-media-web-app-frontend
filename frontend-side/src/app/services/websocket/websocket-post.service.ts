import {Injectable} from "@angular/core";
import {BehaviorSubject, filter, Observable, switchMap, take} from "rxjs";
import {Client} from "@stomp/stompjs";
import {environment} from "../../../environments/environment";
import {PostModel} from "../../model/post.model";
import {AuthRequestService} from "../request/auth.request.service";

@Injectable({
    providedIn: 'root'
})
export class WebsocketPostService {
    private stompClient!: Client;
    private stompClientSubject: BehaviorSubject<Client | null> = new BehaviorSubject<Client | null>(null);

    constructor(private requestService: AuthRequestService) {

    }
    private initializeClient() {
        this.requestService.getCsrf().subscribe((token: any) => {
            console.log('check')
            this.stompClient = new Client({
                brokerURL: environment.brokerURL,
                connectHeaders: {
                    'X-CSRF-TOKEN': token.token
                },
                debug: (str) => {
                    console.log(str);
                }
            });

            this.stompClient.onConnect = () => {
                this.stompClientSubject.next(this.stompClient);
            };
                this.stompClient.activate();
        });
    }


    private waitForInitialization(): Observable<Client> {
        return this.stompClientSubject.pipe(
            filter(client => client !== null),
            filter(Boolean),
            take(1)
        );
    }

    connect() {
        this.initializeClient()
    }

    publishCommentUpdated(postModel: PostModel, postId: string) {
        const postToSend = {
            identifier: postModel.identifier,
            title: postModel.title,
            description: postModel.description,
            username: postModel.username,
            creationTime: postModel.creationTime
        };


        this.stompClient.publish({
            destination: '/app/post/update/' + postId,
            body: JSON.stringify(postToSend)
        });
    }

    subscribeToPostUpdate(postId: string): Observable<any> {
        return this.waitForInitialization().pipe(
            switchMap((stompClient) => {
                console.log('check');
                stompClient.debug = function (str) {
                    console.log(str);
                };

                return new Observable((observer) => {
                    const subscription = stompClient.subscribe('/topic/posts/update/' + postId, (comment) => {
                        const parsedPost = JSON.parse(comment.body);
                        console.log(parsedPost);
                        observer.next(parsedPost);
                    });

                    return () => {
                        subscription.unsubscribe();
                    };
                });
            })
        );
    }

    disconnect() {
        console.log('disconnect works');
        this.stompClient.deactivate();
    }
}