import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { NonAuthenticatedGuard } from './auth/guards/non-authenticated.guard';

const routes: Routes = [
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonAuthenticatedGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [NonAuthenticatedGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
