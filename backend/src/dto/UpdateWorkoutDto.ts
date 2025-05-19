import {
  IsOptional,
  IsISO8601,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ExerciseDto } from "./ExerciseDto";

export class UpdateWorkoutDto {
  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises?: ExerciseDto[];
}
