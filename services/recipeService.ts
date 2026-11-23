// TheMealDB API:n reseptityyppi
export type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

// Reseptit, joita emme halua näyttää ehdotuksissa
const unwantedWords = [
  'cake',
  'pudding',
  'cookie',
  'biscuit',
  'brownie',
  'ice cream',
  'chocolate',
  'fudge',
  'candy',
  'donut',
  'doughnut',
  'tart',
  'sweet',
];

// Tarkistetaan, onko reseptin nimi sopiva
function isSuitableRecipeName(name: string): boolean {
  const lowerName = name.toLowerCase();

  return !unwantedWords.some((word) => lowerName.includes(word));
}

// Välimuisti reseptien tarkemmille tiedoille
const recipeCache = new Map<string, RecipeDetails | null>();

// Haetaan reseptejä yhden raaka-aineen perusteella
export async function getRecipesByIngredient(
  ingredient: string
): Promise<Recipe[]> {
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

  const meals: Recipe[] = data.meals ?? [];

  // Karsitaan ensin selvästi sopimattomat nimet
  const nameFiltered = meals.filter((recipe) =>
    isSuitableRecipeName(recipe.strMeal)
  );

  // Tarkistetaan enintään 10 ehdokkaan tarkemmat tiedot
  const candidates = nameFiltered.slice(0, 10);

  const detailedRecipes = await Promise.all(
    candidates.map((recipe) => getRecipeDetails(recipe.idMeal))
  );

  // Poistetaan jälkiruoat ja muut sopimattomat kategoriat
  const suitableRecipes = candidates.filter((recipe, index) => {
    const details = detailedRecipes[index];

    if (!details) {
      return false;
    }

    return details.strCategory?.toLowerCase() !== 'dessert';
  });

  return suitableRecipes;
}

// Yksittäisen reseptin tarkemmat tiedot
export type RecipeDetails = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strSource: string | null;
  strCategory?: string | null;
  [key: string]: string | null | undefined;
};

// Haetaan reseptin tiedot sen tunnisteella
export async function getRecipeDetails(
  id: string
): Promise<RecipeDetails | null> {
  // Käytetään välimuistissa olevia tietoja, jos ne löytyvät
  if (recipeCache.has(id)) {
    return recipeCache.get(id) ?? null;
  }

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );

  if (!response.ok) {
    throw new Error('Reseptin tietojen hakeminen epäonnistui.');
  }

  const data = await response.json();

  const recipe: RecipeDetails | null = data.meals?.[0] ?? null;

  recipeCache.set(id, recipe);

  return recipe;
}