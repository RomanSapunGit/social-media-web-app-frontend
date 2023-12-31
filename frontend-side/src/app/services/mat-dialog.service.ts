import {Injectable} from '@angular/core';
import {CommentActionComponent} from "../component/dialog/creation-form/comment-action/comment-action.component";
import {ProfileFormComponent} from "../component/dialog/profile-form/profile-form.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PostActionComponent} from "../component/dialog/creation-form/post-action/post-action.component";
import {ErrorDialogComponent} from "../component/dialog/error-dialog/error-dialog.component";
import {PostViewComponent} from "../component/dialog/view-form/post-view.component";
import {BehaviorSubject} from "rxjs";
import {ImageCropperComponent} from "../component/image-cropper/image-cropper.component";
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {NotificationService} from "./entity/notification.service";
import {FilterComponent} from "../component/dialog/filter/filter.component";
import {FileDTO} from "../model/file.model";
import {SavedEntitiesComponent} from "../component/dialog/saved-entities/saved-entities.component";
import {SettingsComponent} from "../component/settings/settings.component";

@Injectable({
    providedIn: 'root'
})
export class MatDialogService {
    private openDialogs: number = 0;
    private maxOpenDialogs: number = 10;
    private dialogWidth!: string;
    private dialogHeight!: string;
    private isDialogClosed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private dialog: MatDialog, private breakpointObserver: BreakpointObserver,
                private notificationService: NotificationService) {

        if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
            this.dialogWidth = '120%';
            this.dialogHeight = '70%';
        } else {
            this.dialogWidth = '30%';
            this.dialogHeight = '80%';
        }
    }

    canOpenDialog(): boolean {
        return this.openDialogs < this.maxOpenDialogs;
    }

    dialogClosed(): void {
        this.openDialogs--;
    }


    get isDialogClosed$() {
        return this.isDialogClosed;
    }

    openFilterDialog() {
        if (this.canOpenDialog()) {
            let dialogConfig = this.setDialogConfigWithData(false, true, this.dialogWidth, this.dialogHeight,
                false, null);
            this.openDialogs++;
            this.dialog.open(FilterComponent, dialogConfig);
        } else {
            this.notificationService.showNotification
            (`Number of allowed number of dialogs exceeded ( ${this.openDialogs}/10)`, true);
        }
    }

    createComment(id: string) {
        if (this.canOpenDialog()) {
            let dialogConfig = this.setDialogConfigWithData(true, true, this.dialogWidth, this.dialogHeight,
                false,
                {id, isUpdating: false});
            this.openDialogs++;
            this.dialog.open(CommentActionComponent, dialogConfig);
        } else {
            this.notificationService.showNotification
            (`Number of allowed number of dialogs exceeded ( ${this.openDialogs}/10)`, true);
        }
    }

    updateComment(id: string, title: string, description: string, postId: string) {
        if (this.canOpenDialog()) {
            let dialogConfig = this.setDialogConfigWithData(true, true, this.dialogWidth, this.dialogHeight,
                false,
                {id, isUpdating: true, title, description, postId});
            this.openDialogs++;
            this.dialog.open(CommentActionComponent, dialogConfig);
        } else {
            this.notificationService.showNotification
            (`Number of allowed number of dialogs exceeded ( ${this.openDialogs}/10)`, true);
        }
    }

    createPost() {
        if (this.canOpenDialog()) {
            let dialogConfig = this.setDialogConfigWithData(true, true, this.dialogWidth, this.dialogHeight,
                false, {isUpdating: false});
            this.openDialogs++;
            this.dialog.open(PostActionComponent, dialogConfig);
        } else {
            this.notificationService.showNotification
            (`Number of allowed number of dialogs exceeded ( ${this.openDialogs}/10)`, true);
        }
    }

    updatePost(postIdentifier: string, title: string, description: string, images: FileDTO) {
        if (this.canOpenDialog()) {
            let dialogConfig = this.setDialogConfigWithData(true, true, this.dialogWidth, this.dialogHeight,
                false,
                {isUpdating: true, postIdentifier: postIdentifier, title, description, images});
            this.openDialogs++;
            this.dialog.open(PostActionComponent, dialogConfig);
        } else {
            this.notificationService.showNotification
            (`Number of allowed number of dialogs exceeded ( ${this.openDialogs}/10)`, true);
        }
    }

    showPostsByTag(tag: string) {
        if (this.canOpenDialog()) {
            let dialogConfig = this.setDialogConfigWithData(false, true, this.dialogWidth, this.dialogHeight,
                false, tag);
            this.openDialogs++;
            console.log(this.dialogWidth, this.dialogHeight)
            this.dialog.open(ProfileFormComponent, dialogConfig);
        } else {
            this.notificationService.showNotification
            (`Number of allowed number of dialogs exceeded ( ${this.openDialogs}/10)`, true);
        }
    }

    showSettings() {
        if(this.canOpenDialog()) {
            let dialogConfig = this.setDialogConfigWithData(false, true, this.dialogWidth, this.dialogHeight,
                false, null);
            this.openDialogs++;
            this.dialog.open(SettingsComponent, dialogConfig);
        }
    }

    showPostsByUsername(username: string) {
        if (this.canOpenDialog()) {
            let dialogConfig = this.setDialogConfigWithData(false, true, this.dialogWidth, this.dialogHeight,
                false, username);
            this.openDialogs++;
            this.dialog.open(ProfileFormComponent, dialogConfig);
        } else {
            this.notificationService.showNotification
            (`Number of allowed number of dialogs exceeded ( ${this.openDialogs}/10)`, true);
        }
    }

    displayError(errorMessage: string) {
            let dialogConfig = this.setDialogConfigWithData(false, true, '30%', '150px',
                false, errorMessage);
            this.dialog.open(ErrorDialogComponent, dialogConfig);
    }

    displaySinglePost(identifier: string) {
        if (this.canOpenDialog()) {
            let dialogConfig = this.setDialogConfigWithData(false, true, this.dialogWidth, '80%',
                false, {identifier: identifier});
            const dialogRef = this.dialog.open(PostViewComponent, dialogConfig);
            this.openDialogs++;
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.isDialogClosed.next(result.isDialogClosed);
                }
            });
        } else {
            this.notificationService.showNotification
            (`Number of allowed number of dialogs exceeded ( ${this.openDialogs}/10)`, true);
        }
    }

    displayCropper(selectedImage: File) {
        let dialogConfig = this.setDialogConfigWithData(false, true, this.dialogWidth, this.dialogHeight,
            false, {selectedImage: selectedImage});
        this.dialog.open(ImageCropperComponent, dialogConfig);
    }
    openSavedEntitiesDialog() {
        let dialogConfig = this.setDialogConfigWithData(false, true, this.dialogWidth, this.dialogHeight,
            false, {});
        this.dialog.open(SavedEntitiesComponent, dialogConfig);
    }

    private setDialogConfigWithData(disableClose: boolean, autofocus: boolean, width: string, height: string, hasBackDrop: boolean, data: any): MatDialogConfig {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = disableClose;
        dialogConfig.autoFocus = autofocus;
        dialogConfig.width = width;
        dialogConfig.height = height;
        dialogConfig.data = data;
        dialogConfig.hasBackdrop = hasBackDrop;
        return dialogConfig;
    }
}
