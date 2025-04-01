import express from "express";
import axios from "axios";
import fs from "fs";
import cors from "cors";
import path from "path";
import { exec, spawn } from "child_process";  // Fixed import
import open from "open";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = "f0bf422847a86fecc909ebdc5157cf4e906566ef46fda11ab1e02d1fe353b75f";
const MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo";
const FILE_PATH = "./add.tsx";

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

// Generate React Component
app.post("/generate-react", async (req, res) => {
  try {
    const userInput = req.body.userInput;
    if (!userInput) {
      return res.status(400).json({ error: "❌ User input is required." });
    }

    const response = await axios.post(
      "https://api.together.xyz/chat/completions",
      {
        model: MODEL,
        messages: [{ role: "user", content: userInput }],
        max_tokens: 4096,
        temperature: 0.7,
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

// View the latest React component (Fixed duplicate route)
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

// Start the Streamlit app (Uncomment if needed)
// startStreamlitApp();

app.get("/preview", (req, res) => {
  const scriptPath = path.resolve(__dirname, "sandbox_creator.js");
  const clearScript = path.resolve(__dirname, "clear.py");

  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({ error: "sandbox_creator.js not found." });
  }

  exec(`python3 "${clearScript}"`, (clearError, clearStdout, clearStderr) => {
    if (clearError) {
      console.error("❌ Error running clear.py:", clearError.message);
      return res.status(500).json({ error: "Failed to execute clear.py." });
    }

    console.log("📜 clear.py output:", clearStdout);

    exec(`node "${scriptPath}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error running sandbox_creator.js:", error.message);
        return res.status(500).json({ error: "Failed to create preview." });
      }

      const match = stdout.match(/Preview URL:\s*(https?:\/\/[^\s]+)/);
      if (match) {
        const previewUrl = match[1];

        try {
          await open(previewUrl);
          console.log("✅ Preview opened in browser.");
        } catch (err) {
          console.error("⚠️ Could not auto-open preview:", err.message);
        }

        return res.json({ url: previewUrl });
      }

      console.warn("⚠️ Preview URL not found in script output.");
      return res.status(500).json({ error: "Preview URL not found." });
    });
  });
});

// ✅ Fixed: Use only **one** `app.listen()` call
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
