import { Component, ElementRef, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  template: `
    <dialog
      #dialogRef
      [class]="visible() ? 'opacity-100 backdrop:bg-black/60' : 'opacity-0 backdrop:bg-black/0'"
      (click)="onBackdropClick($event)"
      // after the dialog is closed, emit the closed event
      (close)="closed.emit()"
      // when the cancel event is triggered, prevent the default behavior and close the dialog
      (cancel)="onCancel($event)"
      class="m-auto bg-transparent p-0 transition-opacity duration-200 ease-out backdrop:transition-colors backdrop:duration-200 backdrop:ease-out"
    >
      <ng-content></ng-content>
    </dialog>
  `,
})
export class Modal {
  private dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialogRef');
  visible = signal(false);
  closed = output<void>();

  open() {
    this.dialogRef().nativeElement.showModal();
    requestAnimationFrame(() => this.visible.set(true));
  }

  close() {
    this.visible.set(false);
    const dialogEl = this.dialogRef().nativeElement;
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== 'opacity') return;
      dialogEl.removeEventListener('transitionend', onTransitionEnd);
      dialogEl.close();
    };
    dialogEl.addEventListener('transitionend', onTransitionEnd);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === this.dialogRef().nativeElement) {
      this.close();
    }
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.close();
  }
}
