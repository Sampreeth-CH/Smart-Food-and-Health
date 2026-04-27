import type { FoodEntry } from './food-data';

export interface AIAnalysisResult {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  health_score: number;
  verdict: 'Healthy' | 'Moderate' | 'Unhealthy';
  explanation: string;
  better_alternative: string;
}

// Mock data for fallback when API fails or no API key
const mockFoodData: Record<string, AIAnalysisResult> = {
  pizza: {
    food_name: 'Pizza',
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
    health_score: 45,
    verdict: 'Moderate',
    explanation: 'Pizza contains refined carbs and saturated fats. The cheese provides protein but overall nutritional value is limited.',
    better_alternative: 'Try a whole wheat crust pizza with vegetable toppings and less cheese.',
  },
  idli: {
    food_name: 'Idli',
    calories: 58,
    protein: 2,
    carbs: 12,
    fat: 0.1,
    health_score: 85,
    verdict: 'Healthy',
    explanation: 'Idli is a steamed, fermented food that is low in calories and fat. Fermentation improves digestibility and nutrient absorption.',
    better_alternative: 'Pair with sambar for added protein and vegetables.',
  },
  biryani: {
    food_name: 'Biryani',
    calories: 350,
    protein: 15,
    carbs: 45,
    fat: 12,
    health_score: 55,
    verdict: 'Moderate',
    explanation: 'Biryani provides good protein from meat but is calorie-dense. The rice and ghee add carbs and fats.',
    better_alternative: 'Try brown rice biryani with more vegetables and less oil.',
  },
  dosa: {
    food_name: 'Dosa',
    calories: 133,
    protein: 4,
    carbs: 28,
    fat: 1.5,
    health_score: 75,
    verdict: 'Healthy',
    explanation: 'Dosa is fermented and rich in carbs for energy. Low in fat when prepared traditionally without excess oil.',
    better_alternative: 'Choose ragi or oats dosa for added fiber and nutrients.',
  },
  burger: {
    food_name: 'Burger',
    calories: 540,
    protein: 25,
    carbs: 40,
    fat: 29,
    health_score: 35,
    verdict: 'Unhealthy',
    explanation: 'High in saturated fats and sodium. Processed meat increases cardiovascular risk.',
    better_alternative: 'Try a grilled chicken or veggie burger with whole grain bun.',
  },
  samosa: {
    food_name: 'Samosa',
    calories: 262,
    protein: 4,
    carbs: 28,
    fat: 15,
    health_score: 30,
    verdict: 'Unhealthy',
    explanation: 'Deep-fried in oil, high in trans fats. The potato filling adds carbs without much nutritional value.',
    better_alternative: 'Try baked samosa or air-fried version with less oil.',
  },
  paneer: {
    food_name: 'Paneer Tikka',
    calories: 265,
    protein: 18,
    carbs: 8,
    fat: 18,
    health_score: 70,
    verdict: 'Healthy',
    explanation: 'Excellent source of protein and calcium. Grilled preparation is healthier than fried versions.',
    better_alternative: 'Use low-fat paneer and pair with salad for a balanced meal.',
  },
  dal: {
    food_name: 'Dal',
    calories: 150,
    protein: 9,
    carbs: 20,
    fat: 4,
    health_score: 88,
    verdict: 'Healthy',
    explanation: 'Rich in plant protein, fiber, and essential minerals. A staple for balanced nutrition.',
    better_alternative: 'Add spinach or vegetables to increase nutrient density.',
  },
  chapati: {
    food_name: 'Chapati',
    calories: 104,
    protein: 3,
    carbs: 18,
    fat: 2.5,
    health_score: 80,
    verdict: 'Healthy',
    explanation: 'Whole wheat provides complex carbs and fiber. Low in fat when made with minimal ghee.',
    better_alternative: 'Try multigrain chapati for added nutrients and fiber.',
  },
  chole: {
    food_name: 'Chole (Chickpea Curry)',
    calories: 210,
    protein: 11,
    carbs: 30,
    fat: 6,
    health_score: 82,
    verdict: 'Healthy',
    explanation: 'Chickpeas are high in protein and fiber. Rich in vitamins and minerals.',
    better_alternative: 'Reduce oil and pair with brown rice or multigrain roti.',
  },
};

function findBestMatch(foodName: string): AIAnalysisResult | null {
  const normalizedInput = foodName.toLowerCase().trim();
  
  // Direct match
  if (mockFoodData[normalizedInput]) {
    return mockFoodData[normalizedInput];
  }
  
  // Partial match
  for (const key of Object.keys(mockFoodData)) {
    if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
      return mockFoodData[key];
    }
  }
  
  return null;
}

function generateGenericAnalysis(foodName: string): AIAnalysisResult {
  // Generate reasonable estimates for unknown foods
  const isLikelyHealthy = /salad|fruit|vegetable|fish|chicken|grilled|steamed|boiled/i.test(foodName);
  const isLikelyUnhealthy = /fried|chips|soda|candy|cake|cookie|ice cream|pizza|burger/i.test(foodName);
  
  if (isLikelyHealthy) {
    return {
      food_name: foodName,
      calories: 150,
      protein: 8,
      carbs: 15,
      fat: 5,
      health_score: 78,
      verdict: 'Healthy',
      explanation: `${foodName} appears to be a nutritious choice. Based on the name, this food is likely to provide good nutrients.`,
      better_alternative: 'Consider adding a variety of vegetables and lean proteins to your diet.',
    };
  } else if (isLikelyUnhealthy) {
    return {
      food_name: foodName,
      calories: 400,
      protein: 8,
      carbs: 50,
      fat: 20,
      health_score: 35,
      verdict: 'Unhealthy',
      explanation: `${foodName} may be high in calories, fats, or sugars. Consider moderation.`,
      better_alternative: 'Look for healthier alternatives with more nutrients and less processed ingredients.',
    };
  }
  
  // Default moderate rating
  return {
    food_name: foodName,
    calories: 250,
    protein: 10,
    carbs: 30,
    fat: 10,
    health_score: 55,
    verdict: 'Moderate',
    explanation: `${foodName} analysis based on general nutritional patterns. For accurate data, consult a nutritionist.`,
    better_alternative: 'Balance your meals with proteins, complex carbs, and vegetables.',
  };
}

export async function analyzeFoodWithAI(foodName: string): Promise<AIAnalysisResult> {
  const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
  
  // If no API key, use fallback immediately
  if (!apiKey) {
    const match = findBestMatch(foodName);
    if (match) {
      return { ...match, food_name: foodName };
    }
    return generateGenericAnalysis(foodName);
  }
  
  try {
    const response = await fetch('/api/analyze-food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ foodName }),
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (data && data.food_name && typeof data.health_score === 'number') {
      return data as AIAnalysisResult;
    }
    
    throw new Error('Invalid API response');
  } catch (error) {
    console.error('AI API error, falling back to mock data:', error);
    
    // Fallback to mock data
    const match = findBestMatch(foodName);
    if (match) {
      return { ...match, food_name: foodName };
    }
    return generateGenericAnalysis(foodName);
  }
}

export function createFoodEntryFromAnalysis(analysis: AIAnalysisResult): FoodEntry {
  return {
    id: crypto.randomUUID(),
    food_name: analysis.food_name,
    calories: analysis.calories,
    protein: analysis.protein,
    carbs: analysis.carbs,
    fat: analysis.fat,
    health_score: analysis.health_score,
    verdict: analysis.verdict,
    explanation: analysis.explanation,
    better_alternative: analysis.better_alternative,
    timestamp: Date.now(),
  };
}
