import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { map, takeUntil } from 'rxjs/operators';
import { User } from '../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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

  onSubmit(): void {
    // check for password mismatch
    const formData = this.form.value;

    if (!this.form.valid) { // <-----
      
      return;
    }

    if (formData.password !== formData.rePassword) {
      this.errorMessage = 'Passwords do not match.';

      // this.form.get('password').setValue('');
      // this.form.get('rePassword').setValue('');

      this.form.reset({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: '',
        rePassword: ''
      });

      return;
    }


    // getAllUsers -> check if email exists
    this.authService.getUsers().pipe(
      map((response: User[]) => response.find(user => user.email === formData.email)),
      takeUntil(this.destroy$)
    ).subscribe(userResponse => {
      if (userResponse) {
        this.errorMessage = 'Email has already been taken. Try with another one.';

        this.form.reset({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: '',
          rePassword: ''
        });

        return;
      }

      this.form.removeControl('rePassword');

      let user: User = this.form.value;
      user.status = 1;

      this.form.addControl('rePassword', new FormControl('', Validators.required));

      console.log("signing up");

      this.authService.register(user).pipe(
        takeUntil(this.destroy$)
      ).subscribe(response => {
        this.router.navigate(['login']);
      });
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      rePassword: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
}
