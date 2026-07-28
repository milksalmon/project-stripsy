import express from 'express';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connect.js'

dotenv.config();

const app = express();

const gemini = process.env.GEMINI_API_KEY;
const port = process.env.PORT;

connectDB();

const ai = new GoogleGenAI({ apiKey: gemini });

app.use(cors());

app.get('/ai-test', async (req, res) => {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: "Give me a word for each category, and write with the category template. FRUIT: VEGETABLE: MEAT: DRINK: ",
    });
    res.json({text: interaction.output_text});
    console.log(interaction.output_text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reach Gemini" });
  }
})

app.listen(port, () => {
  console.log(`Listening on ${port}`);
})