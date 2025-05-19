import { IsOptional, IsInt, Min, IsString } from "class-validator";

export class GetWorkoutsQuery {
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number; // for pagination (offset)

  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number; // for pagination (limit/page size)

  @IsOptional()
  @IsString()
  search?: string; // optional search or filter term
  // Add more query params as needed (e.g., date range)
}
