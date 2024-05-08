import { GoogleGenerativeAI } from "@google/generative-ai";
const generationConfig = {
  maxOutputTokens: 20, // Sufficient for a short theme name
  temperature: 0.7, // Lower for more coherent but still creative outputs
  topP: 0.9, // Broad enough to maintain creativity
  topK: 10, // Allows more options at each step, increasing creativity
};

// Access  API key as an environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function generateTheme(colorNames) {
  try {
    // Create a comma-separated string of color names for the prompt.
    const colorNamesList = colorNames.join(", ");
    // Initialize the model with the correct identifier for single-turn text generation.
    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro",
      generationConfig,
    });

    // Construct the prompt using the list of color names.
    const prompt = `Generate a creative color theme (2 words maximum) given a set of colors 
    Example Input: Names:Meatloaf, Burnt Coffee, Candle in the Wind, Brown Alpaca, Popcorn, Milk Chocolate, Artisans, Gold. Caramel Drizzle. Burning Trail, Caramel Crumb, Woodland Night, Intergalactic

    Example Output: Harvest Season
    
    names: ${colorNamesList}`;

    console.log(prompt);
    // Generate content based on the prompt.
    const result = await model.generateContent(prompt);
    // Extract and return the text part of the response.
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Failed to generate theme name:", error);
    return "Failed Gen, Please retry."; // Provide a fallback or error message
  }
}

export { generateTheme };
