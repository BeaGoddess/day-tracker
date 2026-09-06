function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / msPerDay);
}

function toDateInputValue(date: Date): string {
  return date.toISOString().split('T')[0];
}

export { startOfDay, daysBetween, toDateInputValue };
