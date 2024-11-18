import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faCaretRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'nav-item',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, CommonModule],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss'
})

export class NavItemComponent {
  caret = faCaretRight;
  chevron = faChevronRight;
  active = false;

  @Input() label: any;
  @Input() link: any;
  @Input() icon: any;
  @Input() child: any;

  onClick(event: any) {
    let target = event.currentTarget;
    let panel = target.nextElementSibling;

    this.active = !this.active;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
}
