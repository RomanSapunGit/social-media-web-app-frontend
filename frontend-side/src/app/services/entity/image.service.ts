import {Injectable} from '@angular/core';
import {map, Observable, of, share} from "rxjs";
import {FileDTO} from "../../model/file.model";
import {AuthService} from "../auth/auth.service";
import {ImageDtoModel} from "../../model/image.dto.model";
import {ImageRequestService} from "../request/image.request.service";
import {CustomFile} from "../../model/custom.file.model";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private authService: AuthService, private requestService: ImageRequestService) {
  }

  fetchImagesFromModel(files: ImageDtoModel[]): Observable<string[]> {
    return of(files.map((file: ImageDtoModel) => {
      return 'data:' + file.fileDTO.fileType + ';base64,' +  file.fileDTO.fileData;
    }));
  }

  fetchImageFromModel(file: FileDTO): Observable<string> {
    return of('data:' + file.fileType + ';base64,' + file.fileData);
  }

  fetchUserImage(): Observable<string> {
    let token = this.authService.getAuthToken();
    return this.requestService.getImageByUser(token).pipe(
      map((response: any) => 'data:' + response.fileType + ';base64,' + response.fileData),
      share()
    );
  }
  getImageByUser(username: string) {
    return this.requestService.getImageByUsername(username).pipe(
        map((response: any) => response as FileDTO))
  }
  getImagesByPost(postId: string) {
    return this.requestService.getImagesByPost(postId).pipe(
        map((response: any) => response as ImageDtoModel[])
    )
  }
  readImageAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async createCircularImage(blob: Blob): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(blob);

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          reject(new Error('Canvas 2D context is not available.'));
          return;
        }

         this.cropImageToCircle(canvas, context, image);

        canvas.toBlob(resolve, 'image/png');
      };

      image.onerror = () => {
        reject(new Error('Failed to load the image.'));
      };
    });
  }

  cropImageToCircle(canvas: any, context: any, image: any) {
    const size = Math.min(image.width, image.height);
    canvas.width = size;
    canvas.height = size;

    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    context.closePath();
    context.clip();

    context.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, size, size);
  }

  async imageUrlToBlob(url: string): Promise<Blob | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      return await response.blob();
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  }
  convertFileDTOsToFiles(fileDTOs: ImageDtoModel[], source: 'existed' | 'new'): CustomFile[] {
    return fileDTOs.map(fileDTO => {
      const blob = new Blob([fileDTO.fileDTO.fileData], {type: fileDTO.fileDTO.fileType});
      const file = new File([blob], fileDTO.fileDTO.fileName, {type: fileDTO.fileDTO.fileType});
      if (fileDTO.identifier) {
        return new CustomFile(file, source, fileDTO.identifier);
      }
      return new CustomFile(file, source);
    });
  }

  arrayBufferToBase64(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  async readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result instanceof ArrayBuffer) {
          resolve(event.target.result);
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

}
