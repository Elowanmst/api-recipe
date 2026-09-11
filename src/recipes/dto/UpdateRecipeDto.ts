import { PartialType } from '@nestjs/swagger';
import { CreateRecipeDto } from './CreateRecipeDto';

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}