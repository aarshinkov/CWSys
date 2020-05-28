import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from './course.interface';
import { Subject } from 'rxjs';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {

  courses: Course[];

  destroy$ = new Subject<boolean>();

  constructor(private coursesService: CoursesService,) { }

  ngOnInit(): void {
    this.getCourses();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getCourses(): void {
    this.coursesService.getCourses().pipe(
      // map(response => response.filter(x => x.rating > 7)),
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
}
