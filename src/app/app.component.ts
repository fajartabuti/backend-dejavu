import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthenticationService } from './auth/auth.service';
import { User } from './shared/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  currentUser: User;
  opened = true;
  options: any;

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.options = {
      top: 55
    };
  }

  ngOnInit() {
    if (window.innerWidth < 767) {
      this.opened = false;
    } else {
      this.opened = true;
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 767) {
      this.opened = false;
    } else {
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 767) {
      return true;
    } else {
      return false;
    }
  }
}