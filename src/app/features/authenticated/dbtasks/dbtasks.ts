import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dbtasks',
  templateUrl: './dbtasks.html',
  styleUrls: ['./dbtasks.scss']
})
export class DBtasksComponent implements OnInit {
  title = 'dbtasks component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('DbtasksComponent initialized');
  }
}