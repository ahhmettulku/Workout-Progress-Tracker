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
    const workoutId = parseInt(id);
    if (isNaN(workoutId)) throw new BadRequestError("Invalid workout ID");
    const workout = await this.workoutService.getWorkoutById(workoutId);
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
