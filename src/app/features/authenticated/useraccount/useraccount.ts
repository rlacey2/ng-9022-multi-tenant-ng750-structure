import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-useraccount',
  templateUrl: './useraccount.html',
  styleUrls: ['./useraccount.scss']
})
export class UserAccountComponent implements OnInit {
  title = 'useraccount component works!';

  constructor() { }
 
  ngOnInit(): void {
    console.log('UseraccountComponent initialized');
  }
}