# Épreuve individuelle — RecipeAPI

**Durée : 3h · Individuel **

---

## Contexte

Une startup culinaire te confie la construction d'une API REST pour gérer un catalogue de recettes de cuisine. Le projet doit suivre les mêmes standards que ceux vus en cours : structure NestJS propre, validation des données, authentification par clé API, documentation Swagger.

## Point de départ

Un projet de départ t'est fourni. **Ne repars pas de zéro** — il contient déjà :

- Le scaffold NestJS 11 configuré (`prefix /api`, CORS, `ValidationPipe`, Swagger monté sur `/api/docs`)
- `StorageService` (lecture/écriture des fichiers JSON), déjà utilisé en cours
- `src/data/recipes.json` : 20 recettes de départ
- `src/data/api-keys.json` : les clés API valides pour cette épreuve

```bash
npm install
npm run start:dev
```

Vérifie que `GET http://localhost:3000/api` répond avant de commencer.

## Modèle de données

```typescript
interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTimeMinutes: number;
  servings: number;
  createdAt: string; // généré côté serveur, jamais fourni par le client
}
```

## Ce qui est demandé

### 1. Authentification (guard)

Toutes les routes doivent être protégées par un guard vérifiant le header `X-API-Key` contre les clés listées dans `src/data/api-keys.json`.

- Header absent → `401 Unauthorized`
- Clé présente mais invalide → `403 Forbidden`
- Clé valide → la requête passe

### 2. CRUD `Recipe`

| Méthode | Route | Comportement attendu |
|---|---|---|
| `GET` | `/recipes` | Liste paginée (`page`, `limit` en query, défauts à ton choix), filtre optionnel par `difficulty`. Réponse : `{ data, total, page, limit }` |
| `GET` | `/recipes/:id` | Détail d'une recette. `404` si l'id n'existe pas |
| `POST` | `/recipes` | Crée une recette. `201` si succès, `400` si le body est invalide, `409` si le titre existe déjà (comparaison insensible à la casse) |
| `PATCH` | `/recipes/:id` | Modifie partiellement une recette (seuls les champs fournis changent). `200` si succès, `404` si l'id n'existe pas |
| `DELETE` | `/recipes/:id` | Supprime une recette. `204` si succès, `404` si l'id n'existe pas |

### 3. Validation

Le body de `POST /recipes` doit être validé avec `class-validator` :

| Champ | Contraintes |
|---|---|
| `title` | requis, string, non vide, max 200 caractères |
| `description` | requis, string, non vide, max 1000 caractères |
| `ingredients` | requis, tableau non vide de strings |
| `difficulty` | requis, une des valeurs `easy` / `medium` / `hard` |
| `prepTimeMinutes` | requis, entier ≥ 1 |
| `servings` | requis, entier entre 1 et 50 |

`PATCH /recipes/:id` accepte les mêmes champs, tous optionnels.

### 4. Documentation Swagger

Le squelette Swagger est déjà monté sur `/api/docs`. À toi d'ajouter :
- `@ApiTags` sur le controller
- `@ApiProperty` sur chaque champ des DTOs (au moins un `example`, et la liste `enum` pour `difficulty`)
- `@ApiOperation` et `@ApiResponse` (au moins les codes de succès et d'erreur réellement possibles) sur chaque route

## Comment ton travail sera noté

Deux notes sur 20, indépendantes :

- **Qualité TypeScript & NestJS /20** — structure du module, DTOs et validation, guard, gestion des erreurs, typage général.
- **Principes REST & documentation /20** — verbes et codes HTTP corrects, design des routes, cohérence pagination/filtre, complétude et exactitude du Swagger.

Le fonctionnement réel de l'API (testé en conditions réelles, pas juste à la lecture du code) compte davantage que le style — une fonctionnalité qui ne marche pas ne peut pas obtenir la note maximale sur le critère concerné, même si le code est propre.

## Rendu

1. Commit régulièrement pendant l'épreuve (l'historique git peut être consulté).
2. À la fin du temps imparti : pousse ton dépôt et communique le lien exact (URL + nom de la branche si ce n'est pas `main`) selon les modalités données en début de séance.
3. Un `README.md` à jour (comment installer et lancer le projet) fait partie de la note de documentation.

## Ce qui n'est pas demandé (hors périmètre, ne perds pas de temps dessus)

- Rôles/permissions différenciés (un seul niveau d'accès : clé valide = accès complet)
- Tests unitaires ou e2e
- Base de données (le fichier JSON fourni suffit)
- UI Scalar (le Swagger UI standard déjà monté suffit)
