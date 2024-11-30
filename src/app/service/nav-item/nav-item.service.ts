import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { faCartShopping, faCoins, faMessage, faCalendar, faGears, faUser } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NavItemService {

  constructor(private http: HttpClient) { }

  navItems = [
    {
      name: "Contact",
      icon: faUser,
      link: "/contact/list-view",
      child: []
    },
    {
      name: "Purchase",
      icon: faCartShopping,
      child: [
        {
          name: "Product",
          link: "product/list-view",
          child: []
        },
        {
          name: "Order",
          link: "order/list-view",
          child: []
        },
        {
          name: "Invoice",
          link: "invoice/list-view",
          child: []
        }
      ]
     },
     {
      name: "Sale",
      icon: faCoins,
      child: [
        {
          name: "Product",
          link: "product/list-view",
          child: []
        },
        {
          name: "Order",
          link: "order/list-view",
          child: []
        },
        {
          name: "Invoice",
          link: "invoice/list-view",
          child: []
        }
      ]
     },
     {
      name: "Calendar",
      link: "/calendar-view",
      icon: faCalendar,
      child: []
     },
     {
      name: "Messaging",
      link: "/",
      icon: faMessage,
      child: []
     },
     {
      name: "Administration",
      link: "/",
      icon: faGears,
      child: []
     }
  ];

  getNavItems(): Observable<any> {
    return of(this.navItems);
    
  }
}
