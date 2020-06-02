import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from './course.model';
import { Subject } from 'rxjs';
import { CoursesService } from './services/courses.service';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {

  courses: Course[];

  hasAdminRole: boolean;

  destroy$ = new Subject<boolean>();

  constructor(private authService: AuthenticationService,
    private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.getCourses();
    this.authService.getHasAdminRole().subscribe(isAdmin => {
      this.hasAdminRole = isAdmin;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getCourses(): void {
    this.coursesService.getCourses().pipe(
      // map(response => response.filter(x => x.rating > 7)),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.courses = response;
    }, error => {
      console.log(error);
    });
  }

  trimDescription(description): string {
    if (description.length > 200) {
      return `${description.substr(0, 200)}...`;
    }

    return description;
  }

  onDelete(id: number): void {
    this.coursesService.deleteCourse(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.getCourses();
    });
  }
}
