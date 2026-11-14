
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';



import {
  JsonNormalizer 
} from '../services/json-normalizer';
import { DiffSaveOption, MasterOrderRule } from '../models/diff-viewer.models';




export type JsonObject = Record<string, unknown>;

export interface DiffDialogData {
  left: JsonObject;
  right: JsonObject;
  leftLabel: string;
  rightLabel: string;
  masterOrder?: readonly MasterOrderRule[];
    saveOptions: DiffSaveOption;
}

export interface DiffDialogResult {
  saved: 'left' | 'right' | 'both';
  left?: Record<string, any>;
  right?: Record<string, any>;
}

type MonacoEditorDisposable = {
  dispose: () => void;
};

type MonacoSideEditor = {
  getValue: () => string;
  getModel: () => unknown;

  onDidChangeModelContent: (
    listener: () => void
  ) => MonacoEditorDisposable;
};

type MonacoDiffEditor = {
  getOriginalEditor: () => MonacoSideEditor;
  getModifiedEditor: () => MonacoSideEditor;

  setModel: (model: {
    original: unknown;
    modified: unknown;
  }) => void;

  layout: () => void;
  dispose: () => void;
};

type MonacoApi = {
  editor: {
    createDiffEditor: (
      element: HTMLElement,
      options: Record<string, unknown>
    ) => MonacoDiffEditor;

    createModel: (
      value: string,
      language: string
    ) => unknown;
  };
};

type MonacoLoaderWindow = Window & {
  monaco?: MonacoApi;

  require?: ((modules: string[], callback: () => void) => void) & {
    config: (options: {
      paths: Record<string, string>;
    }) => void;
  };
};

@Component({
  selector: 'app-diff-viewer-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './diff-viewer-dialog.html',
  styleUrl: './diff-viewer-dialog.scss'
})

export class DiffViewerDialog implements AfterViewInit, OnDestroy {

  @ViewChild('editorHost', { static: true })
  private editorHost!: ElementRef<HTMLDivElement>;

  private readonly dialogRef =
    inject(MatDialogRef<DiffViewerDialog, DiffDialogResult>);

  private readonly normalizer = inject(JsonNormalizer);

  readonly data = inject<DiffDialogData>(MAT_DIALOG_DATA);

  readonly loadError = signal('');
  readonly saveError = signal('');
  readonly ready = signal(false);

  private editor?: MonacoDiffEditor;

  private normalizedLeft!: JsonObject;
  private normalizedRight!: JsonObject;
  
public leftModelTypeChanged = false;
public rightModelTypeChanged = false;

public leftMetadata = signal<Record<string, any>>({});
public rightMetadata = signal<Record<string, any>>({});

public leftJsonValid = signal(true);
public rightJsonValid = signal(true);

public leftChangedFields = signal<Record<string, boolean>>({});
public rightChangedFields = signal<Record<string, boolean>>({});



// 20261108 23:30:00: Fields displayed in the event identification header.
public readonly identifyingFields: readonly string[] = [
  'model_type',
  'eventId',
  'cId'
];
 

  // 20261108  21:09:00 - Initialise both normalised objects before loading Monaco.
  ngAfterViewInit(): void {

    const masterOrder = this.data.masterOrder ?? [];

    this.normalizedLeft = this.normalizer.normalize(
      this.data.left,
      masterOrder
    );

    this.normalizedRight = this.normalizer.normalize(
      this.data.right,
      masterOrder
    );

    void this.initializeEditor();
  }

  // 20261108  21:09:00 - Dispose the Monaco editor when the dialog closes.
  ngOnDestroy(): void {
    this.editor?.dispose();
  }

  // 20261108  21:09:00 - Copy the requested side of the difference editor.
  async copySide(side: 'left' | 'right'): Promise<void> {

    const value = side === 'left'
      ? this.editor?.getOriginalEditor().getValue()
      : this.editor?.getModifiedEditor().getValue();

    if (value === undefined) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      this.saveError.set(
        'Clipboard access was unavailable. Select the editor contents and copy them manually.'
      );
    }
  }


