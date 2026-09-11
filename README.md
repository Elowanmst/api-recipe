# RecipeAPI

API REST construite avec NestJS pour gérer des recettes stockées dans des fichiers JSON.

## Installation et lancement

```bash
npm install
npm run start:dev
```

L'API est disponible sur `http://localhost:3000/api`.

Pour compiler le projet :

```bash
npm run build
```

Pour lancer la version compilée :

```bash
npm run start:prod
```

## Fonctionnement

Les recettes sont lues et enregistrées dans `src/data/recipes.json` grâce au `StorageService`.

L'API utilise une authentification par clé API. La clé doit être envoyée dans le header :

```text
x-api-key: votre-cle-api
```

Les routes de lecture des recettes sont accessibles avec une clé valide. La création, la modification et la suppression sont réservées à un administrateur.

## Où trouver une clé API ?

En développement, la clé administrateur est définie dans `src/data/users.json` 

Une nouvelle clé utilisateur peut être obtenue avec :

```http
POST /api/auth/register
```

Body JSON :

```json
{
	"email": "user@recipeapi.dev"
}
```

La réponse contient la clé API du nouvel utilisateur.

Les clés présentes dans `users.json` sont des clés de développement. Elles ne doivent pas être utilisées comme de vraies clés secrètes en production.

## Routes principales

### Authentification

```text
POST   /api/auth/register       Créer un compte, route publique
GET    /api/auth/me             Voir son profil
POST   /api/auth/regenerate-key Régénérer sa clé
DELETE /api/auth/account        Supprimer son compte
```

Les trois dernières routes nécessitent le header `x-api-key`.

### Recettes

```text
GET    /api/recipes             Lister les recettes
GET    /api/recipes/:id         Voir une recette
POST   /api/recipes             Créer une recette, admin uniquement
PATCH  /api/recipes/:id         Modifier une recette, admin uniquement
DELETE /api/recipes/:id         Supprimer une recette, admin uniquement
```

La liste accepte les paramètres `page`, `limit` et `difficulty` (`easy`, `medium` ou `hard`).

## Documentation Swagger

La documentation interactive est disponible sur :

```text
http://localhost:3000/api/docs
```

Utilise le bouton `Authorize` et renseigne la clé API dans le champ `X-API-Key`.

## Codes HTTP principaux

```text
200  Requête réussie
201  Ressource créée
204  Ressource supprimée
400  Données invalides
401  Clé API absente
403  Clé invalide ou droits insuffisants
404  Ressource introuvable
409  Ressource déjà existante
```

## Données du projet

```text
src/data/recipes.json  Recettes
src/data/users.json    Utilisateurs et clés API
```
