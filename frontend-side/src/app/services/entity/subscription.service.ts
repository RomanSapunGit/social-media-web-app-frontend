import {Injectable} from "@angular/core";
import {map, Observable, of} from "rxjs";
import {SubscriptionRequestService} from "../request/subscription.request.service";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    constructor(private requestService: SubscriptionRequestService) {
    }

    addSubscription(username: string): Observable<any> {
        return this.requestService.addFollowing( username);
    }

    removeSubscription(username: string): Observable<any> {
        return this.requestService.removeFollowing( username);
    }

    findFollowingByUsername( username: string): Observable<any> {
        return this.requestService.findFollowingByUsername( username);
    }
    isUserHasSubscriptions(username: string | null, tag: string | null): Observable<boolean> {
        if(username || tag) {
            return of(false);
        }
        return this.requestService.isUserHasSubscriptions().pipe(map((response: any) => {
            return response.valid;
        }));
    }
}