import { IsString, IsInt, Min } from "class-validator";

export class ExerciseDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(1)
  sets!: number;

  @IsInt()
  @Min(1)
  reps!: number;

  @IsInt()
  @Min(0)
  weight!: number;
}
