import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../auth/models/user.model';
import { AuthenticationService } from '../auth/services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../users/services/users.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: User;

  infoForm: FormGroup;
  passwordForm: FormGroup;

  passwordSuccessMessage: string;
  passwordErrorMessage: string;

  destroy$ = new Subject<boolean>();

  constructor(private infoFb: FormBuilder,
    private passFb: FormBuilder,
    private usersService: UsersService,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getUser();
    this.buildInfoForm(this.user);
    this.buildPassForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getUser(): void {
    this.user = this.authService.getLoggedUser();
  }

  onInfoSubmit(): void {
    const formData = this.infoForm.value;

    this.user = this.authService.getLoggedUser();
    this.user.name = formData.name;
    this.user.surname = formData.surname;

    this.usersService.updateUser(this.user).subscribe(response => {
      let updatedUser: User = response;

      this.authService.setLoggedUser(updatedUser);
    });
  }

  onPassSubmit(): void {
    const formData = this.passwordForm.value;

    let user = this.authService.getLoggedUser();

    this.usersService.getUserById(user.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(response => {
      let storedPassword = response.password;
      console.log(storedPassword);
      console.log(formData.currentPassword);

      if (formData.currentPassword !== storedPassword) {
        this.passwordSuccessMessage = '';
        this.passwordErrorMessage = 'Wrong password';
        console.log("here");

        return;
      }
    });

    if (formData.newPassword !== formData.confirmPassword) {
      this.passwordSuccessMessage = '';
      this.passwordErrorMessage = 'Passwords do not match';

      this.resetPasswordForm();

      return;
    }

    //Valid input

    this.user = this.authService.getLoggedUser();
    this.user.password = formData.newPassword;
    console.log("changing") ;

    this.usersService.updateUser(this.user).pipe(
      takeUntil(this.destroy$)
    ).subscribe(response => {
      let updatedUser: User = response;

      this.authService.setLoggedUser(updatedUser);

      this.passwordSuccessMessage = 'Password changed successfully';
      this.passwordErrorMessage = '';

      this.resetPasswordForm();

      return;
    });
  }

  private resetPasswordForm(): void {
    this.passwordForm.reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }

  private buildInfoForm(user: User): void {
    this.infoForm = this.infoFb.group({
      name: [user.name, Validators.required],
      surname: [user.surname, Validators.required]
    });
  }

  private buildPassForm(): void {
    this.passwordForm = this.passFb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }
}
