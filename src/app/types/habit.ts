export interface Habit {
  id: string;
  name: string;
  done: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface HabitEdit {
  id: string;
  name: string;
  date: Date;
}
