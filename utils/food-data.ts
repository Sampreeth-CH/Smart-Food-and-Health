export interface FoodEntry {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  health_score: number;
  verdict: 'Healthy' | 'Moderate' | 'Unhealthy';
  explanation: string;
  better_alternative: string;
  timestamp: number;
  image_url?: string;
}

export interface InsightData {
  pattern: string;
  prediction: string;
  suggestion: string;
  icon: string;
  severity: 'info' | 'warning' | 'success';
}

const foodDatabase: Record<string, Omit<FoodEntry, 'id' | 'timestamp' | 'image_url'>> = {
  pizza: {
    food_name: 'Pizza Slice',
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
    health_score: 45,
    verdict: 'Moderate',
    explanation: 'Pizza contains refined carbs and saturated fats. The cheese provides protein but overall nutritional value is limited.',
    better_alternative: 'Try a whole wheat crust pizza with vegetable toppings and less cheese.',
  },
  burger: {
    food_name: 'Cheeseburger',
    calories: 540,
    protein: 25,
    carbs: 40,
    fat: 29,
    health_score: 35,
    verdict: 'Unhealthy',
    explanation: 'High in saturated fats and sodium. Processed meat increases cardiovascular risk.',
    better_alternative: 'Try a grilled chicken sandwich or a veggie burger with whole grain bun.',
  },
  salad: {
    food_name: 'Garden Salad',
    calories: 120,
    protein: 4,
    carbs: 12,
    fat: 7,
    health_score: 92,
    verdict: 'Healthy',
    explanation: 'Rich in fiber, vitamins, and antioxidants. Low calorie and nutrient-dense choice.',
    better_alternative: 'Add grilled chicken or chickpeas for more protein.',
  },
  soda: {
    food_name: 'Cola Soda',
    calories: 150,
    protein: 0,
    carbs: 39,
    fat: 0,
    health_score: 15,
    verdict: 'Unhealthy',
    explanation: 'High sugar content with zero nutritional value. Linked to obesity and diabetes.',
    better_alternative: 'Try sparkling water with lemon or unsweetened iced tea.',
  },
  chicken: {
    food_name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    health_score: 88,
    verdict: 'Healthy',
    explanation: 'Excellent lean protein source. Low in fat and rich in B vitamins.',
    better_alternative: 'Pair with steamed vegetables and quinoa for a complete meal.',
  },
  fries: {
    food_name: 'French Fries',
    calories: 365,
    protein: 4,
    carbs: 48,
    fat: 17,
    health_score: 25,
    verdict: 'Unhealthy',
    explanation: 'High in trans fats and sodium. Fried foods increase inflammation.',
    better_alternative: 'Try baked sweet potato wedges or air-fried vegetables.',
  },
  smoothie: {
    food_name: 'Green Smoothie',
    calories: 180,
    protein: 6,
    carbs: 35,
    fat: 2,
    health_score: 85,
    verdict: 'Healthy',
    explanation: 'Packed with vitamins, minerals, and fiber from fruits and vegetables.',
    better_alternative: 'Add protein powder or Greek yogurt for sustained energy.',
  },
  donut: {
    food_name: 'Glazed Donut',
    calories: 260,
    protein: 3,
    carbs: 31,
    fat: 14,
    health_score: 20,
    verdict: 'Unhealthy',
    explanation: 'High in sugar and refined carbs. Provides a quick energy spike followed by a crash.',
    better_alternative: 'Try overnight oats with honey and berries.',
  },
  rice: {
    food_name: 'Brown Rice Bowl',
    calories: 215,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    health_score: 75,
    verdict: 'Healthy',
    explanation: 'Whole grain with fiber and essential minerals. Good sustained energy source.',
    better_alternative: 'Add vegetables and lean protein for a balanced meal.',
  },
  icecream: {
    food_name: 'Ice Cream',
    calories: 270,
    protein: 4,
    carbs: 32,
    fat: 14,
    health_score: 30,
    verdict: 'Unhealthy',
    explanation: 'High in sugar and saturated fat. Occasional treat is fine but limit frequency.',
    better_alternative: 'Try frozen Greek yogurt or fruit sorbet.',
  },
  apple: {
    food_name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    health_score: 90,
    verdict: 'Healthy',
    explanation: 'High in fiber and antioxidants. Natural sugars provide sustained energy.',
    better_alternative: 'Pair with almond butter for added protein and healthy fats.',
  },
  pasta: {
    food_name: 'Spaghetti Bolognese',
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 15,
    health_score: 50,
    verdict: 'Moderate',
    explanation: 'Provides carbs and protein but often high in sodium. Portion control is key.',
    better_alternative: 'Use whole wheat pasta and add extra vegetables to the sauce.',
  },
  coffee: {
    food_name: 'Latte',
    calories: 190,
    protein: 10,
    carbs: 18,
    fat: 7,
    health_score: 55,
    verdict: 'Moderate',
    explanation: 'Contains caffeine and calcium from milk. Watch added sugars and syrups.',
    better_alternative: 'Try black coffee or a small latte with oat milk.',
  },
  sandwich: {
    food_name: 'Turkey Sandwich',
    calories: 320,
    protein: 22,
    carbs: 35,
    fat: 10,
    health_score: 70,
    verdict: 'Healthy',
    explanation: 'Good protein source with whole grain bread. Watch sodium in deli meats.',
    better_alternative: 'Use fresh turkey breast and add avocado for healthy fats.',
  },
  chips: {
    food_name: 'Potato Chips',
    calories: 160,
    protein: 2,
    carbs: 15,
    fat: 10,
    health_score: 22,
    verdict: 'Unhealthy',
    explanation: 'High in sodium and unhealthy fats. Easy to overeat due to low satiety.',
    better_alternative: 'Try air-popped popcorn or vegetable chips.',
  },
};

