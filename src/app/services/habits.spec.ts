import { TestBed } from '@angular/core/testing';
import { Habits } from './habits';
import { Habit } from '../types/habit';

describe('Habits', () => {
  let service: Habits;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Habits);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load habits from localStorage', () => {
    const habit: Habit = {
      id: '1',
      name: 'Read a book',
      done: false,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: null,
    };
    localStorage.setItem('habits', JSON.stringify([habit]));
    service.loadHabits();
    expect(service.habits()).toEqual([habit]);
  });

  it('should add a habit', () => {
    const habit = 'Play video games';
    service.addHabit(habit, new Date());
    expect(service.habits()).toContainEqual(
      expect.objectContaining({ name: 'Play video games', done: false }),
    );
  });

  it('should remove a habit', () => {
    const habit = 'Play video games';
    const newHabit = service.addHabit(habit, new Date());

    service.removeHabit(newHabit.id);

    expect(service.habits()).not.toContainEqual(
      expect.objectContaining({ name: 'Play video games' }),
    );
  });

  it('should toggle to done', () => {
    const habit = 'Play video games';
    const newHabit = service.addHabit(habit, new Date());
    service.toggleHabit(newHabit.id);
    expect(service.habits()).toContainEqual(expect.objectContaining({ ...newHabit, done: true }));
  });

  it('should toggle to undone', () => {
    const habit = 'Play video games';
    const newHabit = service.addHabit(habit, new Date());
    service.toggleHabit(newHabit.id);
    service.toggleHabit(newHabit.id);
    expect(service.habits()).toContainEqual(expect.objectContaining({ ...newHabit, done: false }));
  });

  it('should store on localstorage after adding a new habit', () => {
    const habit = 'Play video games';
    const newHabit = service.addHabit(habit, new Date());
    TestBed.tick();
    const habitLS = localStorage.getItem('habits');
    expect(habitLS).toBe(JSON.stringify([newHabit]));
  });

  it('should update a habit name', () => {
    const habit = 'Play video games';
    const newHabit = service.addHabit(habit, new Date());
    const updatedHabit = service.updateHabit(newHabit.id, { name: 'Read a book' });
    expect(service.habits()).toContainEqual(expect.objectContaining(updatedHabit));
  });

  it('should update a habit date', () => {
    const habit = 'Write a letter';
    const newHabit = service.addHabit(habit, new Date());
    const updatedHabit = service.updateHabit(newHabit.id, { date: new Date('2026-03-01') });
    expect(service.habits()).toContainEqual(expect.objectContaining(updatedHabit));
  });

  it('should update a habit name and date', () => {
    const habit = 'Play video games';
    const newHabit = service.addHabit(habit, new Date());
    const updatedHabit = service.updateHabit(newHabit.id, {
      name: 'Read a book',
      date: new Date('2026-03-01'),
    });
    expect(service.habits()).toContainEqual(expect.objectContaining(updatedHabit));
  });
});
