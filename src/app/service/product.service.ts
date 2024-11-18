import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  products = [
    {
      id: 1,
      name: "Pomme",
      supplier: "Carrefour",
      price: "2.49€",
      vat: "20%",
      available: true
    },
    {
      id: 2,
      name: "Poire",
      supplier: "Lidl",
      price: "1.31€",
      vat: "20%",
      available: true
    },
    {
      id: 3,
      name: "Banane",
      supplier: "Carrefour",
      price: "0.99€",
      vat: "20%",
      available: true
    },
    {
      id: 4,
      name: "Asperge",
      supplier: "Auchan",
      price: "2.86€",
      vat: "20%",
      available: true
    },
    {
      id: 5,
      name: "Aubergine",
      supplier: "Intermarché",
      price: "4.21€",
      vat: "20%",
      available: false
    },
    {
      id: 6,
      name: "Carotte",
      supplier: "Aldi",
      price: "1.08€",
      vat: "20%",
      available: true
    },
    {
      id: 7,
      name: "Abricot",
      supplier: "E.Leclerc",
      price: "3.86€",
      vat: "20%",
      available: true
    },
    {
      id: 8,
      name: "Cassis",
      supplier: "Casino",
      price: "3.33€",
      vat: "20%",
      available: false
    },
    {
      id: 9,
      name: "Fraise",
      supplier: "Picard",
      price: "1.19€",
      vat: "20%",
      available: true
    },
    {
      id: 10,
      name: "Melon",
      supplier: "Netto",
      price: "4.60€",
      vat: "20%",
      available: true
    },
    {
      id: 11,
      name: "Brocoli",
      supplier: "Hyper U",
      price: "3.19€",
      vat: "20%",
      available: false
    },
    {
      id: 12,
      name: "Concombre",
      supplier: "Intermarché",
      price: "2.18€",
      vat: "20%",
      available: true
    }
  ];

  getProducts(): Observable<any> {
    return of(this.products);
  }
}
