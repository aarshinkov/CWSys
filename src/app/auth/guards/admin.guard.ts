import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private authService: AuthenticationService,
        private router: Router) {
    }

    canActivate(): boolean {
        if (!this.authService.isAdmin()) {
            this.router.navigate(['courses']);

            return false;
        }

        return true;
    }
}
