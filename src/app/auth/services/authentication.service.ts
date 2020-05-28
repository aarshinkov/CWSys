import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly url = 'http://localhost:3000/users';
  readonly loggedUserStorageKey = 'loggedUser';

  private hasLoggedIn$ = new BehaviorSubject<boolean>(false);

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
    return this.http.post<User>(this.url, user);
  }

  logout(): void {
    localStorage.removeItem(this.loggedUserStorageKey);
  }

  setLoggedUser(user: User): void {
    localStorage.setItem(this.loggedUserStorageKey, JSON.stringify(user));

    this.setHasLoggedIn(true);
  }

  getLoggedUser(): User {
    return JSON.parse(localStorage.getItem(this.loggedUserStorageKey));
  }

  setHasLoggedIn(isLogged: boolean): void {
    this.hasLoggedIn$.next(isLogged);
  }

  getHasLoggedIn(): Observable<boolean> {
    return this.hasLoggedIn$.asObservable();
  }
}
