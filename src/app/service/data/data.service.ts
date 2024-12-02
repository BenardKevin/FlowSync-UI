import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../product/product.service';
import { ContactService } from '../contact/contact.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private productService: ProductService,
    private contactService: ContactService
  ) {}

  createData(route: string, data: any): Observable<any> {
    switch (route) {
      case 'product':
        return this.productService.createProduct({
          name: data.name,
          price: data.price,
          vat: data.vat,
          categoryId: data.categoryId,
          supplierId: data.supplierId
        });
      case 'contact':
        return this.contactService.createContact({
          id: data.id,
          name: data.name,
          firstname: data.firstname,
          email: data.email,
          address: data.address
        });
      default:
        throw new Error(`Import not supported for route: ${route}`);
    }
  }

  getData(route: string): Observable<any[]> {
    switch (route) {
      case 'product':
        return this.productService.getProducts();
      case 'contact':
        return this.contactService.getContacts();
      default:
        throw new Error(`Export not supported for route: ${route}`);
    }
  }

  formatExportData(route: string, data: any[]): any[] {
    switch (route) {
      case 'product':
        return data.map(product => ({
          name: product.name,
          price: product.price,
          vat: product.vat,
          categoryName: product.category?.name,
          categoryId: product.category?.id,
          supplierCompanyName: product.supplier?.companyName,
          supplierId: product.supplier?.id
        }));
      case 'contact':
        return data.map(contact => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          address: contact.address
        }));
      default:
        throw new Error(`Formatting not supported for route: ${route}`);
    }
  }
}
