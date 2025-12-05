// Luke Pressimone & Lucas Walters
// AI Tutor for Introductory Python Programming

import OpenAI from "openai";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files (HTML/CSS/JS) from /public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// POST /api/ask
// Body: { apiKey: "user's key", question: "their question or code snippet" }
app.post("/api/ask", async (req, res) => {
  const { apiKey, question } = req.body;
  if (!apiKey || !question) {
    return res.status(400).json({
      error: "Please provide both apiKey and question.",
    });
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "You are a friendly, patient AI tutor for an introductory Python course. " +
            "Your job is to help a beginner learn Python by doing ALL of the following when relevant:\n" +
            "1) Explain Python fundamentals (variables, data types, expressions, input/output, " +
            "   conditionals, loops, functions, lists, dictionaries).\n" +
            "2) Debug small Python code snippets: identify errors, explain them, and show a fixed version.\n" +
            "3) Provide short example programs and explain them step-by-step in plain language.\n" +
            "4) Generate practice exercises and, when asked, provide clear model answers.\n" +
            "5) Encourage learning through interactive feedback.\n\n" +
            "Style guidelines:\n" +
            "- Use clear, beginner-friendly language and avoid unnecessary jargon.\n" +
            "- Put Python code inside fenced ```python code blocks.\n" +
            "- When debugging, first summarize what the code is trying to do, then show the corrected code, " +
            "  then explain the fix.\n" +
            "- When giving practice problems, number them and place solutions under a heading 'Suggested Answers'.\n" +
            "- End most replies with a short follow-up question that checks the student's understanding."
        },
        {
          role: "user",
          content: question,
        },
      ],
      max_output_tokens: 800,
    });

    // Send back JSON to the browser
    res.json({ answer: response.output_text });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({
      error: "There was a problem contacting the AI tutor. Check your API key and try again.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Tutor server running at http://localhost:${PORT}`);
});