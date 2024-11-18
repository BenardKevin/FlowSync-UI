import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'flowsync_ui';

  logIcon = faRightToBracket;
}
