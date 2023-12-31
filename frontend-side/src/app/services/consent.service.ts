import {Injectable} from '@angular/core';
import {UserRequestService} from "./request/user.request.service";

@Injectable({
    providedIn: 'root'
})
export class ConsentService {

    constructor(private userRequestService: UserRequestService) {
    }

    giveConsent(consent: boolean) {
        this.userRequestService.sendUserConsentToServer(consent).subscribe({
            next: () => {
                localStorage.setItem('consent', 'true');
            }
        });
    }

    checkConsent(): boolean {
        let consent = localStorage.getItem('consent');
        console.log(consent)
        return consent != null;
    }

    getConsent() {
        return this.userRequestService.getConsent();
    }
}