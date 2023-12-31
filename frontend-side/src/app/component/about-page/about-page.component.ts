import {Component, ElementRef, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";
import {NgOptimizedImage} from '@angular/common'
import {BehaviorSubject} from "rxjs";
import {NotificationService} from "../../services/entity/notification.service";
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
@Component({
    selector: 'app-about-page',
    templateUrl: './about-page.component.html',
    styleUrls: ['./about-page.component.scss'],
    animations: [
        trigger('imageAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('500ms', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class AboutPageComponent {
    isErrorMessage: boolean;
    errorMessage: BehaviorSubject<string>;
    images: string[] = [
        'assets/image/angular-image.png',
        'assets/image/spring-boot-image.png',
        'assets/image/mySQL-image.png',
    ];
    currentIndex = 0;
    isAnimating = false;

    constructor(private notificationService: NotificationService) {
        this.isErrorMessage = false;
        this.errorMessage = new BehaviorSubject<string>('');
    }

    ngOnInit() {
        this.notificationService.notification$.subscribe({
            next: (message) => {
                console.log(message);
                this.errorMessage.next(message.message);
                this.isErrorMessage = message.isErrorMessage;
            },
        });
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
        }, 2000);
    }
}