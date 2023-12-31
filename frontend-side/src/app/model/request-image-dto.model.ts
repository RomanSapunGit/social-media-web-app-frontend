import {FileDTO} from "./file.model";
import {RequestFileDtoModel} from "./response-file-dto.model";

export class RequestImageDtoModel {
    constructor(identifier: string, image: RequestFileDtoModel  ) {
        this.identifier= identifier;
        this.image = image;
    }
    identifier?: string;
    image: RequestFileDtoModel;
}