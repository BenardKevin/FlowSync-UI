import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '../service/authentication/authentication.service';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective {
  private roles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticationService
  ) {}

  @Input() set hasRole(roles: string[]) {
    this.roles = roles;
    this.updateView();
  }

  private updateView() {
    const userRoles = this.authenticationService.getUserRoles(); // Assume this method returns an array of roles
    const hasRole = this.roles.some(role => userRoles.includes(role));

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}