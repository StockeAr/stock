import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/user.interface';
import { UsersService } from 'src/app/service/admin/users.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  variable:UserData[];
  constructor(private userSVC: UsersService) {
  }

  ngOnInit(): void {
    //this.userSVC.getAll().subscribe((res) => console.log('User: ', res));
    this.userSVC.getAll().subscribe((res) => this.variable=res);
  }

}
