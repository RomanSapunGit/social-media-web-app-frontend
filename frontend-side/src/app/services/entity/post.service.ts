import {Injectable} from '@angular/core';
import {Page} from "../../model/page.model";
import {map, Observable, take} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {PostModel} from "../../model/post.model";
import {PostRequestService} from "../request/post.request.service";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(private authService: AuthService,
                private requestService: PostRequestService) {
    }

    addPostToSavedList(identifier: string) {
       return this.requestService.addPostToSavedList(identifier);
    }
    deletePostFromSavedList(identifier: string) {
        return this.requestService.deletePostFromSavedList(identifier);
    }
    findPostInSavedList(identifier: string) {
        return this.requestService.findPostInSavedList(identifier).pipe(take(1),map(isFound => isFound as boolean))
    }

    fetchPostsByPage(page: number, tagName: string | null, username: string | null, pageSize?: number, sortByValue?: string): Observable<Page> {
        const token = this.authService.getAuthToken();
        let fetchPostsObservable: Observable<any>;

        if (tagName) {
            const codedTagName = tagName.replace(/#/, '%23');
            fetchPostsObservable = this.requestService.getPostsByTag(page, token, codedTagName, pageSize, sortByValue);
        } else if (username) {
            fetchPostsObservable = this.requestService.getPostsByUsername(page, token, username, pageSize, sortByValue);
        } else {
            fetchPostsObservable = this.requestService.getPosts(page, token, pageSize, sortByValue);
        }
        return fetchPostsObservable.pipe(
            map(response => this.convertToPostPage(response))
        );
    }

    deletePost(postId: string): Observable<any> {
        let token = this.authService.getAuthToken();
        return this.requestService.deletePost(token, postId);
    }

    fetchPostsBySubscription(page: number, pageSize?: number, sortByValue?: string): Observable<Page> {
        const token = this.authService.getAuthToken();
        return this.requestService.getPostsBySubscription(token, page, pageSize, sortByValue).pipe(
            map(response => this.convertToPostPage(response))
        );
    }

    isPostPaginationVisible(posts: Observable<Page>): Observable<boolean> {
        return posts.pipe(
            map(posts => posts?.totalPages !== undefined && posts?.totalPages !== 0 && posts?.totalPages !== 1)
        );
    }

    searchPostsByText(text: string, page: number, pageSize: number, sortBy: string): Observable<Page> {
        return this.requestService.searchPostsByText( text, page, pageSize, sortBy).pipe(
            map(response => this.convertToPostPage(response))
        );
    }

    getSavedPosts(page: number, pageSize: number, sortBy: string) {
        return this.requestService.getSavedPosts(page, pageSize, sortBy).pipe(
            map(response => this.convertToPostPage(response))
        )
    }

    getPostById(identifier: string): Observable<PostModel> {
        let token = this.authService.getAuthToken();
        return this.requestService.getPostById(token, identifier).pipe(
            map(response => response as PostModel)
        )
    }

    private convertToPostPage(response: any): Page {
        return new Page(
            response.entities as PostModel[],
            response.total as number,
            response.currentPage as number,
            response.totalPages as number
        );
    }
}
