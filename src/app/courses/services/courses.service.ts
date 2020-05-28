import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Course } from '../course.interface';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  readonly url = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.url);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.url}/${id}`);
  }
}
