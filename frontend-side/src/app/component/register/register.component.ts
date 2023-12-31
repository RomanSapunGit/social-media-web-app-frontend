import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../services/entity/notification.service";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {Subject, Subscription, takeUntil} from "rxjs";
import {MatDialogService} from "../../services/mat-dialog.service";
import {ImageCropperService} from "../../services/image-cropper.service";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {CredentialsService} from "../../services/auth/credentials.service";
import {ImageService} from "../../services/entity/image.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerData: { email: string, password: string, name: string, username: string };

  registerForm: FormGroup;
  googleRegisterForm!: FormGroup;
  socialUser: SocialUser|null = null;
  authSubscription: Subscription;
  selectedImage: File | null = null;
  image = 'assets/image/bg1.jpg'
  imageUrl = 'assets/image/png-transparent-default-avatar.png';
  message: string;
  isErrorMessage: boolean
  isImageChosen: boolean;
  unsubscribeAll!: Subject<any>;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService, private socialAuthService: SocialAuthService,
              private changeDetectorRef: ChangeDetectorRef, private imageCropperService: ImageCropperService,
              private matDialogService: MatDialogService, private authService: AuthService, private router: Router,
              private credentialsService: CredentialsService, private imageService: ImageService) {
    this.isImageChosen = false;
    this.message = '';
    this.isErrorMessage = false;
    this.registerData = {email: '', password: '', name: '', username: ''}
    this.authSubscription = new Subscription();
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(12)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async ngOnInit() {
    this.unsubscribeAll = new Subject();

    if(this.authService.getAuthToken() && this.authService.getUsername()) {
      await this.router.navigate(['/main']);
    }
    this.handleNotificationService();
    this.handleSocialAuthService();
    this.handleImageCropperService();
  }

  handleNotificationService() {
    this.notificationService.notification$
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(message => {
          this.message = this.getMessage(message);
          this.isErrorMessage = message.isErrorMessage;
          this.changeDetectorRef.detectChanges();
        });
  }

  getMessage(message: any) {
    if (message.message.includes('Duplicate entry')) {
      if (message.message.includes("'users.username'")) {
        return 'Username already exists. Please choose a different username.';
      } else if (message.message.includes("'users.email'")) {
        return 'Email already exists. Please choose a different email.';
      }
    }
    return message.message;
  }

  handleSocialAuthService() {
    this.socialAuthService.authState
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((user) => {
          console.log('check')
          this.socialUser = user;
          if (this.socialUser && this.socialUser.email) {
            this.createGoogleLoginRegisterGroup(user);
            this.imageUrl = user.photoUrl;
          }
        });
  }

  handleImageCropperService() {
    this.imageCropperService.getCroppedImageObjectUrl$()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe({
          next: (imageFile) => {
            console.log('check')
            this.readImageAsBase64(imageFile);
            this.isImageChosen = false;
          },
          error: (err) => console.log(err.error.message)
        });
  }

  readImageAsBase64(file: File) {
    this.imageService.readImageAsBase64(file).then(imageUrl => {
      console.log('check')
      this.imageUrl = imageUrl;
    });
  }

  createGoogleLoginRegisterGroup(user: SocialUser) {
    this.googleRegisterForm = this.formBuilder.group({
      email: [user.email, [Validators.required, Validators.minLength(12)]],
      password: [''],
      name: [user.name, [Validators.required, Validators.minLength(6)]],
      username: [user.name, [Validators.required, Validators.minLength(6)]],
    });
  }
  returnToRegularRegister() {
    this.socialUser = null;
    this.imageUrl = 'assets/image/png-transparent-default-avatar.png';
  }

  async register() {
    const { name, username, email, password } = this.googleRegisterForm ? this.googleRegisterForm.value : this.registerForm.value;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if(this.socialUser)
    formData.append('googleIdentifier', this.socialUser.idToken);

    const imageToUpload = this.selectedImage || await this.getCircularImage(this.imageUrl);
    if (imageToUpload) {
      console.log(imageToUpload)
      formData.append('image', imageToUpload);
    }

    this.credentialsService.registerAndRedirect(formData)
  }

  async getCircularImage(imageUrl: string): Promise<Blob | null> {
    if (!this.selectedImage) {
      const defaultImageBlob = await this.imageService.imageUrlToBlob(imageUrl);
      return defaultImageBlob ? await this.imageService.createCircularImage(defaultImageBlob) : null;
    }
    return null;
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      this.matDialogService.displayCropper(file);
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.complete();
    this.imageCropperService.destroyCropper();
    this.imageUrl = 'assets/image/png-transparent-default-avatar.png';
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.socialUser = null;
    this.socialAuthService.signOut();
  }
}
