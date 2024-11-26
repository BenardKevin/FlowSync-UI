import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  orders = [
    {
      id: 1,
      client: "Jeremy",
      date: "07-10-2024",
    },
    {
      id: 2,
      client: "Kevin",
      date: "08-11-2024",
    },
    {
      id: 3,
      client: "Marika",
      date: "09-12-2024",
    }
  ];

  getOrders(): Observable<any> {
    return of(this.orders);
  }
}
