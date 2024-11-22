import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolbarVisibilityService {
  private routeCategories: string[] = ['product', 'order', 'invoice'];
  private routeViewTypes: string[] = ['card-view', 'list-view'];
  private allowedRoutes: string[] = [];
  private showToolbarSubject = new BehaviorSubject<boolean>(false);

  showToolbar$ = this.showToolbarSubject.asObservable();

  

  constructor(private router: Router) {
    this.allowedRoutes = this.generateAllowedRoutes(this.routeCategories, this.routeViewTypes);

    this.router.events.subscribe(event => {
      
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        const shouldShow = this.allowedRoutes.includes(currentRoute);

        this.showToolbarSubject.next(shouldShow);
      }
    });
  }

  getRouteCategories() {
    return this.routeCategories;
  }

  private generateAllowedRoutes(routeCategories: string[], routeViewTypes: string[]): string[] {
    const routes: string[] = [];

    routeCategories.forEach(routeCategorie => {
      routeViewTypes.forEach(routeViewType => {
        routes.push(`/${routeCategorie}/${routeViewType}`);
      });
    });

    return routes;
  }
}
