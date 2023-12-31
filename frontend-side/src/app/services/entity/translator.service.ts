import {Injectable} from "@angular/core";
import {Observable,} from "rxjs";
import {TranslationModel} from "../../model/translation.model";
import {TranslationRequestService} from "../request/translation.request.service";

@Injectable({
    providedIn: 'root'
})
export class TranslatorService {
    constructor(private requestService: TranslationRequestService) {
    }

    translateText(text: string): Observable<TranslationModel> {
        let targetLanguage = localStorage.getItem("Language") == 'ua' ? 'uk' : localStorage.getItem("Language");
        console.log('check');
            let observer = targetLanguage ? this.requestService.translateText(text, targetLanguage)
                : this.requestService.translateText(text, 'en');
            return observer as Observable<TranslationModel>;
    }
}