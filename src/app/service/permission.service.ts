import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private authenticationService: AuthenticationService) { }

  /*
  hasPermission(component): Observable<boolean> {
    return this.authenticationService.isAuthenticated().map(res => {
        // Get permissions from user object.
        this.permissions = this.getPermissions();
        // Check if user object has permissions to access the current component.
        return this.checkPermission(component.data.permission);
    });
  }*/
}
