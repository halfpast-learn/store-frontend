import { Injectable } from '@angular/core';
import { Item } from '../entities/item';
import { Order } from '../entities/order';
import { ApiService } from './api.api-service';
import { AuthService } from './auth.service';

export interface CartWrapper {
  item: Item,
  amount: number,
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  currentItems: CartWrapper[] = [];
  constructor(private authService: AuthService, private apiservice: ApiService) { }

  addItem(item: Item): void {
    if (this.currentItems.findIndex(x => x.item.item_id == item.item_id) == -1) {
      this.currentItems.push({ item: item, amount: 1 });
    }
    else {
      this.currentItems.filter(x => x.item.item_id == item.item_id)[0].amount += 1;
    }
  }

  removeItem(item: Item): void {
    this.currentItems.filter(x => x.item.item_id == item.item_id)[0].amount -= 1;
    if (
      this.currentItems
        .filter(x => x.item.item_id == item.item_id)[0]
        .amount == 0
    ) {
      this.currentItems =
        this.currentItems.filter(x => x.item.item_id != item.item_id);
    }
  }

  createOrder(comment: string = ""): void {
    if (this.authService.getCurrentUser() == null || this.authService.getCurrentUser() == undefined) {
      alert("Войдите или зарегистрируйтесь!");
      return;
    }
    let order: Order = new Order;
    order.status = "created";
    order.user_owner = this.authService.getCurrentUser().user_id!;
    let orderItems: Item[] = [];
    for (let wrapper of this.currentItems) {
      let i=0;
      while (i<wrapper.amount) {
        orderItems.push(wrapper.item);
        i+=1;
      }
    }
    order.items = orderItems;
    order.comment = comment;

    this.apiservice.createOrder(order);
    alert("Заказ создан!");
  }
  getItems(): CartWrapper[] {
    return this.currentItems;
  }
}
