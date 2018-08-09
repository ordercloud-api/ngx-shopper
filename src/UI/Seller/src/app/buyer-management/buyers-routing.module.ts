// core services
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerTableComponent } from '@app-seller/buyer-management/buyer-table/buyer-table.component';

const routes: Routes = [
  { path: '', component: BuyerTableComponent },
  //{ path: ':productID', component: ProductDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyersRoutingModule {}
