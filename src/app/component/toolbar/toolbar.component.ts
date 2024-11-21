import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faPlus, faCircleArrowUp, faCircleArrowDown, faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { UserPreferencesService } from '../../service/user-preferences.service';

@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})

export class ToolbarComponent {
  faPlus: IconDefinition = faPlus;
  faCircleArrowUp: IconDefinition = faCircleArrowUp;
  faCircleArrowDown: IconDefinition = faCircleArrowDown;
  faGrip: IconDefinition = faGrip;
  faList: IconDefinition = faList;

  listView!: boolean;

  constructor(private userPrefService: UserPreferencesService, private router: Router) { }

  getMainRoute() {
    return this.router.url.split('/')[1];
  }

  changeView() {
    const mainRoute = this.getMainRoute();
    if (mainRoute !== "product") return;

    this.listView = this.userPrefService.toggleView();
    const newViewType = this.listView ? 'card-view' : 'list-view';

    this.router.navigate([`/${mainRoute}/${newViewType}`]);

  }

  leftButtons = [
    { icon: this.faPlus, label: 'Create new object', class: 'object-creator', action: () => this.createObject() },
    { icon: this.faCircleArrowUp, label: 'Import', class: 'object-import', action: () => this.importObject() },
    { icon: this.faCircleArrowDown, label: 'Export', class: 'object-export', action: () => this.exportObject() }
  ];

  rightButtons = [
    { icon: this.faGrip, label: 'Display card view', condition: () => this.listView, action: () => this.changeView() },
    { icon: this.faList, label: 'Display list view',  condition: () => !this.listView, action: () => this.changeView() }
  ];

  createObject() {
    console.log('Create new object');
  }

  importObject() {
    console.log('Import object');
  }

  exportObject() {
    console.log('Export object');
  }
}
