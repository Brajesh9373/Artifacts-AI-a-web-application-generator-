const express = require("express");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");
const open = require("open");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = "f0bf422847a86fecc909ebdc5157cf4e906566ef46fda11ab1e02d1fe353b75f";

const MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo";
const FILE_PATH = "./add.tsx"; // Ensure this path is correct and writable

function getSystemPrompt(shadcn = false) {
  let systemPrompt = `
  You are an expert frontend React engineer who is also a great UI/UX designer. Follow the instructions carefully:

  - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export.
  - Ensure the component is interactive by creating state when needed and avoiding required props.
  - Import React hooks like useState or useEffect explicitly when used.
  - Use TypeScript for the React component.
  - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Ensure a consistent color palette.
  - Use Tailwind margin and padding classes to maintain proper spacing.
  - Return only the React code starting from the imports, without any additional text.
  - If the user requests a dashboard, graph, or chart, use the Recharts library (e.g., \`import { LineChart, XAxis, ... } from "recharts"\`).
  `;

  if (shadcn) {
    systemPrompt += `
    There are some pre-styled components available. Use your best judgment to incorporate them when appropriate.
    `;
  }

  systemPrompt += `\n  NO OTHER LIBRARIES (e.g., zod, hookform) ARE INSTALLED OR ALLOWED.\n     - Don't add any unnecessary comments at the bigining of the file as well as end of the file.\n    -You are not allowed to use comments in entire response as well as Any type of links     - You are not allowed to use comments in entire response - You are not allowed to mention any programming language name in entire repsonse `;
  return systemPrompt;
}


// Function to read existing React component file
function readExistingFile() {
  try {
    if (fs.existsSync(FILE_PATH)) {
      return fs.readFileSync(FILE_PATH, "utf-8");
    }
  } catch (error) {
    console.error("❌ Error reading existing file:", error);
  }
  return "";
}

// Function to delete the first and last line from add.tsx
function deleteFirstAndLastLine() {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
      const lines = fileContent.split("\n");
      if (lines.length > 2) {
        const newContent = lines.slice(1, -1).join("\n");
        fs.writeFileSync(FILE_PATH, newContent, "utf-8");
        console.log("✅ First and last lines deleted successfully.");
      } else {
        console.log("❌ Not enough lines to delete.");
      }
    } else {
      console.log("❌ File does not exist.");
    }
    return true
  } catch (error) {
    console.error("❌ Error deleting first and last lines:", error);
  }
}

// Generate React Component
app.post("/generate-react", async (req, res) => {
  try {
    const userInput = req.body.userInput;
    if (!userInput) {
      return res.status(400).json({ error: "❌ User input is required." });
    }

    const finalPrompt = getSystemPrompt(false) + "\n\n**User Request:**\n" + userInput;

    const response = await axios.post(
      "https://api.together.xyz/chat/completions",
      {
        model: MODEL,
        messages: [{ role: "user", content: finalPrompt }],
        max_tokens: 4096,
        temperature: 0.7,
        top_p: 0.9,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>", "<|eom_id|>"],
        safety_model: "meta-llama/Meta-Llama-Guard-3-8B",
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error("AI response is empty.");
    }

    const generatedCode = response.data.choices[0].message.content.trim();

    try {
      fs.writeFileSync(FILE_PATH, generatedCode, "utf-8");
      console.log("✅ React component saved successfully.");
    } catch (fsError) {
      console.error("❌ Error saving file:", fsError);
      return res.status(500).json({ error: "Failed to save the file." });
    }

    res.json({ message: "✅ React component saved successfully.", code: generatedCode });
  } catch (error) {
    console.error("❌ Error generating React component:", error.message || error);
    res.status(500).json({ error: "Failed to generate React component. Try again later." });
  }
});

// Modify Existing React Component
app.post("/modify-react", async (req, res) => {
  try {
    const modificationRequest = req.body.userInput;
    if (!modificationRequest) {
      return res.status(400).json({ error: "❌ Modification request is required." });
    }

    const existingCode = readExistingFile();
    if (!existingCode) {
      return res.status(400).json({ error: "❌ No existing React component found. Please generate one first." });
    }

    const modifyPrompt = `
    Modify the following existing React component according to the user's new request.

    **Existing Component:**
    \`\`\`tsx
    ${existingCode}
    \`\`\`

    **New Modifications Requested:**
    ${modificationRequest}

    Please ensure the modified component:
    - Keeps its existing functionality unless explicitly requested otherwise.
    - Updates only the necessary parts while maintaining a consistent structure.
    - Still adheres to TypeScript and Tailwind styling conventions.
    - Returns the entire React code.
    - Don't add any unnecessary comments at the bigining of the file as well as end of the file.
    - You are not allowed to use comments in entire response 
    - You are not allowed to mention any programming language name in entire repsonse 
    `;

    const response = await axios.post(
      "https://api.together.xyz/chat/completions",
      {
        model: MODEL,
        messages: [{ role: "user", content: modifyPrompt }],
        max_tokens: 4096,
        temperature: 0.7,
        top_p: 0.9,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>", "<|eom_id|>"],
        safety_model: "meta-llama/Meta-Llama-Guard-3-8B",
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error("AI response is empty.");
    }

    const modifiedCode = response.data.choices[0].message.content.trim();

    try {
      fs.writeFileSync(FILE_PATH, modifiedCode, "utf-8");
      console.log("✅ React component modified and saved successfully.");
    } catch (fsError) {
      console.error("❌ Error saving modified file:", fsError);
      return res.status(500).json({ error: "Failed to save the modified file." });
    }

    res.json({ message: "✅ React component modified successfully.", code: modifiedCode });
  } catch (error) {
    console.error("❌ Error modifying React component:", error.message || error);
    res.status(500).json({ error: "Failed to modify React component. Try again later." });
  }
});

// View the latest React component
app.get("/view-latest", (req, res) => {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      return res.status(404).json({ error: "No component file found." });
    }

    const latestCode = fs.readFileSync(FILE_PATH, "utf-8");
    res.json({ code: latestCode });

  } catch (error) {
    console.error("❌ Error reading file:", error);
    res.status(500).json({ error: "Failed to read the latest component file." });
  }
});

// Check if the file exists and read its contents
app.get("/view-latest", (req, res) => {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      return res.json({ message: "✅ File exists", content });
    }
    return res.status(404).json({ error: "❌ File not found." });
  } catch (error) {
    return res.status(500).json({ error: "❌ Failed to read file." });
  }
});

const { spawn } = require("child_process");



// Function to start the Streamlit app
function startStreamlitApp() {
  console.log("🚀 Starting Streamlit app...");
  const streamlitProcess = spawn("streamlit", ["run", "D:\\artifacts-ai\\st_final.py"], {
    stdio: "inherit",
    shell: true, // Ensures compatibility with Windows
  });

  streamlitProcess.on("error", (err) => {
    console.error("❌ Failed to start Streamlit app:", err);
  });

  streamlitProcess.on("exit", (code) => {
    console.log(`Streamlit app exited with code ${code}`);
  });
}

// Start the Streamlit app
//startStreamlitApp();

app.get("/preview", (req, res) => {
  exec("node sandbox_creator.js", (error, stdout, stderr) => {
    if (error) {
      console.error("Error running sandbox_creator.js:", error);
      return res.status(500).json({ error: "Failed to create preview." });
    }

    const match = stdout.match(/Preview URL:\s*(https?:\/\/[^\s]+)/);
    if (match) {
      return res.json({ url: match[1] });
    }

    return res.status(500).json({ error: "Preview URL not found in output." });
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


