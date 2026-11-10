// src/app/fallback-img.directive.ts
import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: 'img[appFallbackImg]',
  standalone: true
})
export class FallbackImgDirective {
  // Allow passing a specific custom fallback per image, or default to a safe standard asset
  @Input() appFallbackImg = 'assets/default-logo-small.svg';

  constructor(private el: ElementRef<HTMLImageElement>) {}

  // Intercept the browser's native DOM image loading failure event
  @HostListener('error')
  onError() {
    const element = this.el.nativeElement;
    
    // Prevent infinite loops if the fallback asset itself is missing
    if (element.src !== this.appFallbackImg) {
      element.src = this.appFallbackImg;
      
      // If inside a <picture> tag, update the parent <source> dependencies too
      const picture = element.closest('picture');
      if (picture) {
        picture.querySelectorAll('source').forEach(source => source.srcset = this.appFallbackImg);
      }
    }
  }
}
