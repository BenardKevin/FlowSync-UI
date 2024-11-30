import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';

import { faRightToBracket, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ToolbarVisibilityService } from './service/toolbar-visibility/toolbar-visibility.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToolbarComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title: string = 'flowsync_ui';
  logIcon: IconDefinition = faRightToBracket;
  showToolbar: boolean = false;

  constructor(private toolbarVisibilityService: ToolbarVisibilityService) {}

  ngOnInit(): void {
    this.toolbarVisibilityService.showToolbar$.subscribe(visibility => {
      this.showToolbar = visibility;
    });
  }
}
