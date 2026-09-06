import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HabitList } from './pages/habit-list/habit-list';

@Component({
  imports: [RouterOutlet, HabitList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  host: {
    class: 'flex flex-col justify-center items-center min-h-screen',
  },
})
export class App {
  protected readonly title = signal('day-tracker');
}
