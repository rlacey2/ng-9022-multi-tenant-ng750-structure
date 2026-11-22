// checked 20261122


import { inject, Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl,
} from '@angular/platform-browser';

export type SafeType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';
export type SafeResult = SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl;
/*
<!-- Old way (Angular 2 era) -->
<div [ngStyle]="myDynamicCSS | safe:'styleStrObj'"></div>

<!-- Angular 22 way (No pipe or NgStyle import required) -->
<div [style]="myDynamicCSS"></div>


If you migrate your templates to use [style]="myDynamicCSS", you can strip out the entire convertCSS2JS method and keep the pipe strictly for sanitization:

replacing this:

  private convertCSS2JS = (css:any) => { // https://greensock.com/forums/topic/14435-convert-css-string-to-object/
    // convert style string to object to use with ngStyle
    if (css === undefined || css === '') { return {}; }
    // console.log(css);
    let frameCSS:string = css.replace(/([\w-.]+)\s*:([^;]+);?/g, '$1:$2,');
    frameCSS = frameCSS.replace(/[, \t]+$/, ''); // .replace(/,+$/, ''); // remove trailing , and spaces at end
    const properties = frameCSS.split(', ');
    const frameCSSObj:any = {};
    properties.forEach(function (property:any) {
      const cssProp = property.split(':');
      const cssKey = cssProp[0]; // .toCamelCase();
      const cssValue = cssProp[1].trim();
      frameCSSObj[cssKey] = cssValue;
    });
    return frameCSSObj;
  }

*/


 
@Pipe({
   name: 'safe', // the part that goes " | safe" inline in html
})


export class SafePipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined, type: SafeType = 'html'): SafeResult {
    const safeValue = value ?? '';

    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(safeValue);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(safeValue);
 // replaced, see comments  case 'styleStrObj': return this.convertCSS2JS(value); // string of properties with ; separator to object for angular 2
  

      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(safeValue);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(safeValue);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(safeValue);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
