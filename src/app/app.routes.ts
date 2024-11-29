import { Routes } from '@angular/router';
import { ContactListViewComponent } from './component/list-view/contact/contact-list-view.component';
import { CalendarViewComponent } from './component/calendar-view/calendar-view.component';
import { ProductListViewComponent } from './component/list-view/product/product-list-view.component';
import { CardViewComponent } from './component/card-view/card-view.component';
import { GridViewComponent } from './component/grid-view/grid-view.component';
import { FormViewComponent } from './component/form-view/form-view.component';

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
        redirectTo: "",
        pathMatch: "full"
    }
];
