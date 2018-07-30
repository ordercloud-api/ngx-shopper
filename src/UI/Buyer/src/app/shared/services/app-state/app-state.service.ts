import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MeUser, Order, ListLineItem } from '@ordercloud/angular-sdk';

@Injectable()
export class AppStateService {
  // Documentation on BehaviorSubject http://reactivex.io/rxjs/manual/overview.html#behaviorsubject
  public userSubject: BehaviorSubject<MeUser>;
  public orderSubject: BehaviorSubject<Order>;
  public isAnonSubject: BehaviorSubject<boolean>;
  public lineItemSubject: BehaviorSubject<ListLineItem>;

  constructor() {
    this.userSubject = new BehaviorSubject<MeUser>(null);
    this.orderSubject = new BehaviorSubject<Order>(null);
    this.isAnonSubject = new BehaviorSubject<boolean>(true);
    this.lineItemSubject = new BehaviorSubject<ListLineItem>({
      Meta: { Page: 1, PageSize: 25, TotalCount: 0, TotalPages: 1 },
      Items: [],
    });
  }
}
