import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signincheckin',
  templateUrl: './signincheckin.html',
  styleUrls: ['./signincheckin.scss']
})
export class SignInCheckInComponent implements OnInit {
  title = 'signincheckin component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('SignInCheckInComponent initialized');
  }
}