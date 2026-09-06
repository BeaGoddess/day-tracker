import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Habit } from '../types/habit';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class Habits {
  // #habits is a private property, only can be changed by functions inside the class
  #habits = signal<Habit[]>([]);
  #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // public property that can be accessed from outside the class
  habits = this.#habits.asReadonly();

  constructor() {
    this.loadHabits();
    // effect is a function that runs when the signal changes
    effect(() => {
      if (this.#isBrowser) {
        localStorage.setItem('habits', JSON.stringify(this.#habits()));
      }
    });
  }

  loadHabits() {
    if (!this.#isBrowser) return;

    const habits = localStorage.getItem('habits');
    if (habits) {
      this.#habits.set(
        JSON.parse(habits, (key, value) => {
          if ((key === 'date' || key === 'createdAt' || key === 'updatedAt') && value !== null) {
            return new Date(value);
          }
          return value;
        }),
      );
    }
  }

  addHabit(name: string, date: Date): Habit {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      done: false,
      date,
      createdAt: new Date(),
      updatedAt: null,
    };
    this.#habits.update((habits) => [...habits, newHabit]);
    return newHabit;
  }

  updateHabit(id: string, { name, date }: { name?: string; date?: Date }): Habit {
    let updatedHabit: Habit | undefined;
    this.#habits.update((habits) =>
      habits.map((habit) => {
        if (habit.id === id) {
          updatedHabit = {
            ...habit,
            name: name ?? habit.name,
            date: date ?? habit.date,
            updatedAt: !!name || !!date ? new Date() : habit.updatedAt,
          };
          return updatedHabit;
        }
        return habit;
      }),
    );

    if (!updatedHabit) {
      throw new Error('Habit not found');
    }

    return updatedHabit;
  }

  toggleHabit(id: string) {
    this.#habits.update((habits) =>
      habits.map((habit) => (habit.id === id ? { ...habit, done: !habit.done } : habit)),
    );
  }

  removeHabit(id: string) {
    this.#habits.update((habits) => habits.filter((habit) => habit.id !== id));
  }
}
