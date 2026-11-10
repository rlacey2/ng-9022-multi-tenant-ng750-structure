import { Component, OnInit } from '@angular/core';
import { WorkspaceViewComponent } from '../../../shared/components/workspace-view/workspace-view';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.html',
  styleUrls: ['./cms.scss'],
    imports: [CommonModule, WorkspaceViewComponent],
})
export class CmsComponent implements OnInit {
  title = 'cms component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('CmsComponent initialized');
  }
}