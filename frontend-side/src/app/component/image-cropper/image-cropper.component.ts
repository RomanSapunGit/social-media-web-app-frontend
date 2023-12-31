import {Component, Inject, Input, Output, ViewChild} from '@angular/core';
import {NotificationService} from "../../services/entity/notification.service";
import {base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform} from "ngx-image-cropper";
import {ImageCropperService} from "../../services/image-cropper.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageService} from "../../services/entity/image.service";

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent {
  imageChangedEvent: any = '';
  croppedImage: File | null = null;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  isCroppingFinished = false;
  containWithinAspectRatio = false;
  selectedFile: File | null = null;
  transform: ImageTransform = {};
  imageUrl: string = '';

  constructor(private imageCropperService: ImageCropperService, private matDialogRef: MatDialogRef<ImageCropperComponent>,
              private imageService: ImageService,
              @Inject(MAT_DIALOG_DATA) public data: any, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.selectedFile = this.data.selectedImage;
    if (this.selectedFile) {
      this.imageChangedEvent = {target: {files: [this.selectedFile]}};
    }
  }

  imageCroppingFinished() {
    this.isCroppingFinished = true;
    this.matDialogRef.close();
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log('Image Cropped Event:', event);
    if (!event.blob) {
      this.notificationService.sendErrorNotificationToSlack('Base64 blob is undefined.',
          "in image cropper (image cropped method).", new Date());
      return;
    }
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      this.notificationService.sendErrorNotificationToSlack('Canvas 2D context is not available.',
          "in image cropper (image cropped method).", new Date());
      return;
    }

    const image = new Image();
    image.src = URL.createObjectURL(event.blob);

    image.onload = () => {
      this.imageService.cropImageToCircle(canvas, context, image);

      canvas.toBlob((blob) => {
        if (!blob) {
          this.notificationService.sendErrorNotificationToSlack('Failed to create blob.',
              "in image cropper (image cropped method).", new Date());
          return;
        }
        this.croppedImage = new File([blob], 'cropped-image.png', {type: 'image/png'});
        this.imageCropperService.setCroppedImageObjectUrl(this.croppedImage);
        this.readImageAsBase64(this.croppedImage);
      }, 'image/png');
    };

  }

  readImageAsBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
  }

  loadImageFailed() {
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }
  closeDialog() {
    this.matDialogRef.close();
  }
}
