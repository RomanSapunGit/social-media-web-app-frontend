import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SearchByTextService {
    private textFound: ReplaySubject<string>;
    constructor() {
        this.textFound = new ReplaySubject<string>()
    }
    get textFound$() {
        return this.textFound;
    }

    searchByText(text: string) {
        this.textFound.next(text);
    }
}