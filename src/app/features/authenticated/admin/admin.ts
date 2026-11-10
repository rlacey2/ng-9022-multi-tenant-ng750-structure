import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {
  title = 'admin component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('AdminComponent initialized');
  }
}