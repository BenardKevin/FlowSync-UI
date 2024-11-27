import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';

import { faRightToBracket, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ToolbarVisibilityService } from './service/toolbar-visibility.service';
import { filter } from 'rxjs';
import { AuthenticationService } from './service/authentication.service';

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
  is404: boolean = false;

  constructor(
    private toolbarVisibilityService: ToolbarVisibilityService,
    private router: Router,
    private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentUrl = this.router.url;

        if (currentUrl == '/404' || !this.authenticationService.isAuthenticated()) {
          this.is404 = true;
        } else {
          this.is404 = false;
        }
      });

    this.toolbarVisibilityService.showToolbar$.subscribe(visibility => {
      this.showToolbar = visibility;
    });
  }

  logout() {
    this.authenticationService.logout();
  }
}
