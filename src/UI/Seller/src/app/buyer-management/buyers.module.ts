import { NgModule } from '@angular/core';
import { SharedModule } from '@app-seller/shared';

import { BuyerTableComponent } from '@app-seller/buyer-management/buyer-table/buyer-table.component';
import { BuyersRoutingModule } from '@app-seller/buyer-management/buyers-routing.module';

@NgModule({
  imports: [SharedModule, BuyersRoutingModule],
  declarations: [BuyerTableComponent],
})
export class BuyersModule {}
