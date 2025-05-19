import "reflect-metadata";
import prisma from "../services/prismaClient";
import { Service } from "typedi";
import { ExerciseDto } from "../dto/ExerciseDto";
import { GetWorkoutsQuery } from "../dto/GetWorkoutsQuery";

@Service()
export class WorkoutService {
  async getWorkouts(query: GetWorkoutsQuery) {
    try {
      const { skip = 0, take = 10, search } = query;

      return await prisma.workout.findMany({
        skip,
        take,
        where: search
          ? {
              exercises: {
                some: {
                  name: { contains: search },
                },
              },
            }
          : undefined,
        include: { exercises: true },
      });
    } catch (error) {
      throw new Error("Failed to fetch workouts");
    }
  }
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

  async createWorkout(data: { date: string; exercises: ExerciseDto[] }) {
    try {
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

      if (data.date !== undefined) updateData.date = data.date;

      if (data.exercises !== undefined) {
        // Remove all old exercises, then create new
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

  async deleteWorkout(id: number) {
    try {
      await prisma.exercise.deleteMany({ where: { workoutId: id } });
      const deletedWorkout = await prisma.workout.delete({ where: { id } });
      return deletedWorkout;
    } catch (error) {
      throw new Error("Failed to delete workout");
    }
  }
}
