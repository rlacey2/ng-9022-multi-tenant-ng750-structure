import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.html',
  styleUrls: ['./cms.scss']
})
export class CmsComponent implements OnInit {
  title = 'cms component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('CmsComponent initialized');
  }
}