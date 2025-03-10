import { GoogleGenerativeAI } from "@google/generative-ai";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDvawvyE_NGOka4VlCjrDFrnpAciN90Q8g");
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

const prompt = "Explain how AI works";

const result = await model.generateContent(prompt);
console.log(result.response.text());
