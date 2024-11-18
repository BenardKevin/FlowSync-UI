import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faCircleArrowUp, faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';

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

  constructor(private router: Router) {
    
  }
}
