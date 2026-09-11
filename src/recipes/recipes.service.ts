import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { CreateRecipeDto } from './dto/CreateRecipeDto';
import { QueryRecipeDto } from './dto/QueryRecipeDto';
import { UpdateRecipeDto } from './dto/UpdateRecipeDto';
import { Recipe } from './recipes.interface';

@Injectable()
export class RecipesService {
  constructor(private readonly storage: StorageService) {}

  findAll(query: QueryRecipeDto): {
    data: Recipe[];
    total: number;
    page: number;
    limit: number;
  } {
    let recipes = this.storage.read<Recipe[]>('recipes.json');

    if (query.difficulty) {
      recipes = recipes.filter(
        (recipe) => recipe.difficulty === query.difficulty,
      );
    }

    const total = recipes.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;

    return {
      data: recipes.slice(start, start + limit),
      total,
      page,
      limit,
    };
  }

  findOne(id: number): Recipe {
    const recipes = this.storage.read<Recipe[]>('recipes.json');
    const recipe = recipes.find((item) => item.id === id);

    if (!recipe) {
      throw new NotFoundException(`Recette avec l'id ${id} introuvable`);
    }

    return recipe;
  }

  create(dto: CreateRecipeDto): Recipe {
    const recipes = this.storage.read<Recipe[]>('recipes.json');

    const alreadyExists = recipes.some(
      (recipe) =>
        recipe.title.toLowerCase() === dto.title.toLowerCase(),
    );

    if (alreadyExists) {
      throw new ConflictException('Cette recette existe déjà');
    }

    const newId =
      recipes.length > 0
        ? Math.max(...recipes.map((recipe) => recipe.id)) + 1
        : 1;

    const recipe: Recipe = {
      id: newId,
      ...dto,
      createdAt: new Date().toISOString(),
    };

    recipes.push(recipe);
    this.storage.write<Recipe[]>('recipes.json', recipes);

    return recipe;
  }

  update(id: number, dto: UpdateRecipeDto): Recipe {
    const recipes = this.storage.read<Recipe[]>('recipes.json');
    const index = recipes.findIndex((recipe) => recipe.id === id);

    if (index === -1) {
      throw new NotFoundException(`Recette avec l'id ${id} introuvable`);
    }

    const updatedRecipe: Recipe = {
      ...recipes[index],
      ...dto,
    };

    recipes[index] = updatedRecipe;
    this.storage.write<Recipe[]>('recipes.json', recipes);

    return updatedRecipe;
  }

  remove(id: number): void {
    const recipes = this.storage.read<Recipe[]>('recipes.json');
    const index = recipes.findIndex((recipe) => recipe.id === id);

    if (index === -1) {
      throw new NotFoundException(`Recette avec l'id ${id} introuvable`);
    }

    recipes.splice(index, 1);
    this.storage.write<Recipe[]>('recipes.json', recipes);
  }
}