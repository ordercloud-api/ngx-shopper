import { Component, OnInit, Inject } from '@angular/core';
import { Category, OcCategoryService } from '@ordercloud/angular-sdk';
import { faSitemap, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import {
  AppConfig,
  applicationConfiguration,
} from '@app-seller/config/app.config';

@Component({
  selector: 'category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss'],
})
export class CategoryDetailsComponent implements OnInit {
  category: Category;
  categoryID: string;
  catalogID: string;
  faSitemap = faSitemap;
  faBoxOpen = faBoxOpen;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ocCategoryService: OcCategoryService,
    private router: Router,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.catalogID = this.appConfig.buyerID;
    this.getCategoryData().subscribe((x) => (this.category = x));
  }

  getCategoryData(): Observable<Category> {
    return this.activatedRoute.params.pipe(
      flatMap((params) => {
        if (params.categoryID) {
          this.categoryID = params.categoryID;
          return this.ocCategoryService.Get(this.catalogID, params.categoryID);
        }
      })
    );
  }

  updateCategory(category: Category): void {
    this.ocCategoryService
      .Patch(this.catalogID, this.categoryID, category)
      .subscribe((x) => {
        this.category = x;
        if (this.category.ID !== this.categoryID) {
          this.router.navigateByUrl(`/categories/${this.category.ID}`);
        }
      });
  }
}
