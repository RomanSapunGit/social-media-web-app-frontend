export class RequestFileDtoModel {
    constructor(fileName: string, fileType: string, fileData: string) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileData = fileData;
    }
    fileName: string = '';
    fileType: string = '';
    fileData: string;
}