public saveChanges(
  target: 'left' | 'right' | 'both'
): void {

  if (!this.editor) {
    return;
  }

  try {

    const result: DiffDialogResult = {
      saved: target
    };

    // 20261108 23:29:00: Normalise each selected side before returning it.
    if (target === 'left' || target === 'both') {

      const leftValue = JSON.parse(
        this.editor.getOriginalEditor().getValue()
      );

      result.left = this.normalizer.normalize(leftValue);
    }

    if (target === 'right' || target === 'both') {

      const rightValue = JSON.parse(
        this.editor.getModifiedEditor().getValue()
      );

      result.right = this.normalizer.normalize(rightValue);
    }

    this.dialogRef.close(result);

  } catch (error) {

    console.error('Unable to save invalid JSON:', error);

    // Keep the dialog open so the user can correct the JSON.
  }
}

  // 20261108  21:09:00 - Save both edited and normalised objects back to Alpha.
  save(): void {

    if (!this.editor) {
      return;
    }

    try {

      const left = JSON.parse(
        this.editor.getOriginalEditor().getValue()
      ) as JsonObject;

      const right = JSON.parse(
        this.editor.getModifiedEditor().getValue()
      ) as JsonObject;

      if (
        !this.isJsonObject(left) ||
        !this.isJsonObject(right)
      ) {
        this.saveError.set(
          'Both editor sides must contain a JSON object at the root.'
        );
        return;
      }

      const masterOrder = this.data.masterOrder ?? [];

      this.dialogRef.close({
        left: this.normalizer.normalize(left, masterOrder),
        right: this.normalizer.normalize(right, masterOrder)
      });

    } catch {
      this.saveError.set(
        'The JSON is not valid. Correct the syntax on both sides before saving.'
      );
    }
  }

  // 20261108  21:09:00 - Close without returning modified objects.
  cancel(): void {
    this.dialogRef.close();
  }

  // 20261108  21:09:00 - Validate that the root value is a JSON object.
  private isJsonObject(value: unknown): value is JsonObject {

    return value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value);
  }

  // 20261108  21:09:00 - Initialise Monaco difference editor.
  private async initializeEditor(): Promise<void> {

    try {

      const monaco = await this.loadMonaco();

      this.editor = monaco.editor.createDiffEditor(
        this.editorHost.nativeElement,
        {
          theme: 'vs-dark',
          automaticLayout: true,
          readOnly: false,
          originalEditable: true,
          renderSideBySide: true,
          enableSplitViewResizing: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          diffWordWrap: 'on',
          fontSize: 13
        }
      );

      this.editor.setModel({
        original: monaco.editor.createModel(
          JSON.stringify(this.normalizedLeft, null, 2),
          'json'
        ),

        modified: monaco.editor.createModel(
          JSON.stringify(this.normalizedRight, null, 2),
          'json'
        )
      });

this.editor.getOriginalEditor()
  .onDidChangeModelContent(() => {
    this.detectEditorChanges('left');
  });

this.editor.getModifiedEditor()
  .onDidChangeModelContent(() => {
    this.detectEditorChanges('right');
  });





      this.ready.set(true);

    } catch (error) {

      this.loadError.set(
        error instanceof Error
          ? error.message
          : 'Unable to load the Monaco editor from the CDN.'
      );
    }
  }

  // 20261108  21:09:00 - Dynamically load Monaco through the CDN AMD loader.
  private loadMonaco(): Promise<MonacoApi> {

    const win = window as MonacoLoaderWindow;

    if (win.monaco) {
      return Promise.resolve(win.monaco);
    }

    return new Promise<MonacoApi>((resolve, reject) => {

      const loaderUrl =
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.js';

      const configure = (): void => {

        const amdRequire = win.require;

        if (!amdRequire) {
          reject(
            new Error('Monaco AMD loader did not initialise. Check CDN access.')
          );
          return;
        }

        amdRequire.config({
          paths: {
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs'
          }
        });

        amdRequire(['vs/editor/editor.main'], () => {

          if (win.monaco) {
            resolve(win.monaco);
          } else {
            reject(
              new Error('Monaco loaded without exposing its editor API.')
            );
          }
        });
      };

      const existing =
        document.querySelector<HTMLScriptElement>(
          `script[src="${loaderUrl}"]`
        );

      if (existing) {

        if (win.require) {
          configure();
        } else {

          existing.addEventListener(
            'load',
            configure,
            { once: true }
          );

          existing.addEventListener(
            'error',
            () => reject(
              new Error('Could not download the Monaco loader.')
            ),
            { once: true }
          );
        }

        return;
      }

      const script = document.createElement('script');

      script.src = loaderUrl;
      script.async = true;
      script.onload = configure;

      script.onerror = () => reject(
        new Error('Could not download the Monaco loader.')
      );

      document.head.appendChild(script);
    });
  }

private detectEditorChanges(
  side: 'left' | 'right'
): void {

  const editor = side === 'left'
    ? this.editor!.getOriginalEditor()
    : this.editor!.getModifiedEditor();

  try {

    const currentValue = JSON.parse(editor.getValue());

    const originalValue = side === 'left'
      ? this.data.left
      : this.data.right;

    const metadata: Record<string, any> = {};
    const changedFields: Record<string, boolean> = {};

    for (const field of this.identifyingFields) {

      metadata[field] = currentValue?.[field] ?? null;

      changedFields[field] =
        currentValue?.[field] !== originalValue?.[field];

    }

    if (side === 'left') {

      this.leftMetadata.set(metadata);
      this.leftChangedFields.set(changedFields);
      this.leftJsonValid.set(true);

    } else {

      this.rightMetadata.set(metadata);
      this.rightChangedFields.set(changedFields);
      this.rightJsonValid.set(true);

    }

  } catch {

    if (side === 'left') {
      this.leftJsonValid.set(false);
    } else {
      this.rightJsonValid.set(false);
    }

  }
}

}
