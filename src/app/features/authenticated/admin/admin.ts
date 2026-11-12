import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkspaceViewComponent } from '../../../shared/components/workspace-view/workspace-view';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
   imports: [CommonModule, WorkspaceViewComponent],
})
export class AdminComponent implements OnInit {
  title = 'admin component works!';

  constructor() { }

  ngOnInit(): void {
    console.log('AdminComponent initialized');
  }
}