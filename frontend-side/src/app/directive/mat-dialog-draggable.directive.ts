import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import {fromEvent, Subscription, takeUntil} from "rxjs";
import {MatDialogContainer, MatDialogRef} from "@angular/material/dialog";
import {Position} from "../model/position.model";
@Directive({
  selector: '[appDraggableDirective]'
})
export class MatDialogDraggableDirective {
  private _subscription: Subscription | undefined;
  private _element: HTMLElement | undefined;

  mouseStart: Position;

  mouseDelta: Position;

  offset: Position;

  constructor(
    private matDialogRef: MatDialogRef<any>,
    private container: MatDialogContainer,
    private renderer: Renderer2) {
    this._subscription = undefined;
    this.mouseStart = { x: 0, y: 0 };
    this.mouseDelta = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };
    this._element = this.container['_elementRef'].nativeElement;
  }

  ngOnInit() {
    this.offset = this._getOffset();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.mouseStart = { x: event.pageX, y: event.pageY };

    const mouseup$ = fromEvent(document, 'mouseup');
    this._subscription = mouseup$.subscribe(() => {
      this.onMouseUp();
    });

    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
        takeUntil(mouseup$)
    );
    this._subscription.add(mousemove$.subscribe((e: MouseEvent) => {
      this.onMouseMove(e);
    }));

    this.renderer.setStyle(this._element, 'user-select', 'none');
  }

  onMouseMove(event: MouseEvent) {
    this.mouseDelta = {x: (event.pageX - this.mouseStart.x), y: (event.pageY - this.mouseStart.y)};

    this._updatePosition(this.offset.y + this.mouseDelta.y, this.offset.x + this.mouseDelta.x);
  }

  onMouseUp() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }

    if (this.mouseDelta) {
      this.offset.x += this.mouseDelta.x;
      this.offset.y += this.mouseDelta.y;
    }
  }

  private _updatePosition(top: number, left: number) {
    this.matDialogRef.updatePosition({
      top: top + 'px',
      left: left + 'px'
    });
  }

  private _getOffset(): Position {
    const box = this.container['_elementRef'].nativeElement.getBoundingClientRect();
    return {
      x: box.left + pageXOffset,
      y: box.top + pageYOffset
    };
  }
}




