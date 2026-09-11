export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  difficulty: Difficulty;
  prepTimeMinutes: number;
  servings: number;
  createdAt: string;
}