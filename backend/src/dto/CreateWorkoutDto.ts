import { IsArray, ValidateNested, IsISO8601 } from "class-validator";
import { Type } from "class-transformer";
import { ExerciseDto } from "./ExerciseDto";

export class CreateWorkoutDto {
  @IsISO8601()
  date!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises!: ExerciseDto[];
}
