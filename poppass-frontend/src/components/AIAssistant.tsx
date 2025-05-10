"use client";

import React, { useState, useCallback } from 'react';
import AIAssistantButton from './AIAssistantButton';
import AIChatModal from './AIChatModal';

const AIAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  // This function will be passed to the modal and will call YOUR backend
  const handleSendMessageToAPI = async (query: string): Promise<string> => {
    console.log("Sending query to backend:", query);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        console.error("Backend URL is not configured on the frontend!");
        throw new Error("Assistant is currently unavailable. Please try again later.");
      }

      const response = await fetch(`${backendUrl}/api/ask-openai`, { // Your new backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to get response from AI assistant." }));
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.reply; // Assuming your backend returns { reply: "..." }

    } catch (error: any) {
      console.error("Error calling backend for AI response:", error);
      // Provide a more user-friendly error message
      if (error.message.includes("Failed to get response")) {
        throw new Error("The AI assistant couldn't fetch a response. Please try again.");
      }
      throw new Error("Sorry, I'm having trouble connecting. Please try again later.");
    }
  };

  return (
    <>
      {!isChatOpen && <AIAssistantButton onClick={toggleChat} />}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={toggleChat}
        onSendMessage={handleSendMessageToAPI}
      />
    </>
  );
};

export default AIAssistant;