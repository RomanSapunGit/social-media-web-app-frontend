import {Directive, ElementRef, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private _elementRef: ElementRef) { }

  @Output()
  public appClickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement) : void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    const clickedOnDialog = this.elementIsInMatDialog(targetElement);

    if (!clickedInside && !clickedOnDialog) {
      this.appClickOutside.emit(event);
    }
  }

  private elementIsInMatDialog(element: HTMLElement): boolean {
    let parent: HTMLElement | null = element;
    while (parent) {
      if (parent.classList.contains('cdk-overlay-pane')) {
        return true;
      } else if(parent.classList.contains('confirmation-dialog')) {
        return true;
      }
      parent = parent.parentElement ? parent.parentElement : null;
    }
    return false;
  }
}
