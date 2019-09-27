import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  name: String = '';
  email: String = '';
  busy: Promise<any>;
  esperando: Boolean;

  constructor(private router: Router, private authDataServise: AuthService) {}

  ngOnInit() {
    this.name = '';
    this.email = '';
    this.esperando = false;
  }

  registrar() {
    if ( !this.esperando ) {
      this.esperando = true;
      this.busy = this.authDataServise.register(this.name, this.email).then( r => {
        this.esperando = false;
        Swal.fire({
          title: 'Te damos la bienvenida',
          text: 'Enviamos tu contraseña a tu correo',
          type: 'success',
        })
        .then( response => {
          this.name = '';
          this.email = '';
          this.router.navigate(['/login']);
        });
      }).catch( e => {
        this.esperando = false;
        console.log(e);
      });
    }
  }
}
