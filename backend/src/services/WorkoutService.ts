import "reflect-metadata";
import prisma from "../services/prismaClient";
import { Service } from "typedi";
import { ExerciseDto } from "../dto/ExerciseDto";
import { GetWorkoutsQuery } from "../dto/GetWorkoutsQuery";

@Service()
export class WorkoutService {
  // Fetch a paginated list of workouts, optionally filtered by exercise name
  async getWorkouts(query: GetWorkoutsQuery) {
    try {
      const { skip = 0, take = 10, search } = query;

      return await prisma.workout.findMany({
        skip,
        take,
        // If search is provided, filter workouts by exercise name
        where: search
          ? {
              exercises: {
                some: {
                  name: { contains: search },
                },
              },
            }
          : undefined,
        include: { exercises: true }, // Always include exercises in the result
      });
    } catch (error) {
      throw new Error("Failed to fetch workouts");
    }
  }

  // Fetch a single workout by its ID, including its exercises
  async getWorkoutById(id: number) {
    try {
      return await prisma.workout.findUnique({
        where: { id },
        include: { exercises: true },
      });
    } catch (error) {
      throw new Error("Failed to fetch workout");
    }
  }

  // Create a new workout with its exercises
  async createWorkout(data: { date: string; exercises: ExerciseDto[] }) {
    try {
      // Ensure date is stored as ISO string
      const dateString =
        typeof data.date === "string"
          ? new Date(data.date).toISOString()
          : new Date().toISOString();
      return await prisma.workout.create({
        data: {
          date: dateString,
          exercises: {
            create: data.exercises.map((e) => ({
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              weight: e.weight,
            })),
          },
        },
        include: { exercises: true },
      });
    } catch (error) {
      throw new Error("Failed to create workout");
    }
  }

  // Update an existing workout and its exercises
  async updateWorkout(
    id: number,
    data: { date?: string; exercises?: ExerciseDto[] },
  ) {
    try {
      // 1. Check if workout exists
      const workout = await prisma.workout.findUnique({ where: { id } });
      if (!workout) throw new Error("Workout not found");

      // 2. Prepare update data
      const updateData: any = {};

      // Update date if provided
      if (data.date !== undefined) updateData.date = data.date;

      if (data.exercises !== undefined) {
        // Remove all old exercises, then create new ones
        updateData.exercises = {
          deleteMany: {}, // Delete all exercises for this workout
          create: data.exercises.map((e) => ({
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight,
          })),
        };
      }

      // 3. Run update
      return await prisma.workout.update({
        where: { id },
        data: updateData,
        include: { exercises: true },
      });
    } catch (error) {
      throw new Error((error as Error).message || "Failed to update workout");
    }
  }

  // Delete a workout and all its exercises
  async deleteWorkout(id: number) {
    try {
      // First, delete all exercises related to the workout
      await prisma.exercise.deleteMany({ where: { workoutId: id } });
      // Then, delete the workout itself
      const deletedWorkout = await prisma.workout.delete({ where: { id } });
      return deletedWorkout;
    } catch (error) {
      throw new Error("Failed to delete workout");
    }
  }
}
