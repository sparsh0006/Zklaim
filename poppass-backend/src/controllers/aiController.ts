import { Request, Response } from 'express';
import * as aiService from '../services/aiService';

export const handleOpenAIQuery = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || query.trim() === "") {
    res.status(400).json({ message: "Query is required and must be a non-empty string." });
    return;
  }

  try {
    const reply = await aiService.getOpenAIReply(query);
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Error in handleOpenAIQuery controller:", error.message);
    // Send a generic error message to the client
    res.status(500).json({ message: error.message || "An error occurred while processing your request with the AI assistant." });
  }
};