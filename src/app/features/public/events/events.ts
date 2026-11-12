import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceViewComponent } from '../../../shared/components/workspace-view/workspace-view';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, WorkspaceViewComponent],
  templateUrl: './events.html',
  styleUrl: './events.scss'
})
export class EventsComponent {}
 