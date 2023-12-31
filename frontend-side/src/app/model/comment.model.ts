import {Timestamp} from "rxjs";
import {FileDTO} from "./file.model";

export class CommentModel {
    constructor(identifier: string, title: string, description: string, username: string, creationTime: Timestamp<any>,
    userImage: FileDTO, postAuthorUsername?: string) {
        this.identifier = identifier;
        this.title = title;
        this.description = description;
        this.username = username;
        this.creationTime = creationTime;
        this.userImage = userImage;
        this.postAuthorUsername = postAuthorUsername;
    }
    identifier: string;
    title: string;
    description: string;
    username: string;
    creationTime: Timestamp<any>;
    userImage: FileDTO;
    postAuthorUsername?: string;
}
