import { Injectable } from '@angular/core';
import {BehaviorSubject, ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageCropperService {
  private croppedImageObjectUrl: ReplaySubject<File> = new ReplaySubject<File>(1);

  setCroppedImageObjectUrl(objectUrl: File) {
    console.log('check')
    this.croppedImageObjectUrl.next(objectUrl);
  }

  getCroppedImageObjectUrl$() {
    console.log('check2')
    return this.croppedImageObjectUrl;
  }

  destroyCropper() {
    this.croppedImageObjectUrl = new ReplaySubject<File>();
  }
}
