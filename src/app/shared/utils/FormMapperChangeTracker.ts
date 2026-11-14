import { signal, WritableSignal } from '@angular/core';


/*
Remove @Injectable(), since this class manages its own state via nested new operators and shouldn't
 be managed as a global singleton service.
*/


export class FormMapperChangeTracker {
  private readonly changes: Set<string>;
  private readonly prefix: string;
  private readonly revisionSignal: WritableSignal<number>;

  constructor(
    changes?: Set<string>,
    prefix = '',
    revisionSignal?: WritableSignal<number>
  ) { 
    this.changes = changes ?? new Set<string>();
    this.prefix = prefix;
    this.revisionSignal = revisionSignal ?? signal(0);
  }

  public forChild(key: string): FormMapperChangeTracker {
    return new FormMapperChangeTracker(this.changes, this.joinPath(this.prefix, key), this.revisionSignal);
  }

  public forArrayItem(key: string, index: number): FormMapperChangeTracker {
    return this.forChild(`${key}.${index}`);
  }

  public mark(path = ''): void {
    const changed = this.joinPath(this.prefix, path);
    if (!this.changes.has(changed)) {
      this.changes.add(changed);
      this.revisionSignal.update(version => version + 1);
    }
  }

  public markAll(path = ''): void {
    this.mark(path);
  }

  public getChangedPaths(): string[] {
    return [...this.changes];
  }

  public get hasChanges(): boolean {
    return this.changes.size > 0;
  }

  public get version(): number {
    return this.revisionSignal();
  }

  public clear(): void {
    if (this.changes.size) {
      this.changes.clear();
      this.revisionSignal.update(version => version + 1);
    }
  }

  private joinPath(parent: string, child: string): string {
    if (!parent) return child;
    if (!child) return parent;
    return `${parent}.${child}`;
  }
}
