import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.html',
  styleUrls: ['./status.scss']
})
export class StatusComponent implements OnInit {
  title = 'status component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('StatusComponent initialized');
  }
}