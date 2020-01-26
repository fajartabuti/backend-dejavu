import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  opened = true;
  options: any;

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  
  constructor() {
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