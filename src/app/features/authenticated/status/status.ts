import { Component, OnInit } from '@angular/core';
import { WorkspaceViewComponent } from '../../../shared/components/workspace-view/workspace-view';

@Component({
  selector: 'app-status',
  templateUrl: './status.html',
  styleUrls: ['./status.scss'],
  imports: [WorkspaceViewComponent]
})
export class StatusComponent implements OnInit {
  title = 'status component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('StatusComponent initialized');
  }
}