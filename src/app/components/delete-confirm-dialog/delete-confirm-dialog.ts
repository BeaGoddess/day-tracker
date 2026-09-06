import { Component, output, signal, viewChild } from '@angular/core';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-delete-confirm-dialog',
  imports: [Modal],
  template: `
    <app-modal (closed)="onModalClosed()">
      <div
        class="w-80 rounded-xl border border-pink-600/50 bg-surface p-5 text-text shadow-2xl shadow-black/60"
      >
        <p class="mb-4 text-sm">
          Remove <span class="font-semibold">"{{ habitName() }}"</span>? This can't be undone.
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            (click)="close()"
            class="rounded-full px-3 py-1 text-xs text-text-muted transition hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            (click)="confirm()"
            class="rounded-full bg-danger px-3 py-1 text-xs font-semibold text-background transition hover:opacity-90"
          >
            Remove
          </button>
        </div>
      </div>
    </app-modal>
  `,
})
export class DeleteConfirmDialog {
  private modal = viewChild.required(Modal);

  private habitId = signal<string | null>(null);
  habitName = signal('');

  confirmed = output<string>();

  open(id: string, name: string) {
    this.habitId.set(id);
    this.habitName.set(name);
    this.modal().open();
  }

  close() {
    this.modal().close();
  }

  onModalClosed() {
    this.habitId.set(null);
  }

  confirm() {
    const id = this.habitId();
    if (id) {
      this.confirmed.emit(id);
    }
    this.close();
  }
}
