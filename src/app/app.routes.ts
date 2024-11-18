import { Routes, UrlSegment } from '@angular/router';
import { ListViewComponent } from './component/list-view/list-view.component';
import { CardViewComponent } from './component/card-view/card-view.component';
import { CalendarViewComponent } from './component/calendar-view/calendar-view.component';

export const routes: Routes = [
    {
        matcher: (url) => {
            return url.length === 2 && url[1].path.endsWith("list-view") ? ({consumed: url}) : null;
        },
        component: ListViewComponent
    },
    {
        matcher: (url) => {
            return url.length === 2 && url[1].path.endsWith("card-view") ? ({consumed: url}) : null;
        },
        component: CardViewComponent
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
