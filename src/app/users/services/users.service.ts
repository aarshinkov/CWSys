import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  readonly url = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.url}/${id}`);
  }
}
