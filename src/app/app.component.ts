import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { ListViewComponent } from './component/list-view/list-view.component';
import { CardViewComponent } from './component/card-view/card-view.component';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToolbarComponent, ListViewComponent, CardViewComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'flowsync_ui';

  logIcon = faRightToBracket;
}
