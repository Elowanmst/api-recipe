import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AdminOnly } from '../common/decorators/admin.decorator/admin.decorator';
import { CreateRecipeDto } from './dto/CreateRecipeDto';
import { QueryRecipeDto } from './dto/QueryRecipeDto';
import { UpdateRecipeDto } from './dto/UpdateRecipeDto';
import { RecipesService } from './recipes.service';

@ApiTags('Recipes')
@ApiSecurity('api-key')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer les recettes paginées' })
  @ApiResponse({ status: 200, description: 'Liste des recettes' })
  @ApiResponse({ status: 400, description: 'Paramètres invalides' })
  @ApiResponse({ status: 401, description: 'Clé API absente' })
  @ApiResponse({ status: 403, description: 'Clé API invalide' })
  findAll(@Query() query: QueryRecipeDto) {
    return this.recipesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une recette' })
  @ApiResponse({ status: 200, description: 'Recette trouvée' })
  @ApiResponse({ status: 401, description: 'Clé API absente' })
  @ApiResponse({ status: 403, description: 'Clé API invalide' })
  @ApiResponse({ status: 404, description: 'Recette introuvable' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOne(id);
  }

  @AdminOnly()
  @Post()
  @ApiOperation({ summary: 'Créer une recette' })
  @ApiResponse({ status: 201, description: 'Recette créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Clé API absente' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux administrateurs' })
  @ApiResponse({ status: 409, description: 'Titre déjà utilisé' })
  create(@Body() body: CreateRecipeDto) {
    return this.recipesService.create(body);
  }

  @AdminOnly()
  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une recette' })
  @ApiResponse({ status: 200, description: 'Recette modifiée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Clé API absente' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux administrateurs' })
  @ApiResponse({ status: 404, description: 'Recette introuvable' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, body);
  }

  @AdminOnly()
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer une recette' })
  @ApiResponse({ status: 204, description: 'Recette supprimée' })
  @ApiResponse({ status: 401, description: 'Clé API absente' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux administrateurs' })
  @ApiResponse({ status: 404, description: 'Recette introuvable' })
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.recipesService.remove(id);
  }
}