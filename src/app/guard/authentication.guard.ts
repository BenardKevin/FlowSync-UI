import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication/authentication.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if(!authenticationService.isAuthenticated()) {
      router.navigateByUrl("/authentication");
      return false;
  }
  
  return true;

};
