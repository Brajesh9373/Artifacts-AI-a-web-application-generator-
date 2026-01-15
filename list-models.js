import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listAvailableModels() {
  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set in the environment variables.");
    console.log("Please add your Google Gemini API key to the .env file:");
    console.log("GEMINI_API_KEY=your_actual_api_key_here");
    return;
  }

  console.log("🚀 Fetching available models from Google Gemini API...");

  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.models) {
      console.log("✅ Available models:");
      response.data.models.forEach(model => {
        if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes('generateContent')) {
          console.log(`  - ${model.name} (supports generateContent)`);
        }
      });
    } else {
      console.log("❌ No models found in the response");
      console.log("Response:", response.data);
    }
  } catch (error) {
    console.error("❌ Error fetching models from Google Gemini API:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("Request:", error.request);
    } else {
      console.error("Message:", error.message);
    }
  }
}

// Run the test
listAvailableModels();