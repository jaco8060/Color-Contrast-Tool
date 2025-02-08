import { GoogleGenerativeAI } from "@google/generative-ai";
const generationConfig = {
  maxOutputTokens: 12, // Ensures concise responses
  temperature: 0.8, // Keeps creativity but avoids randomness
  topP: 0.9, // Slightly narrows randomness
  topK: 10, // Reduces chance of odd word choices
};

// Access  API key as an environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function generateTheme(colorNames) {
  try {
    // Create a comma-separated string of color names for the prompt.
    const colorNamesList = colorNames.join(", ");
    // Initialize the model with the correct identifier for single-turn text generation.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
    });

    // Construct the prompt using the list of color names.
    const prompt = `Generate a creative color theme that is either a single word, exactly two words, or exactly three words—no more, no less.

    Examples:

    Input: Meatloaf, Burnt Coffee, Candle in the Wind, Brown Alpaca, Popcorn, Milk Chocolate, Artisans, Gold, Caramel Drizzle, Burning Trail, Caramel Crumb, Woodland Night, Intergalactic  
    Output: Autumn Harvest

    Input: Ocean Breeze, Deep Blue, Coral Sunset, Midnight Wave, Crystal Lagoon, Sunlit Sand  
    Output: Coastal Escape

    Input: Cherry Blossom, Sakura Mist, Rose Petal, Soft Blush, Morning Dew, Spring Bloom  
    Output: Blossom

    Input: Midnight Sky, Galaxy Dust, Nebula Glow, Starry Night, Cosmic Shadow, Eclipse  
    Output: Cosmic Dream

    Input: Crimson Maple, Golden Amber, Autumn Leaves, Rusted Bark, Morning Fog, Chestnut Glow  
    Output: Whispering Autumn Breeze

    Input: Sunlit Petals, Twilight Rose, Golden Twilight, Fading Ember, Snowy Whisper, Radiant Sunrise  
    Output: Glowing Evening Horizon

    Actual input: ${colorNamesList}  
    Output:`;

    // console.log(prompt);
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
