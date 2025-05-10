import OpenAI from 'openai';
import { config } from '../config/env';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

// Tool definition
const searchWebFunctionDefinition = {
  name: "search_web_for_solana_or_crypto_events",
  description:
    "Searches the web for real-time information about Solana events, hackathons, crypto news, or related topics when the information is likely not in the training data or requires up-to-date details.",
  parameters: {
    type: "object" as const,
    properties: {
      search_query: {
        type: "string" as const,
        description:
          "A detailed search query to find relevant Solana or crypto event information. Example: 'upcoming Solana conferences in Asia 2024'",
      },
    },
    required: ["search_query"],
  },
};

// Real web search using SerpAPI
async function executeWebSearch(search_query: string): Promise<string> {
  console.log(`AI SERVICE: Performing real web search for: "${search_query}"`);

  const params = {
    q: search_query,
    api_key: config.serpApiKey,
    engine: "google",
  };

  try {
    const response = await axios.get('https://serpapi.com/search', { params });
    const results = response.data.organic_results?.slice(0, 5) || [];

    const formatted = results.map((r: any) => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet || "",
    }));

    return JSON.stringify(formatted);
  } catch (error: any) {
    console.error("Web search failed:", error.message);
    return JSON.stringify([{ title: "Search failed", snippet: "Could not fetch search results." }]);
  }
}

// Main function to get OpenAI reply
export const getOpenAIReply = async (userQuery: string): Promise<string> => {
  try {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant specializing in Solana, cryptocurrency events, hackathons, and related ecosystem news. If you need current or very specific event details not in your training data, use the 'search_web_for_solana_or_crypto_events' function.",
      },
      { role: "user", content: userQuery },
    ];

    let response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125", // Or switch to "gpt-4" if needed
      messages,
      tools: [{ type: "function", function: searchWebFunctionDefinition }],
      tool_choice: "auto",
    });

    let responseMessage = response.choices[0].message;

    if (responseMessage.tool_calls) {
      messages.push(responseMessage); // AI decided to use tool

      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === "search_web_for_solana_or_crypto_events") {
          const functionArgs = JSON.parse(toolCall.function.arguments);
          const searchResults = await executeWebSearch(functionArgs.search_query);

          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            content: searchResults,
          });
        }
      }

      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages,
      });

      responseMessage = response.choices[0].message;
    }

    return responseMessage.content || "I received a response, but it was empty. Could you try rephrasing?";
  } catch (error: any) {
    console.error("Error calling OpenAI API in aiService:", error.message);
    if (error.response && error.response.data) {
      console.error("OpenAI Error Data:", error.response.data);
    }
    throw new Error("The AI assistant encountered a problem. Please try again later.");
  }
};
