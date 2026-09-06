import { Component, output, signal, viewChild } from '@angular/core';
import { Habit, HabitEdit } from '../../types/habit';
import { Modal } from '../modal/modal';
import { toDateInputValue } from '../../utils/date';

@Component({
  selector: 'app-edit-habit-dialog',
  imports: [Modal],
  template: `
    <app-modal (closed)="onModalClosed()">
      <div
        class="w-80 rounded-xl border border-pink-600/50 bg-surface p-5 text-text shadow-2xl shadow-black/60"
      >
        <h2 class="mb-4 text-sm font-semibold text-text">Edit Habit</h2>
        <div class="absolute top-4 right-4">
          <button
            type="button"
            (click)="close()"
            class="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-pink-400 bg-pink-500/10 text-pink-300 transition-colors duration-200 hover:bg-pink-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 16 16" fill="none">
              <path
                d="M4.41 4.41L8 8m0 0l3.59-3.59M8 8l-3.59 3.59M8 8l3.59 3.59"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <label class="mb-3 block text-xs text-text-muted">
          Name
          <input
            type="text"
            [value]="nameInput()"
            (input)="nameInput.set($any($event.target).value)"
            class="mt-1 w-full rounded-md border border-pink-600/50 bg-background px-2 py-1 text-sm text-text outline-none focus:border-pink-400"
          />
        </label>
        <label class="mb-4 block text-xs text-text-muted">
          Date
          <input
            type="date"
            [value]="dateInput()"
            (input)="dateInput.set($any($event.target).value)"
            class="mt-1 w-full rounded-md border border-pink-600/50 bg-background px-2 py-1 text-sm text-text outline-none focus:border-pink-400"
          />
        </label>
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
            (click)="save()"
            class="rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-background transition hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </app-modal>
  `,
})
export class EditHabitDialog {
  private modal = viewChild.required(Modal);

  private habitId = signal<string | null>(null);
  nameInput = signal('');
  dateInput = signal('');

  saved = output<HabitEdit>();

  open(habit: Habit) {
    this.habitId.set(habit.id);
    this.nameInput.set(habit.name);
    this.dateInput.set(toDateInputValue(habit.date));
    this.modal().open();
  }

  close() {
    this.modal().close();
  }

  onModalClosed() {
    this.habitId.set(null);
  }

  save() {
    const id = this.habitId();
    if (id) {
      this.saved.emit({ id, name: this.nameInput(), date: new Date(this.dateInput()) });
    }
    this.close();
  }
}
