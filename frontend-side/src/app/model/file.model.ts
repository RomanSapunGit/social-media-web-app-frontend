export class FileDTO {
  constructor(fileName: string, fileType: string, fileData: Uint8Array) {
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileData = fileData;
  }
  fileName: string = '';
  fileType: string = '';
  fileData: Uint8Array = new Uint8Array([200, 255, 100]);
}
