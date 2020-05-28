import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class NonAuthenticatedGuard implements CanActivate {

    constructor(private authService: AuthenticationService,
        private router: Router) {
    }

    canActivate(): boolean {
        const user = this.authService.getLoggedUser();
        if (user) {
            this.router.navigate(['courses']);

            return false;
        }

        return true;
    }
}
