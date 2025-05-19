// import {
//   JsonController,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Param,
//   Body,
//   Res,
//   HttpCode,
//   OnUndefined,
//   QueryParams,
// } from "routing-controllers";
// import { Response } from "express";
// import { WorkoutService } from "../services/WorkoutService";
// import { Service } from "typedi";
// import { CreateWorkoutDto } from "../dto/CreateWorkoutDto";
// import { UpdateWorkoutDto } from "../dto/UpdateWorkoutDto";
// import { GetWorkoutsQuery } from "../dto/GetWorkoutsQuery";

// @Service()
// @JsonController("/api/workouts")
// export class WorkoutController {
//   constructor(private workoutService: WorkoutService) {}

//   @Get("/")
//   async getWorkouts(
//     @QueryParams({ validate: true })
//     query: GetWorkoutsQuery,
//     @Res() res: Response,
//   ) {
//     try {
//       const workouts = await this.workoutService.getWorkouts(query);
//       return res.json(workouts);
//     } catch (e) {
//       console.error("Error fetching workouts:", e);
//       return res.status(500).json({ error: "Failed to fetch workouts" });
//     }
//   }

//   @Get("/:id")
//   @OnUndefined(404)
//   async getWorkoutById(@Param("id") id: number, @Res() res: Response) {
//     try {
//       const workout = await this.workoutService.getWorkoutById(Number(id));
//       if (!workout) return res.status(404).json({ error: "Workout not found" });
//       return res.json(workout);
//     } catch (e) {
//       console.error(`Error fetching workout with id ${id}:`, e);
//       return res.status(500).json({ error: "Failed to fetch workout" });
//     }
//   }

//   @Post("/")
//   @HttpCode(201)
//   async createWorkout(
//     @Body({ validate: true }) body: CreateWorkoutDto,
//     @Res() res: Response,
//   ) {
//     try {
//       const workout = await this.workoutService.createWorkout(body);
//       return res.status(201).json(workout);
//     } catch (e) {
//       return res
//         .status(400)
//         .json({ error: (e as Error).message || "Failed to create workout" });
//     }
//   }

//   @Put("/:id")
//   async updateWorkout(
//     @Param("id") id: number,
//     @Body({ validate: true }) body: UpdateWorkoutDto,
//     @Res() res: Response,
//   ) {
//     try {
//       const workout = await this.workoutService.updateWorkout(Number(id), body);
//       return res.json(workout);
//     } catch (e) {
//       console.error(`Error updating workout with id ${id}:`, e);
//       return res
//         .status(400)
//         .json({ error: (e as Error).message || "Failed to update workout" });
//     }
//   }

//   @Delete("/:id")
//   @OnUndefined(204)
//   async deleteWorkout(@Param("id") id: number, @Res() res: Response) {
//     try {
//       const deleted = await this.workoutService.deleteWorkout(Number(id));
//       if (!deleted) {
//         return res.status(404).json({ error: "Workout not found" });
//       }
//       return res.sendStatus(204);
//     } catch (e) {
//       console.error(`Error deleting workout with id ${id}:`, e);
//       return res.status(500).json({ error: "Failed to delete workout" });
//     }
//   }
// }

import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  QueryParams,
  OnUndefined,
} from "routing-controllers";
import { Service } from "typedi";
import { WorkoutService } from "../services/WorkoutService";
import { CreateWorkoutDto } from "../dto/CreateWorkoutDto";
import { UpdateWorkoutDto } from "../dto/UpdateWorkoutDto";
import { GetWorkoutsQuery } from "../dto/GetWorkoutsQuery";
import { NotFoundError, BadRequestError } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Service()
@JsonController("/api/workouts")
export class WorkoutController {
  constructor(private workoutService: WorkoutService) {}

  @Get("/")
  @OpenAPI({ summary: "Get all workouts" })
  async getWorkouts(@QueryParams({ validate: true }) query: GetWorkoutsQuery) {
    return await this.workoutService.getWorkouts(query);
  }

  @Get("/:id")
  async getWorkoutById(@Param("id") id: string) {
    const workout = await this.workoutService.getWorkoutById(parseInt(id));
    if (!workout) throw new NotFoundError("Workout not found");
    return workout;
  }

  @Post("/")
  @HttpCode(201)
  @OpenAPI({ summary: "Create a new workout" })
  async createWorkout(@Body({ validate: true }) body: CreateWorkoutDto) {
    try {
      const workout = await this.workoutService.createWorkout(body);
      return workout;
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestError(e.message || "Failed to create workout");
      }
      throw new BadRequestError("Failed to create workout");
    }
  }

  @Put("/:id")
  @OpenAPI({ summary: "Update a workout" })
  async updateWorkout(
    @Param("id") id: string,
    @Body({ validate: true }) body: UpdateWorkoutDto,
  ) {
    try {
      const workout = await this.workoutService.updateWorkout(
        parseInt(id),
        body,
      );
      return workout;
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestError(e.message || "Failed to update workout");
      }
      throw new BadRequestError("Failed to update workout");
    }
  }

  @Delete("/:id")
  @OnUndefined(204)
  @OpenAPI({ summary: "Delete a workout" })
  async deleteWorkout(@Param("id") id: string) {
    const deleted = await this.workoutService.deleteWorkout(parseInt(id));
    if (!deleted) throw new NotFoundError("Workout not found");
    // routing-controllers will handle the 204 response
    return;
  }
}
