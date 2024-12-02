import { Routes } from '@angular/router';
import { ContactListViewComponent } from './component/list-view/contact/contact-list-view.component';
import { CalendarViewComponent } from './component/calendar-view/calendar-view.component';
import { ProductListViewComponent } from './component/list-view/product/product-list-view.component';
import { CardViewComponent } from './component/card-view/card-view.component';
<<<<<<< HEAD
import { UserSettingsComponent } from './component/user-settings/user-settings.component';
import { PageNotFoundComponent } from './component/error-page/page-not-found/page-not-found.component';
import { authenticationGuard } from './guard/authentication.guard';
import { AuthenticationComponent } from './component/authentication/authentication.component';
import { permissionGuard } from './guard/permission.guard';

export const routes: Routes = [
    { path: "", canActivate: [authenticationGuard], children: [
        { path: "user", component: UserSettingsComponent },
        { path: "contact", canActivate: [permissionGuard], children: [
            { path: "list-view", component: ContactListViewComponent }
        ]},
        { path: "product", canActivate: [permissionGuard], children: [
            { path: "list-view", component: ProductListViewComponent },
            { path: "card-view", component: CardViewComponent }
        ]},
        { path: "calendar-view", component: CalendarViewComponent }
    ]},
    { path: "", redirectTo: "/authentication", pathMatch: "full" },
    { path: "authentication", component: AuthenticationComponent },
    { path: "404", component: PageNotFoundComponent },
    { path: "**", redirectTo: "/404" }
=======
import { GridViewComponent } from './component/grid-view/grid-view.component';
import { FormViewComponent } from './component/form-view/form-view.component';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
    {
        path: "contact/list-view",
        component: ContactListViewComponent
    },
    {
        path: "product/list-view",
        component: ProductListViewComponent
    },
    {
        path: "product/**",
        component: GridViewComponent
    },
    {
        path: "product/form-view/:id",
        component: FormViewComponent
    },
    {
        path: "contact/form-view/:id",
        component: FormViewComponent
    },
    {
        path: "calendar-view",
        component: CalendarViewComponent
    },
    {
        path: "**",
        component: HomeComponent
    }
>>>>>>> 60902ef30475168438aef8d18998d3e1d86b81ce
];
