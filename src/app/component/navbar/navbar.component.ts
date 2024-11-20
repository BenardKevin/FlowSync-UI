import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { NavItemService } from '../../service/nav-item.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NavItemComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {
  
  faBars = faBars;
  navItems: any;
  toggle: boolean = false;

  constructor(private navItemService: NavItemService) { }
  
  ngOnInit() {
    this.getNavItems();
  }

  getNavItems() {
    this.navItemService.getNavItems().subscribe(data => {
      this.navItems = data;
    });
  }

  onClick(event: any) {
    let target = event.currentTarget;
    let panel = target.nextElementSibling;

    this.toggle = !this.toggle;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
}