export function generateFoodAnalysis(): Omit<FoodEntry, 'id' | 'timestamp' | 'image_url'> {
  const foodKeys = Object.keys(foodDatabase);
  const randomKey = foodKeys[Math.floor(Math.random() * foodKeys.length)];
  return foodDatabase[randomKey];
}

export function saveFoodEntry(entry: FoodEntry): void {
  const entries = getFoodEntries();
  entries.unshift(entry);
  if (entries.length > 50) entries.pop();
  localStorage.setItem('nutrimind_food_entries', JSON.stringify(entries));
}

export function getFoodEntries(): FoodEntry[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('nutrimind_food_entries');
  return stored ? JSON.parse(stored) : [];
}

export function calculateHealthScore(entries: FoodEntry[]): number {
  if (entries.length === 0) return 75;
  const recentEntries = entries.slice(0, 10);
  const avgScore = recentEntries.reduce((sum, e) => sum + e.health_score, 0) / recentEntries.length;
  return Math.round(avgScore);
}

export function generateInsights(entries: FoodEntry[]): InsightData[] {
  if (entries.length < 3) {
    return [
      {
        pattern: 'Getting Started',
        prediction: 'Log more meals to unlock personalized insights',
        suggestion: 'Scan at least 5 meals to see your eating patterns',
        icon: '🎯',
        severity: 'info',
      },
    ];
  }

  const insights: InsightData[] = [];
  const recentEntries = entries.slice(0, 20);
  
  // Calculate unhealthy percentage
  const unhealthyCount = recentEntries.filter(e => e.verdict === 'Unhealthy').length;
  const unhealthyPercent = (unhealthyCount / recentEntries.length) * 100;
  
  // Calculate average calories
  const avgCalories = recentEntries.reduce((sum, e) => sum + e.calories, 0) / recentEntries.length;
  
  // Check for late night eating (entries after 8 PM simulated)
  const hasHighCalorie = recentEntries.some(e => e.calories > 400);
  
  // Check protein intake
  const avgProtein = recentEntries.reduce((sum, e) => sum + e.protein, 0) / recentEntries.length;

  if (unhealthyPercent > 40) {
    insights.push({
      pattern: 'High Junk Food Consumption',
      prediction: 'You are likely to consume unhealthy food tonight',
      suggestion: 'Plan your meals ahead and keep healthy snacks ready',
      icon: '⚠️',
      severity: 'warning',
    });
  }

  if (avgCalories > 350) {
    insights.push({
      pattern: 'High Calorie Intake Pattern',
      prediction: 'Your average meal exceeds recommended calories',
      suggestion: 'Try smaller portions and add more vegetables to your meals',
      icon: '🔥',
      severity: 'warning',
    });
  }

  if (hasHighCalorie) {
    insights.push({
      pattern: 'Evening Heavy Meals Detected',
      prediction: 'You tend to eat high-calorie food later in the day',
      suggestion: 'Try lighter meals after 8 PM for better sleep and digestion',
      icon: '🌙',
      severity: 'warning',
    });
  }

  if (avgProtein < 15) {
    insights.push({
      pattern: 'Low Protein Intake',
      prediction: 'You may experience energy dips and cravings',
      suggestion: 'Include lean proteins like chicken, fish, or legumes in each meal',
      icon: '💪',
      severity: 'info',
    });
  }

  if (unhealthyPercent < 30 && avgCalories < 300) {
    insights.push({
      pattern: 'Great Eating Habits!',
      prediction: 'You are on track to maintain a healthy lifestyle',
      suggestion: 'Keep up the good work! Consider adding variety to your diet.',
      icon: '🌟',
      severity: 'success',
    });
  }

  const healthyCount = recentEntries.filter(e => e.verdict === 'Healthy').length;
  if (healthyCount > unhealthyCount) {
    insights.push({
      pattern: 'Positive Trend Detected',
      prediction: 'Your food choices are improving',
      suggestion: 'You are making more healthy choices than unhealthy ones!',
      icon: '📈',
      severity: 'success',
    });
  }

  return insights.length > 0 ? insights : [
    {
      pattern: 'Balanced Diet',
      prediction: 'Your eating patterns appear balanced',
      suggestion: 'Continue monitoring and maintain your current habits',
      icon: '✅',
      severity: 'success',
    },
  ];
}

export function generatePredictionWarning(entries: FoodEntry[]): string | null {
  if (entries.length < 5) return null;
  
  const recentEntries = entries.slice(0, 10);
  const unhealthyCount = recentEntries.filter(e => e.verdict === 'Unhealthy').length;
  const highSugarCount = recentEntries.filter(e => e.carbs > 35 && e.health_score < 40).length;
  
  if (highSugarCount >= 3) {
    return '⚠️ You are likely to consume high sugar tonight';
  }
  
  if (unhealthyCount >= 4) {
    return '⚠️ Pattern detected: High probability of unhealthy food choice';
  }
  
  return null;
}
