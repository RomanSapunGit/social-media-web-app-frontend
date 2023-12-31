import {Timestamp} from "rxjs";

export interface UserNotificationModel {
    message: string;
    username: string,
    postIdentifier: string,
    postTitle: string,
    notificationCreationTime: Timestamp<any>
}