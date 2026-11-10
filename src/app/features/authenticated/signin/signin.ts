import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.html',
  styleUrls: ['./signin.scss']
})
export class SignInComponent implements OnInit {
  title = 'signin component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('SignInComponent initialized');
  }
}