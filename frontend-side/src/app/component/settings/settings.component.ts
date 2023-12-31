import {Component} from '@angular/core';
import {ConsentService} from "../../services/consent.service";
import {MatDialogRef} from "@angular/material/dialog";
import {BehaviorSubject, Subscription, take} from "rxjs";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    consent: BehaviorSubject<boolean>;
    subscription: Subscription;
    constructor(public consentService: ConsentService, public dialogRef: MatDialogRef<SettingsComponent>) {
        this.consent = new BehaviorSubject<boolean>(false);
        this.subscription = new Subscription();
            this.getConsent();
    }

    getConsent() {
      let consentSubscription =  this.consentService.getConsent().pipe().subscribe( (consent:any) => {
          const consentBoolean = consent.consent === 'true';
          this.consent.next(consentBoolean)
        });
      this.subscription.add(consentSubscription);
    }

    closeDialog() {
        this.subscription.unsubscribe();
        this.dialogRef.close();
    }

    toggleConsent() {
       let subscription = this.consent.pipe(take(1)).subscribe({
            next: (consent) => {
                this.consentService.giveConsent(!consent);
                this.consent.next(!consent);
            }
        })
        this.subscription.add(subscription);
    }
}
