
import { Injectable } from '@angular/core';
import { MasterOrderRule } from '../models/diff-viewer.models';

// 20261108  21:09:00 - Define the positioning options for JSON object keys.
export type KeyOrderPosition = 'first' | 'default' | 'last';

// 20261108  21:09:00 - Define an exact key path or wildcard ordering rule.
/*
How to customise the wildcard
You can now change the behaviour without modifying the normaliser.
Configuration	Result
{ path: '*', position: 'first' }	All unlisted keys alphabetically first
{ path: '*', position: 'default' }	Unlisted keys alphabetically between first and last
{ path: '*', position: 'last' }	All unlisted keys alphabetically last
{ path: 'payment_meta.*', position: 'last' }	Unlisted payment properties last, overriding the global wildcard
*/
 

@Injectable({ providedIn: 'root' })
export class JsonNormalizer {

  /**
   * Deep-clones JSON-compatible data and orders object keys using
   * qualified master-order rules.
   *
   * Exact paths control individual properties.
   * '*' controls unlisted properties globally.
   * 'parent.*' overrides the global wildcard at that object level.
   *
   * Unlisted keys default to alphabetical ordering.
   * Array order and JSON values are retained.
   */
  /*
One boundary: This implementation handles JSON-compatible objects and values, as required by the event datasets. It does not attempt to preserve JavaScript-specific objects such as Map, Date or circular references.
  */
  public normalize<T>(
    value: T,
    masterOrder: readonly MasterOrderRule[] = []
  ): T {

    return this.cloneAndOrder(value, '', masterOrder) as T;
  }

  // 20261108  21:09:00 - Recursively deep-clone and order the current value.
  private cloneAndOrder(
    value: unknown,
    currentPath: string,
    masterOrder: readonly MasterOrderRule[]
  ): unknown {

    // 20261108  21:09:00 - Preserve array order while normalising each item.
    if (Array.isArray(value)) {
      return value.map(item =>
        this.cloneAndOrder(item, currentPath, masterOrder)
      );
    }

    // 20261108  21:09:00 - Return primitive values without modification.
    if (value === null || typeof value !== 'object') {
      return value;
    }

    const source = value as Record<string, unknown>;
    const keys = Object.keys(source);

    // 20261108  21:09:00 - Resolve the wildcard for this object level.
    // A local wildcard takes precedence over the global wildcard.
    const localWildcard = masterOrder.find(
      rule => rule.path === `${currentPath}.*`
    );

    const globalWildcard = masterOrder.find(
      rule => rule.path === '*'
    );

    const wildcardPosition: KeyOrderPosition =
      localWildcard?.position ??
      globalWildcard?.position ??
      'default';

    // 20261108  21:09:00 - Retrieve exact rules belonging to this level.
    const levelRules = masterOrder.filter(rule => {

      if (rule.path === '*' || rule.path.endsWith('.*')) {
        return false;
      }

      const parts = rule.path.split('.');
      const parentPath = parts.slice(0, -1).join('.');

      return parentPath === currentPath;
    });

    // 20261108  21:09:00 - Get explicitly positioned first-level keys.
    const firstKeys = [
      ...new Set(
        levelRules
          .filter(rule => rule.position === 'first')
          .map(rule => rule.path.split('.').at(-1)!)
      )
    ].filter(key => keys.includes(key));

    // 20261108  21:09:00 - Get explicitly positioned last-level keys.
    const lastKeys = [
      ...new Set(
        levelRules
          .filter(rule => rule.position === 'last')
          .map(rule => rule.path.split('.').at(-1)!)
      )
    ].filter(key =>
      keys.includes(key) &&
      !firstKeys.includes(key)
    );

    // 20261108  21:09:00 - Alphabetically sort all remaining keys.
    // This includes unlisted keys and explicitly configured default keys.
    const positionedKeys = new Set([
      ...firstKeys,
      ...lastKeys
    ]);

    const alphabeticalKeys = keys
      .filter(key => !positionedKeys.has(key))
      .sort((a, b) => a.localeCompare(b));

    // 20261108  21:09:00 - Assemble the final ordering using the wildcard position.
    let sortedKeys: string[];

    switch (wildcardPosition) {

      case 'first':
        sortedKeys = [
          ...alphabeticalKeys,
          ...firstKeys,
          ...lastKeys
        ];
        break;

      case 'last':
        sortedKeys = [
          ...firstKeys,
          ...lastKeys,
          ...alphabeticalKeys
        ];
        break;

      default:
        sortedKeys = [
          ...firstKeys,
          ...alphabeticalKeys,
          ...lastKeys
        ];
        break;
    }

    // 20261108  21:09:00 - Create a new object without modifying the source.
    // A null prototype also preserves an own property named "__proto__".
    const clone = Object.create(null) as Record<string, unknown>;

    for (const key of sortedKeys) {

      const childPath = currentPath
        ? `${currentPath}.${key}`
        : key;

      clone[key] = this.cloneAndOrder(
        source[key],
        childPath,
        masterOrder
      );
    }

    return clone;
  }
}
