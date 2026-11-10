import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.html',
  styleUrls: ['./tests.scss']
})
export class TestsComponent implements OnInit {
  title = 'tests component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('TestsComponent initialized');
  }
}