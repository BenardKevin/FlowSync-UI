import { Routes, UrlSegment } from '@angular/router';
import { ListViewComponent } from './component/list-view/list-view.component';

export const routes: Routes = [
    {
        matcher: (url) => {
            return url.length === 2 && url[1].path.endsWith("list-view") ? ({consumed: url}) : null;
        },
        component: ListViewComponent
    },
    {
        path: "**",
        redirectTo: "",
        pathMatch: "full"
    }
];
