import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  errorMessage: string;

  destroy$ = new Subject<boolean>();

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    this.errorMessage = null;

    const email = this.form.controls.email.value;
    const password = this.form.get('password').value;

    console.log(email);
    console.log(password);

    this.authService.login(email, password).pipe(
      takeUntil(this.destroy$)
    ).subscribe(response => {
      if (!response) {
        this.errorMessage = 'Invalid email or password.';

        return;
      }

      // store logged user
      this.authService.setLoggedUser(response);

      // redirect to main app
      this.router.navigate(['courses']);
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
}
