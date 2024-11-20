import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { ContactService } from './contact.service';
import { Contact } from '../model/contact';
import { Observable } from 'rxjs';

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
