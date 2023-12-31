import {Injectable} from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject} from "rxjs";
import {CommentModel} from "../../model/comment.model";
import {Page} from "../../model/page.model";
import {CommentRequestService} from "../request/comment.request.service";

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private commentCreated: ReplaySubject<CommentModel> = new ReplaySubject<CommentModel>();

    constructor(private requestService: CommentRequestService) {
    }

    clearSubject() {
        this.commentCreated = new ReplaySubject<CommentModel>();
    }

    get commentCreated$() {
        return this.commentCreated;
    }

    addComment(commentModel: CommentModel) {
        this.commentCreated.next(commentModel);
    }

    getSavedComments(currentCommentPage: number) {
        return this.requestService.getSavedComments(currentCommentPage).pipe(
            map((response:any) => new Page(response.entities, response.total, response.currentPage, response.totalPages))
        )
    }

    addCommentToSavedList(identifier: string) {
        return this.requestService.addCommentToSavedList(identifier)
    }

    deleteCommentFromSavedList(identifier: string) {
        return this.requestService.deleteCommentFromSavedList(identifier)
    }

    findCommentInSavedList(identifier: string) {
        return this.requestService.findCommentInSavedList(identifier)
    }

    getComments(postId: string, currentCommentPage: number): Observable<Page> {
        const currentPage = currentCommentPage || 0;
        return this.requestService.getCommentsByPost(postId, currentPage).pipe(
            map((response: any) => {
                return new Page(response.entities, response.total, response.currentPage, response.totalPages);
            }),
            catchError(() => {
                return of(undefined);
            })
        ) as Observable<Page>;
    }

    isCommentPaginationVisible(postComments: Observable<Page>): Observable<boolean> {
        if (postComments) {
            return postComments.pipe(
                map((comments) => comments?.totalPages !== undefined && comments?.totalPages !== 0 && comments?.totalPages !== 1)
            );
        } else {
            return of(false);
        }
    }
}
