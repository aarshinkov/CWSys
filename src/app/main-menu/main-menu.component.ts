import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  hasLoggedUser: boolean;
  hasAdminRole: boolean;

  constructor(private authService: AuthenticationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.authService.getHasLoggedIn().subscribe(isLogged => {
      this.hasLoggedUser = isLogged;
    });
    this.authService.getHasAdminRole().subscribe(isAdmin => {
      this.hasAdminRole = isAdmin;
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
