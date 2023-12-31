import {Timestamp} from "rxjs";
import {FileDTO} from "./file.model";
import {Page} from "./page.model";
import {UserModel} from "./user.model";
import {ImageDtoModel} from "./image.dto.model";

export class PostViewModel {
  constructor(identifier: string, title: string, description: string, creationTime: Timestamp<any>, username: string,
              userImage: FileDTO, postImages: ImageDtoModel[] , upvotes: number, downvotes: number, commentsPage?: Page) {
    this.identifier = identifier;
    this.title = title;
    this.description = description;
    this.creationTime = creationTime;
    this.username = username;
    this.userImage = userImage;
    this.postImages = postImages;
    this.commentsPage = commentsPage;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
  }
  identifier: string;
  title: string;
  description: string;
  creationTime: Timestamp<any>;
  username: string;
  userImage: FileDTO;
  postImages: ImageDtoModel[];
  commentsPage?: Page;
  upvotes: number;
  downvotes: number;
}
