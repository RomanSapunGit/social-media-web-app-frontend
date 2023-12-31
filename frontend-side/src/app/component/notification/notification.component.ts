import {Component, EventEmitter, Inject, Input, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Input() message: string;
  @Input() isError: boolean;
  @Output() resetError = new EventEmitter<void>();

  constructor() {
    this.message = '';
    this.isError = false;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['message'] && changes['message'].currentValue) {
      setTimeout(() => {
        this.showAndAutoCloseError();
      }, 0);
    }
  }

  showAndAutoCloseError() {
    const errorBox = document.querySelector('.notification-dialog-box') as HTMLElement;
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.style.background = this.isError ? '#FF4136' : '#808080';
      setTimeout(() => {
        this.closeNotification();
      }, 5000);
    }
  }

  closeNotification() {
    const errorBox = document.querySelector('.error-dialog-box') as HTMLElement;
    if (errorBox) {
      errorBox.style.display = 'none';
    }
    this.resetError.emit();
  }
}
