import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { Difficulty } from '../recipes.interface';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Omelette nature' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 'Une recette simple et rapide.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @ApiProperty({
    example: ['3 œufs', 'sel', 'poivre'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ingredients!: string[];

  @ApiProperty({
    example: 'easy',
    enum: ['easy', 'medium', 'hard'],
  })
  @IsIn(['easy', 'medium', 'hard'])
  difficulty!: Difficulty;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  prepTimeMinutes!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(50)
  servings!: number;
}