import {Component, HostListener} from '@angular/core';
import {ImageService} from "../../services/entity/image.service";
import {BehaviorSubject, Observable} from "rxjs";
import {MatDialogService} from "../../services/mat-dialog.service";
import {SearchByTextService} from "../../services/search-by-text.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent {
    isNavbarCollapsed = true;
    showProfileMenu: boolean;
    userImage: Observable<string>;
    searchQuery: string;
    isMobileView: boolean | null;
    isMobileNavOpen: boolean;
    isMenuOpen: boolean;
    username: string | null;
    isNotificationsOpened: BehaviorSubject<boolean>;

    constructor(private matDialogService: MatDialogService, private imageService: ImageService, private searchByTextService: SearchByTextService,
                private breakpointObserver: BreakpointObserver) {
        this.showProfileMenu = false;
        this.userImage = new Observable<string>();
        this.searchQuery = '';
        this.isMobileView = this.breakpointObserver.isMatched(Breakpoints.Handset);
        this.isMobileNavOpen = false;
        this.isMenuOpen = false;
        this.username = localStorage.getItem('username');
        this.isNotificationsOpened = new BehaviorSubject<boolean>(false);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.isMobileView = (event.target.innerWidth < 1000);
    }


    ngOnInit() {
        this.userImage = this.imageService.fetchUserImage();
    }

    openFilterDialog() {
        this.matDialogService.openFilterDialog();
        this.isMenuOpen = false;
    }

    toggleProfileMenu(event: MouseEvent): void {
        event.stopPropagation();
        this.showProfileMenu = !this.showProfileMenu;
    }

    searchPosts() {
        this.searchByTextService.searchByText(this.searchQuery);
    }

    closeDropDown() {
        this.showProfileMenu = false;
    }
    displayPostWindow(username: string | null) {
        if(username) {
            this.matDialogService.showPostsByUsername(username);
            this.isMenuOpen = false;
        }
    }
}
