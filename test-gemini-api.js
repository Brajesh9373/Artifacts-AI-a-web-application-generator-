import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

async function testGeminiAPI() {
  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set in the environment variables.");
    console.log("Please add your Google Gemini API key to the .env file:");
    console.log("GEMINI_API_KEY=your_actual_api_key_here");
    return;
  }

  console.log("🚀 Testing Google Gemini API connection...");

  try {
    const testPrompt = "Hello, this is a test. Please respond with 'Hello, I am working correctly!' and nothing else.";

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: testPrompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.7,
          topP: 0.9,
          topK: 50
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.candidates && response.data.candidates.length > 0) {
      const generatedText = response.data.candidates[0].content.parts[0].text.trim();
      console.log("✅ Successfully connected to Google Gemini API!");
      console.log("💬 Response from model:", generatedText);
      
      // Test with a React component generation
      console.log("\n🧪 Testing React component generation...");
      const reactPrompt = "Create a simple React counter component with increment and decrement buttons using TypeScript and Tailwind CSS. Return only the React code.";
      
      const reactResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: reactPrompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
            topP: 0.9,
            topK: 50
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (reactResponse.data.candidates && reactResponse.data.candidates.length > 0) {
        const reactCode = reactResponse.data.candidates[0].content.parts[0].text.trim();
        console.log("✅ React component generated successfully!");
        console.log("📋 Generated code preview (first 200 chars):", reactCode.substring(0, 200) + "...");
      } else {
        console.log("❌ Failed to generate React component");
      }
    } else {
      console.log("❌ No candidates in the response");
      console.log("Response:", response.data);
    }
  } catch (error) {
    console.error("❌ Error connecting to Google Gemini API:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request:", error.request);
    } else {
      console.error("Message:", error.message);
    }
  }
}

// Run the test
testGeminiAPI();