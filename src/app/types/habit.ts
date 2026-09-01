export interface Habit {
  id: string;
  name: string;
  done: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date | null;
}
