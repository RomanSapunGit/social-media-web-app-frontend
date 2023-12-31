import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "./services/auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {SseRequestService} from "./services/request/sse.request.service";
import {BehaviorSubject} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {AuthRequestService} from "./services/request/auth.request.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    isNavbarCollapsed = true;
    selectedLanguage: string = 'en';

    constructor(private translate: TranslateService, private requestService: AuthRequestService,
                private breakpointObserver: BreakpointObserver) {
        const storedLanguage = localStorage.getItem('Language');
        this.selectedLanguage = storedLanguage === null ? 'en' : storedLanguage as string;
        translate.setDefaultLang(this.selectedLanguage);
        localStorage.setItem('isMobileView', JSON.stringify(breakpointObserver.isMatched(Breakpoints.Handset)));
    }

   async ngOnInit() {
       await this.requestService.getCsrf().pipe().subscribe({
           next: (token: any) => {
               console.log('check')
               this.requestService.setCsrfToken(token)
           }
       })
    }
    ngOnDestroy() {
        localStorage.clear();
    }

    switchLanguage() {
        this.translate.use(this.selectedLanguage);
        localStorage.setItem('Language', this.selectedLanguage);
    }

    title = 'frontend-side';

}
