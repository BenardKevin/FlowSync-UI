import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faCircleArrowUp, faCircleArrowDown, faGrip, faList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})

export class ToolbarComponent {
  faPlus = faPlus;
  faCircleArrowUp = faCircleArrowUp;
  faCircleArrowDown = faCircleArrowDown;
  faGrip = faGrip;
  faList = faList;

  listView = true;
  show = true;

  constructor(private router: Router) {
    
  }

  changeView() {
    this.listView = !this.listView;
    
    if(this.router.url.includes("list-view")) {
      this.router.navigateByUrl('/product/card-view');
    } else {
      this.router.navigateByUrl('/product/list-view');
    }
  }
}
