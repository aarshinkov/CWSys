import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './auth/services/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  hasLoggedUser: boolean;

  destroy$ = new Subject<boolean>();

  constructor(private authService: AuthenticationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.authService.getHasLoggedIn().pipe(
      takeUntil(this.destroy$)
    ).subscribe(response => this.hasLoggedUser = response);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
