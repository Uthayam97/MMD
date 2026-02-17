import { Component, OnInit } from "@angular/core";
import { User } from "../../../../models/user.model";
import { UserService } from "../../../../services/user.service";

@Component({
  selector: "app-admin-registered-users",
  templateUrl: "./registered-users.component.html",
})
export class RegisteredUsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => (this.users = users));
  }
}
