import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth/auth.service";
import {NotificationService} from "../../../../services/entity/notification.service";
import {CommentModel} from "../../../../model/comment.model";
import {CommentService} from "../../../../services/entity/comment.service";
import {MatDialogService} from "../../../../services/mat-dialog.service";
import {WebsocketCommentService} from "../../../../services/websocket/websocket-comment.service";
import {CommentRequestService} from "../../../../services/request/comment.request.service";

@Component({
  selector: 'app-creation-form',
  templateUrl: './comment-action.component.html',
  styleUrls: ['./comment-action.component.scss']
})
export class CommentActionComponent {
  commentForm: FormGroup;
  commentData = {title: '', description: ''};
  isUpdating: boolean;


  constructor(public dialogRef: MatDialogRef<CommentActionComponent>, private formBuilder: FormBuilder,
              private requestService: CommentRequestService, private authService: AuthService,
              private notificationService: NotificationService, private commentService: CommentService,
              @Inject(MAT_DIALOG_DATA) public data: any, private matDialogService: MatDialogService,
              private webSocketService: WebsocketCommentService) {
    this.commentForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.required, Validators.minLength(6)]]
    })
    this.isUpdating = this.data.isUpdating;
    if (this.isUpdating) {
      this.commentForm.patchValue({
        title: data.title,
        description: data.description
      });
    }
  }

  onSubmit() {
    this.isUpdating ? this.updateComment() : this.createComment();
  }

  closeDialog() {
    this.matDialogService.dialogClosed();
    this.dialogRef.close();
  }

  createComment() {
    this.commentData = {...this.commentForm.value};
    let postId = this.data.id;
    let token = this.authService.getAuthToken();
    this.requestService.createComment(postId, token, this.commentData).subscribe({
        next: (response: any) => {
          this.commentService.addComment(response as CommentModel);
          this.notificationService.showNotification('comment created successfully', false);
          this.webSocketService.publishCommentCreated(response as CommentModel, postId);
          this.closeDialog();
        }
      }
    );
  }

  updateComment() {
    this.commentData = {...this.commentForm.value};
    let commentId = this.data.id;
    let token = this.authService.getAuthToken();
    this.requestService.updateComment(this.commentData, token, commentId).subscribe({
      next: (response: any) => {
        this.notificationService.showNotification('comment updated successfully', false);
        let postId = this.data.postId;
        this.webSocketService.publishCommentUpdated(response as CommentModel, postId)
        this.closeDialog();
      }
    })
  }
}
