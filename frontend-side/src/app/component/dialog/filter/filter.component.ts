import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
    pageSize!: string;
    sortBy!: string;

    constructor(private matDialogRef: MatDialogRef<FilterComponent>, private route: ActivatedRoute, private router: Router) {
        this.route.queryParams.subscribe(params => {
            this.pageSize = params['pageSize'] || '15';
            this.sortBy = params['sortBy'] || 'newest';
        });
    }

    closeDialog() {
        const postCountSelect = document.getElementById('post-count') as HTMLSelectElement;
        const sortBySelect = document.getElementById('sort-by') as HTMLSelectElement;

        const pageSize = postCountSelect.value;
        const sortByValue = sortBySelect.value;
        this.router.navigate([], {queryParams: {pageSize: pageSize, sortBy: sortByValue}, queryParamsHandling: 'merge'});
        this.matDialogRef.close();
    }
}
