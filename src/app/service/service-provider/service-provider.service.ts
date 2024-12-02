import { Injectable } from '@angular/core';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { ContactService } from '../contact/contact.service';

@Injectable({
  providedIn: 'root'
})

export class ServiceProviderService {

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private contactService: ContactService
  ) { }

  getProductService(): ProductService {
    return this.productService;
  }

  getOrderService(): OrderService {
    return this.orderService;
  }

  getContactService(): ContactService {
    return this.contactService;
  }
}
