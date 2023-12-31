import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './component/login/login.component';
import {RegisterComponent} from './component/register/register.component';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ServerErrorInterceptor} from "./provider/error.interceptor";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {MainPageComponent} from './component/main-page/main-page.component';
import {AuthGuard} from "./provider/auth.guard";
import {CookieService} from "ngx-cookie-service";
import {PageNotFoundComponent} from './component/page-not-found/pagenotfound.component';
import {ResetPasswordComponent} from './component/reset-password/reset-password.component';
import {MatButtonModule} from "@angular/material/button";
import {GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig} from "@abacritt/angularx-social-login";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {CommentActionComponent} from './component/dialog/creation-form/comment-action/comment-action.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ProfileFormComponent} from './component/dialog/profile-form/profile-form.component';
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {MatDialogDraggableDirective} from './directive/mat-dialog-draggable.directive';
import {PostsComponent} from './component/data/posts/posts.component';
import {CommentsComponent} from './component/data/comments/comments.component';
import {ImagesComponent} from './component/data/images/images.component';
import {LazyLoadImageModule} from "ng-lazyload-image";
import {NotificationComponent} from './component/notification/notification.component';
import {TimestampDatePipe} from "./pipe/timestamp-date.pipe";
import {environment} from "../environments/environment";
import {NavigationBarComponent} from './component/navigation-bar/navigation-bar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {PostActionComponent} from './component/dialog/creation-form/post-action/post-action.component';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {DropDownMenuComponent} from './component/drop-down-menu/drop-down-menu.component';
import {ClickOutsideDirective} from './directive/outside-click.directive';
import {ErrorDialogComponent} from './component/dialog/error-dialog/error-dialog.component'
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {PostViewComponent} from './component/dialog/view-form/post-view.component';
import {ImageCropperComponent} from './component/image-cropper/image-cropper.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {UserNotificationComponent} from './component/user-notification/user-notification.component';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {AngularFireMessagingModule} from '@angular/fire/compat/messaging';
import {SubscriptionsComponent} from './component/data/subscriptions/subscriptions.component';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TagsComponent} from './component/data/tags/tags.component';
import {UsersComponent} from './component/data/users/users.component';
import { FilterComponent } from './component/dialog/filter/filter.component';
import { AboutPageComponent } from './component/about-page/about-page.component';
import { ScrollToTopComponent } from './component/scroll-to-top/scroll-to-top.component';
import { SavedEntitiesComponent } from './component/dialog/saved-entities/saved-entities.component';
import {MatIconModule} from "@angular/material/icon";
import { ConsentComponent } from './component/consent/consent.component';
import { SettingsComponent } from './component/settings/settings.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

export function httpTranslateLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/translations/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        MainPageComponent,
        PageNotFoundComponent,
        ResetPasswordComponent,
        CommentActionComponent,
        ProfileFormComponent,
        MatDialogDraggableDirective,
        PostsComponent,
        CommentsComponent,
        ImagesComponent,
        NotificationComponent,
        TimestampDatePipe,
        NavigationBarComponent,
        PostActionComponent,
        DropDownMenuComponent,
        ClickOutsideDirective,
        ErrorDialogComponent,
        PostViewComponent,
        ImageCropperComponent,
        UserNotificationComponent,
        SubscriptionsComponent,
        TagsComponent,
        UsersComponent,
        FilterComponent,
        AboutPageComponent,
        ScrollToTopComponent,
        SavedEntitiesComponent,
        ConsentComponent,
        SettingsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        GoogleSigninButtonModule,
        CommonModule,
        MatDialogModule,
        CdkDrag,
        CdkDragHandle,
        LazyLoadImageModule,
        MatToolbarModule,
        SlickCarouselModule,
        InfiniteScrollModule,
        ImageCropperModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireMessagingModule,
        TranslateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoaderFactory,
                deps: [HttpClient]
            }
        }),
        NgOptimizedImage,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ServerErrorInterceptor,
            multi: true
        },
        AuthGuard,
        CookieService,
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(environment.googleClientId),
                    },
                ],
            } as SocialAuthServiceConfig,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
