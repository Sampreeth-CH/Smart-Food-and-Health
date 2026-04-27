import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { foodName } = await request.json();
    
    if (!foodName || typeof foodName !== 'string') {
      return NextResponse.json(
        { error: 'Food name is required' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI API key not configured' },
        { status: 500 }
      );
    }
    
    // Example using OpenAI-compatible API
    const prompt = `Analyze the nutritional value of "${foodName}" and return ONLY a valid JSON object with these exact fields:
{
  "food_name": "string - the food name",
  "calories": number - estimated calories per serving,
  "protein": number - grams of protein,
  "carbs": number - grams of carbohydrates,
  "fat": number - grams of fat,
  "health_score": number - a score from 0-100 where 100 is healthiest,
  "verdict": "Healthy" | "Moderate" | "Unhealthy",
  "explanation": "string - brief explanation of nutritional value",
  "better_alternative": "string - healthier alternative suggestion"
}

Return ONLY the JSON object, no additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a nutrition expert. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'AI API request failed' },
        { status: 500 }
      );
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      );
    }
    
    const analysisResult = JSON.parse(jsonMatch[0]);
    
    // Validate and sanitize response
    const result = {
      food_name: String(analysisResult.food_name || foodName),
      calories: Number(analysisResult.calories) || 0,
      protein: Number(analysisResult.protein) || 0,
      carbs: Number(analysisResult.carbs) || 0,
      fat: Number(analysisResult.fat) || 0,
      health_score: Math.min(100, Math.max(0, Number(analysisResult.health_score) || 50)),
      verdict: ['Healthy', 'Moderate', 'Unhealthy'].includes(analysisResult.verdict)
        ? analysisResult.verdict
        : 'Moderate',
      explanation: String(analysisResult.explanation || 'Analysis complete.'),
      better_alternative: String(analysisResult.better_alternative || 'Consider balanced nutrition.'),
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze food error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze food' },
      { status: 500 }
    );
  }
}
