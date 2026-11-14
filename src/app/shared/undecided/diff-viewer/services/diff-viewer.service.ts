import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import {
  DiffViewerDialog,
  DiffDialogData,
  DiffDialogResult
} from '../dialog/diff-viewer-dialog';
import { DiffSaveOption, DiffViewerConfig, MasterOrderRule } from '../models/diff-viewer.models';

 
 

 
@Injectable({
  providedIn: 'root'
})
export class DiffViewerService {

  private readonly dialog = inject(MatDialog);

  /**
   * Opens the JSON diff viewer.
   *
   * The calling component supplies the two objects and receives
   * the selected save result when the dialog closes.
   */
 
public openDifference(
  left: Record<string, any>,
  right: Record<string, any>,
  config: DiffViewerConfig = {}
): Observable<DiffDialogResult | undefined> {

  const dialogRef = this.dialog.open<
    DiffViewerDialog,
    DiffDialogData,
    DiffDialogResult
  >(DiffViewerDialog, {

    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh',

    panelClass: 'full-screen-dialog',

    data: {
      left,
      right,

      leftLabel: 'Base event',
      rightLabel:  'Current event',

      masterOrder: config.masterOrder ?? [],
      saveOptions: config.saveOptions ?? 'all'
    }

  });

  return dialogRef.afterClosed();
}


}