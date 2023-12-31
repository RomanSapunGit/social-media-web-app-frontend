import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import {PostModel} from "../../model/post.model";

@Injectable({
  providedIn: 'root'
})
export class PostActionService {
  private postCreated: ReplaySubject<any> = new ReplaySubject<any>(1);
  private postToDelete: ReplaySubject<string> = new ReplaySubject<string>(1);
  get postCreated$() {
    return this.postCreated;
  }

  addPost(postModel: PostModel) {
    this.postCreated.next(postModel);
  }
  deletePost$() {
    return this.postToDelete;
  }
  deletePost(identifier: string) {
    this.postToDelete.next(identifier);
  }
}
