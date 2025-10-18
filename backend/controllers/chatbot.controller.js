import { configDotenv } from "dotenv";
import { AzureOpenAI } from "openai";

const endpoint = process.env.ENDPOINT;
const modelName = "gpt-5-mini";
const deployment = "gpt-5-mini";

export async function handleChatBot(req, res) {
  try {

    const message = req.body.message;

    const apiKey = process.env.APIKEY;
    const apiVersion = "2024-12-01-preview";
    const options = { endpoint, apiKey, deployment, apiVersion };

    const client = new AzureOpenAI(options);

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
      max_completion_tokens: 16384,
      model: modelName,
    });

    if (response?.error !== undefined && response.status !== "200") {
      throw response.error;
    }
    res.send({ message: response.choices[0].message.content })
  } catch (error) {
    res.send({ error: error });
  }
}