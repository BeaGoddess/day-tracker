import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Habits } from '../../services/habits';
import { DeleteConfirmDialog } from '../../components/delete-confirm-dialog/delete-confirm-dialog';
import { EditHabitDialog } from '../../components/edit-habit-dialog/edit-habit-dialog';
import { HabitEdit } from '../../types/habit';
import { daysBetween } from '../../utils/date';

@Component({
  imports: [DeleteConfirmDialog, EditHabitDialog],
  selector: 'app-habit-list',
  template: `
    <div class="mb-4 flex items-center justify-between">
      <button
        (click)="setPreviousDate()"
        class="flex h-9 w-9 items-center justify-center rounded-full text-pink-300 transition hover:bg-surface-hover"
        aria-label="Previous day"
      >
        &lsaquo;
      </button>

      <div class="text-center">
        <p class="text-lg font-semibold text-text">{{ weekdayLabel() }}</p>
        <p class="text-xs text-text-muted">{{ relativeLabel() }}</p>
      </div>

      <button
        (click)="setNextDate()"
        class="flex h-9 w-9 items-center justify-center rounded-full text-pink-300 transition hover:bg-surface-hover"
        aria-label="Next day"
      >
        &rsaquo;
      </button>
    </div>

    <div
      class="relative overflow-hidden rounded-2xl border border-pink-600/50 bg-surface pt-8 pb-6 flex-1 shadow-2xl shadow-black/60"
      style="background-image: linear-gradient(90deg, transparent 40px, var(--color-pink-700) 40px, var(--color-pink-700) 42px, transparent 42px),
linear-gradient(color-mix(in srgb, var(--color-pink-500) 10%, transparent) .1em, transparent .1em);
background-size: 100% 30px;"
    >
      <ul class="px-6 pl-14 text-text">
        @for (habit of filteredHabits(); track habit.id) {
          <li class="group relative flex h-7.5 items-center gap-2 text-sm">
            <button
              type="button"
              (click)="toggleHabit(habit.id)"
              class="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-200"
              [class]="habit.done ? 'border-pink-500 bg-pink-500' : 'border-pink-400'"
            >
              <svg viewBox="0 0 16 16" class="h-3 w-3" fill="none">
                <path
                  d="M3 8.5L6.5 12L13 4.5"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  pathLength="1"
                  class="transition-[stroke-dashoffset] duration-300 ease-out"
                  [style.stroke-dasharray]="1"
                  [style.stroke-dashoffset]="habit.done ? 0 : 1"
                />
              </svg>
            </button>

            <span class="relative mr-12 min-w-0 flex-1 truncate">
              {{ habit.name }}
              <span
                class="absolute top-1/2 left-0 h-px w-full origin-left bg-text/50 transition-transform delay-150 duration-300 ease-out"
                [class]="habit.done ? 'scale-x-100' : 'scale-x-0'"
              ></span>
            </span>

            <div
              class="absolute top-0 right-0 flex h-full flex-row items-center gap-1 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
            >
              <button
                type="button"
                (click)="editHabit(habit.id)"
                class="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-pink-400 bg-pink-500/10 text-pink-300 transition-colors duration-200 hover:bg-pink-500/20"
                aria-label="Edit habit"
              >
                <svg viewBox="0 0 24 24" class="h-2.5 w-2.5" fill="none">
                  <path
                    d="M15.232 5.232l3.536 3.536M9 11l6.036-6.036a2.5 2.5 0 113.536 3.536L12.536 14.5H9V11z M5 19h14"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                (click)="removeHabit(habit.id)"
                class="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-danger/60 bg-danger/10 text-danger transition-colors duration-200 hover:bg-danger/20"
                aria-label="Remove habit"
              >
                <svg viewBox="0 0 24 24" class="h-2.5 w-2.5" fill="none">
                  <path
                    d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </li>
        }
      </ul>
    </div>
    <button
      (click)="createHabit()"
      class="mt-4 inline-flex w-fit items-center justify-center self-center rounded-full px-2 py-1 text-pink-300 transition hover:bg-surface-hover"
      aria-label="Create Habit"
    >
      <span class="text-xs">Create Habit</span>
    </button>

    <app-delete-confirm-dialog (confirmed)="onDeleteConfirmed($event)" />
    <app-edit-habit-dialog (saved)="onHabitSaved($event)" />
  `,
  host: {
    class: 'max-w-100 w-full max-h-100 flex-col flex flex-1',
  },
})
export class HabitList {
  private habitsService = inject(Habits);
  selectedDate = signal(new Date());

  private deleteDialog = viewChild.required(DeleteConfirmDialog);
  private editDialog = viewChild.required(EditHabitDialog);

  weekdayLabel = computed(() =>
    this.selectedDate().toLocaleDateString('en-US', { weekday: 'long' }),
  );

  relativeLabel = computed(() => {
    const diff = daysBetween(this.selectedDate(), new Date());
    const dayMonth = this.selectedDate().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
    });

    if (diff === 0) return `Today, ${dayMonth}`;
    if (diff === -1) return `Yesterday, ${dayMonth}`;
    if (diff === 1) return `Tomorrow, ${dayMonth}`;
    return dayMonth;
  });

  setPreviousDate() {
    const date = new Date(this.selectedDate());
    date.setDate(date.getDate() - 1);
    this.selectedDate.set(date);
  }

  setNextDate() {
    const date = new Date(this.selectedDate());
    date.setDate(date.getDate() + 1);
    this.selectedDate.set(date);
  }

  filteredHabits = computed(() =>
    this.habitsService
      .habits()
      .filter((h) => this.selectedDate().toDateString() === h.date.toDateString()),
  );

  createHabit() {
    this.habitsService.addHabit('New Habit', this.selectedDate());
  }

  toggleHabit(id: string) {
    this.habitsService.toggleHabit(id);
  }

  removeHabit(id: string) {
    const habit = this.habitsService.habits().find((h) => h.id === id);
    if (!habit) return;

    this.deleteDialog().open(id, habit.name);
  }

  onDeleteConfirmed(id: string) {
    this.habitsService.removeHabit(id);
  }

  editHabit(id: string) {
    const habit = this.habitsService.habits().find((h) => h.id === id);
    if (!habit) return;

    this.editDialog().open(habit);
  }

  onHabitSaved(edit: HabitEdit) {
    this.habitsService.updateHabit(edit.id, { name: edit.name, date: edit.date });
  }
}
