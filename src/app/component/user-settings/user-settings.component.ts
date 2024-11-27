import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser,faBuilding, faLocationDot, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

  faUser: IconDefinition = faUser;
  faBuilding: IconDefinition = faBuilding;
  faLocationDot: IconDefinition = faLocationDot;

}
