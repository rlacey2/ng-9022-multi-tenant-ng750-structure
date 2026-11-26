import { Component, inject, OnInit } from '@angular/core';
import { WorkspaceViewComponent } from '../../../shared/components/workspace-view/workspace-view';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.html',
  styleUrls: ['./status.scss'],
  imports: [WorkspaceViewComponent],
  
})

export class StatusComponent implements OnInit {
  title = 'status component works!';

    private toastService = inject(ToastService);
    
  constructor() { }

  ngOnInit(): void {
    console.log('StatusComponent initialized');
  }


  testToast(choice: string, styleType: 'success' | 'danger' | 'warning' | 'info' ): void {
    
    // Demonstration mapping showing how we leverage the generic config engine profiles
    if (styleType === 'danger') {
      this.toastService.show({
        header: 'Security Warning',
        body: `Critical: Access restriction enforcement occurred while checking path channel: ${choice}`,
        type: 'danger',
        duration: 7000 // Keep warning open longer for full legibility
      });
    } else if (styleType === 'warning') {
      this.toastService.show({
        header: 'System Sync In-Progress',
        body: `The configuration profile for target segment [${choice}] is currently updating. Please stand by.`,
        type: 'warning',
        duration: 14000
      });
    } else {
      // Standard simplified call syntax using internal default headers
      this.toastService.show({
        body: `Successfully mapped workspace context onto path option: ${choice}`,
        type: styleType
      });
    }

 
  }



}




