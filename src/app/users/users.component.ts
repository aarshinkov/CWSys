import { Component, OnInit } from '@angular/core';
import { User } from '../auth/models/user.model';
import { UsersService } from './services/users.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];

  destroy$ = new Subject<boolean>();

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(): void {
    this.usersService.getUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.users = response;
    }, error => {
      console.log(error);
    });
  }

  onBlock(id: number): void {
    
  }

  onDelete(id: number): void {
    this.usersService.deleteUser(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.getUsers();
    });
  }
}
