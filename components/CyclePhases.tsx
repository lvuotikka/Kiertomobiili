import { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Text } from 'react-native-paper';

import { cyclePhases } from '../data/cyclePhases';
import {
  getRecipesByIngredient,
  type Recipe,
} from '../services/recipeService';

import RecipeDetails from './RecipeDetails';

// Yhden vaiheen reseptien hakeminen ja näyttäminen
function PhaseRecipes({
  searchTerms,
  onSelectRecipe,
}: {
  searchTerms: string[];
  onSelectRecipe: (recipeId: string) => void;
}) {
  // Tallennetaan reseptit raaka-aineittain omiin ryhmiinsä ja hallitaan reseptien lataustilaa
  const [recipesByIngredient, setRecipesByIngredient] =
    useState<Record<string, Recipe[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function fetchRecipes() {
      try {
        setLoading(true);
        setError('');

        const results = await Promise.all(
          searchTerms.map(async (term) => {
            const recipes = await getRecipesByIngredient(term);
            return { term, recipes };
          })
        );

        const groupedRecipes: Record<string, Recipe[]> = {};

        results.forEach(({ term, recipes }) => {
          groupedRecipes[term] = recipes.slice(0, 3);
        });

        if (isActive) {
          setRecipesByIngredient(groupedRecipes);
        }
      } catch (err) {
        console.error(err);

        if (isActive) {
          setError('Reseptien hakeminen epäonnistui.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchRecipes();

    return () => {
      isActive = false;
    };
  }, [searchTerms]);

  if (loading) {
    return <ActivityIndicator color="#702D3C" />;
  }

  if (error) {
    return <Text style={styles.bodyText}>{error}</Text>;
  }

  return (
    <View style={styles.recipeList}>
      {searchTerms.map((term) => (
        <View key={term} style={styles.ingredientGroup}>
          <Text style={styles.ingredientTitle}>
            {term}
          </Text>

          {recipesByIngredient[term]?.length > 0 ? (
            recipesByIngredient[term].map((recipe) => (
              <Pressable
                key={recipe.idMeal}
                style={styles.recipeCard}
                onPress={() => onSelectRecipe(recipe.idMeal)}
              >
                <Image
                  source={{ uri: recipe.strMealThumb }}
                  style={styles.recipeImage}
                />

                <View style={styles.recipeTextContainer}>
                  <Text style={styles.recipeTitle}>
                    {recipe.strMeal}
                  </Text>
                  <Text style={styles.openRecipe}>
                    Avaa resepti →
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={styles.bodyText}>
              Reseptiejä ei löytynyt.
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

// Kierron vaiheiden esittely
export default function CyclePhases() {
  const [selectedRecipeId, setSelectedRecipeId] =
    useState<string | null>(null);

  // Jos resepti on valittu, näytetään reseptin oma näkymä
  if (selectedRecipeId) {
    return (
      <RecipeDetails
        recipeId={selectedRecipeId}
        onBack={() => setSelectedRecipeId(null)}
      />
    );
  }

  return (
    <>
      <View style={styles.introCard}>
        <Text style={styles.welcomeTitle}>
          Tutustu kiertoosi
        </Text>

        <Text style={styles.bodyText}>
          Kuukautiskierron eri vaiheisiin liittyy hormonaalisia
          muutoksia. Tutustu vaiheisiin ja löydä niihin liittyvää
          ruokainspiraatiota.
        </Text>
      </View>

      {cyclePhases.map((phase) => (
        <View
          key={phase.name}
          style={[
            styles.phaseCard,
            { borderLeftColor: phase.color },
          ]}
        >
          <View style={styles.phaseHeading}>
            <View style={styles.phaseHeadingText}>
              <Text style={styles.phaseTitle}>
                {phase.name}
              </Text>

              <Text style={styles.phaseDays}>
                {phase.days}
              </Text>
            </View>
          </View>

          <Text style={styles.bodyText}>
            {phase.description.replace(/^[ \t]+/gm, '')}
          </Text>

          <View style={styles.recipeSection}>
            <Text style={styles.recipeHeading}>
              Ruokainspiraatio
            </Text>

            <PhaseRecipes
              searchTerms={phase.recipeSearchTerms}
              onSelectRecipe={setSelectedRecipeId}
            />
          </View>
        </View>
      ))}
    </>
  );
}
// Tyylit
const styles = StyleSheet.create({
  introCard: {
    backgroundColor: '#F0E5CB',
    padding: 20,
    borderRadius: 20,
    gap: 8,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#51483F',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#625E56',
  },
  phaseCard: {
    backgroundColor: '#F0E5CB',
    padding: 18,
    borderRadius: 18,
    borderLeftWidth: 5,
    gap: 12,
  },
  phaseHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phaseHeadingText: {
    flex: 1,
    gap: 3,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#51483F',
  },
  phaseDays: {
    fontSize: 12,
    color: '#625E56',
  },
  recipeSection: {
    gap: 10,
    marginTop: 5,
  },
  recipeHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#51483F',
  },
  recipeList: {
    gap: 16,
  },
  ingredientGroup: {
    gap: 8,
  },
  ingredientTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#702D3C',
    textTransform: 'capitalize',
  },
  recipeCard: {
    backgroundColor: '#E5D8B8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 150,
  },
  recipeTextContainer: {
    padding: 12,
    gap: 5,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#51483F',
  },
  openRecipe: {
    fontSize: 12,
    color: '#702D3C',
    fontWeight: 'bold',
  },
});