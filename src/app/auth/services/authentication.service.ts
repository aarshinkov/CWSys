import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly url = 'http://localhost:3000/users';
  readonly loggedUserStorageKey = 'loggedUser';
  readonly isUserKey = "isUser";
  readonly isAdminKey = "isAdmin";

  hasLoggedIn$ = new BehaviorSubject<boolean>(false);
  hasAdminRole$ = new BehaviorSubject<boolean>(false);
  hasUserRole$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  login(email: string, password: string): Observable<User> {
    return this.getUsers().pipe(
      map((response: User[]) => response.find(user => user.email === email && user.password === password))
    );
  }

  register(user: User): Observable<User> {
    let roleUser: Role = new Role();
    roleUser.role = 'USER';

    // let roleAdmin: Role = new Role();
    // roleAdmin.role = 'ADMIN';

    let roles: Role[] = [roleUser];
    user.roles = roles;

    return this.http.post<User>(this.url, user);
  }

  logout(): void {
    localStorage.removeItem(this.loggedUserStorageKey);
    localStorage.removeItem(this.isAdminKey);
    localStorage.removeItem(this.isUserKey);

    this.setHasLoggedIn(false);
    this.setIsAdmin(false);
  }

  setLoggedUser(user: User): void {
    localStorage.setItem(this.loggedUserStorageKey, JSON.stringify(user));

    for (var i = 0; i < user.roles.length; i++) {
      if (user.roles[i].role == 'ADMIN') {
        localStorage.setItem(this.isAdminKey, "y");
        this.setIsAdmin(true);
      } else if (user.roles[i].role == 'USER') {
        localStorage.setItem(this.isUserKey, "y");
      }
    }

    this.setHasLoggedIn(true);
  }



  getLoggedUser(): User {
    return JSON.parse(localStorage.getItem(this.loggedUserStorageKey));
  }

  setHasLoggedIn(isLogged: boolean): void {
    this.hasLoggedIn$.next(isLogged);
  }

  getHasLoggedIn(): Observable<boolean> {
    if (this.getLoggedUser()) {
      return of(true);
    }

    return this.hasLoggedIn$.asObservable();
  }





  setIsAdmin(isAdmin: boolean): void {
    this.hasAdminRole$.next(isAdmin);
  }

  isAdmin(): boolean {
    if (localStorage.getItem(this.isAdminKey) === 'y') {
      return true;
    }

    return false;
  }

  getHasAdminRole(): Observable<boolean> {
    if (this.isAdmin()) {
      return of(true);
    }

    return this.hasAdminRole$.asObservable();
  }
}
