import {Component} from '@angular/core';
import {ConsentService} from "../../services/consent.service";
import {Subscription, take} from "rxjs";

@Component({
    selector: 'app-consent',
    templateUrl: './consent.component.html',
    styleUrls: ['./consent.component.scss']
})
export class ConsentComponent {
    consent: boolean;
    subscription: Subscription;

    constructor(public consentService: ConsentService) {
        this.subscription = new Subscription();
        let consent = consentService.checkConsent();
        console.log(consent)
        this.consent = consent;
    }

    handleConsent(consent: boolean): void {
        this.consentService.giveConsent(consent);
        const consentBlockElement = document.querySelector('.consent-block') as HTMLElement;
        if (consentBlockElement) {
            consentBlockElement.style.display = 'none';
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
