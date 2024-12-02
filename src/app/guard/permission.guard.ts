import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../service/permission.service';
import { inject } from '@angular/core';

export const permissionGuard: CanActivateFn = (route, state) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  return true; //permissionService.hasPermission(route);
};
