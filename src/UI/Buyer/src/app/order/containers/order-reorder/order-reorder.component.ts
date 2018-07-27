import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService, OcLineItemService, OcReorderService } from '@app-buyer/shared';
import {orderReorderResponse} from '@app-buyer/shared/services/oc-reorder/oc-reorder.interface';
import {forEach as _forEach } from 'lodash';


@Component({
  selector: 'order-reorder',
  templateUrl: './order-reorder.component.html',
  styleUrls: ['./order-reorder.component.scss']
})

export class OrderReorderComponent implements OnInit {
  @Input() orderID: string;
  reorderResponse$: Observable<orderReorderResponse>;
  modalID = 'Order-Reorder';
  alive = true;

  constructor(
    private ocReorderService: OcReorderService,
    private modalService: ModalService,
    private ocLineItemService: OcLineItemService,
  ) { 
    
  }

  ngOnInit() {
     this.reorderResponse$ = this.ocReorderService.order( this.orderID );
  }

  protected orderReorder(){
    this.modalService.open(this.modalID);
  }
  addToCart(){
    this.reorderResponse$
      .subscribe(reorderResponse => {
        _forEach( reorderResponse.ValidLi, li =>{
          this.ocLineItemService.create(li.Product, li.Quantity).subscribe();
        });
        this.modalService.close(this.modalID);
    })
    
  }

}

