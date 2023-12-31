import {CustomFile} from "./custom.file.model";
import {RequestImageDtoModel} from "./request-image-dto.model";

export interface RequestUpdatePostModel {
    identifier: string;
    title: string;
    description: string;
    images: RequestImageDtoModel[];
    newImages: RequestImageDtoModel[];
}