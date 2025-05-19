import type { Exercise } from "./exercise";

export interface Workout {
  id: number;
  date: string;
  exercises: Exercise[];
}
