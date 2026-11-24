import { useEffect, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Text, Button } from 'react-native-paper';

import {
  getRecipeDetails,
  type RecipeDetails as RecipeDetailsType,
} from '../services/recipeService';
// recipeId yksilöi haettavan reseptin ja onBack mahdollistaa
type Props = {
  recipeId: string;
  onBack: () => void;
};
// Hakee valitun reseptin tiedot ja näyttää sen kuvan, ainesosat, määrät ja valmistusohjeet englanniksi
export default function RecipeDetails({
  recipeId,
  onBack,
}: Props) {
  const [recipe, setRecipe] = useState<RecipeDetailsType | null>(null);
  // Hallitaan reseptin lataustilaa ja mahdollisia virheilmoituksia.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError('');

        const result = await getRecipeDetails(recipeId);

        if (isActive) {
          setRecipe(result);

          if (!result) {
            setError('Reseptin tietoja ei löytynyt.');
          }
        }
      } catch (err) {
        console.error('Reseptin haku epäonnistui:', err);

        if (isActive) {
          setError('Reseptin tietojen hakeminen epäonnistui.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      isActive = false;
    };
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F0E5CB" />
        <Text style={styles.loadingText}>
          Haetaan reseptiä...
        </Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.container}>
        <Button
          mode="text"
          textColor="#F0E5CB"
          onPress={onBack}
          icon="arrow-left"
        >
          Takaisin
        </Button>

        <Text style={styles.errorText}>
          {error || 'Reseptiä ei löytynyt.'}
        </Text>
      </View>
    );
  }

  // Poimitaan reseptin ainesosat ja määrät API-vastauksesta
  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const ingredient = recipe[`strIngredient${index + 1}`]?.trim();
    const measure = recipe[`strMeasure${index + 1}`]?.trim();

    return ingredient
      ? {
          ingredient,
          measure: measure ?? '',
        }
      : null;
  }).filter(
    (item): item is { ingredient: string; measure: string } =>
      item !== null
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Button
        mode="text"
        textColor="#F0E5CB"
        onPress={onBack}
        icon="arrow-left"
        style={styles.backButton}
      >
        Takaisin vaiheisiin
      </Button>

      <View style={styles.recipeCard}>
        <Image
          source={{ uri: recipe.strMealThumb }}
          style={styles.recipeImage}
        />

        <View style={styles.recipeContent}>
          <Text style={styles.recipeTitle}>
            {recipe.strMeal}
          </Text>

          <Text style={styles.sectionTitle}>
            Ainesosat
          </Text>

          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Text style={styles.ingredientText}>
                {item.ingredient}
              </Text>
              <Text style={styles.measureText}>
                {item.measure}
              </Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>
            Valmistusohjeet
          </Text>

          <Text style={styles.instructions}>
            {recipe.strInstructions}
          </Text>

          {recipe.strSource && (
            <Button
              mode="contained"
              buttonColor="#702D3C"
              textColor="#F0E5CB"
              onPress={() => Linking.openURL(recipe.strSource!)}
              style={styles.sourceButton}
            >
              Avaa alkuperäinen resepti
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
// Tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
    gap: 12,
  },
  centered: {
    padding: 30,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#F0E5CB',
    fontSize: 14,
  },
  errorText: {
    color: '#F0E5CB',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  recipeCard: {
    backgroundColor: '#F0E5CB',
    borderRadius: 18,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 230,
  },
  recipeContent: {
    padding: 20,
    gap: 12,
  },
  recipeTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#51483F',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#702D3C',
    marginTop: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D8CDB8',
    paddingVertical: 7,
  },
  ingredientText: {
    flex: 1,
    color: '#51483F',
    fontSize: 14,
  },
  measureText: {
    color: '#625E56',
    fontSize: 14,
    textAlign: 'right',
  },
  instructions: {
    fontSize: 14,
    lineHeight: 23,
    color: '#625E56',
  },
  sourceButton: {
    marginTop: 12,
    borderRadius: 10,
  },
});