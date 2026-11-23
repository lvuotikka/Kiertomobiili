// TheMealDB API:n reseptityyppi
export type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

// Haetaan reseptejä yhden raaka-aineen perusteella
export async function getRecipesByIngredient(
  ingredient: string
): Promise<Recipe[]> {
  // Muutetaan välilyönnit alaviivoiksi API-hakua varten
  const formattedIngredient = ingredient
    .toLowerCase()
    .replace(/ /g, '_');

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(formattedIngredient)}`
  );

  if (!response.ok) {
    throw new Error('Reseptien hakeminen epäonnistui.');
  }

  const data = await response.json();

  return data.meals ?? [];
}

// Yksittäisen reseptin tarkemmat tiedot
export type RecipeDetails = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strSource: string | null;
  [key: string]: string | null | undefined;
};

// Haetaan reseptin tiedot sen tunnisteella
export async function getRecipeDetails(
  id: string
): Promise<RecipeDetails | null> {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );

  if (!response.ok) {
    throw new Error('Reseptin tietojen hakeminen epäonnistui.');
  }

  const data = await response.json();

  return data.meals?.[0] ?? null;
}