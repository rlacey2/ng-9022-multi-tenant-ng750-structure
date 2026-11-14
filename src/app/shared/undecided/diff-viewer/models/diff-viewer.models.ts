export type KeyOrderPosition = 'first' | 'default' | 'last'; // for key order in the diff

export type DiffSaveOption =
  | 'none'
  | 'both'
  | 'left'
  | 'right'
  | 'all';



export interface MasterOrderRule {
  path: string;
  position: KeyOrderPosition;
}

export interface DiffViewerConfig {
  saveOptions?: DiffSaveOption;
  masterOrder?: readonly MasterOrderRule[];
}

export interface DiffDialogData {
  left: Record<string, any>;
  right: Record<string, any>;

  leftLabel: string;
  rightLabel: string;

  masterOrder?: readonly MasterOrderRule[];
}

export interface DiffDialogResult {
  saved: 'left' | 'right' | 'both';

  left?: Record<string, any>;
  right?: Record<string, any>;
}