import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {VoteRequestService} from "../request/vote.request.service";

@Injectable({
    providedIn: 'root'
})
export class VoteService {
    constructor(private requestService: VoteRequestService) {
    }
    addUpvote(identifier: string): Observable<number> {
        return this.requestService.addUpvote(identifier).pipe(
            map(response => response as number))
    }

    removeUpvote(identifier: string): Observable<number> {
        return this.requestService.removeUpvote(identifier).pipe(
            map(response => response as number))
    }

    addDownvote(identifier: string): Observable<number> {
        return this.requestService.addDownvote(identifier).pipe(
            map(response => response as number))
    }

    removeDownvote(identifier: string): Observable<number> {
        return this.requestService.removeDownvote(identifier).pipe(
            map(response => response as number))
    }

    isUpvoteMade(identifier: string): Observable<boolean> {
        return this.requestService.isPostUpvoted(identifier).pipe(map((response: any) => {
            return response.valid;
        }))
    }

    isDownvoteMade(identifier: string): Observable<boolean> {
        return this.requestService.isPostDownvoted(identifier).pipe(map((response: any) => {
            return response.valid;
        }))
    }
}