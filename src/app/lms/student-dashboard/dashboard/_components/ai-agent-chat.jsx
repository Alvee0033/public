"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

export function AIAgentChat({ isOpen, onClose }) {
  const userId = useAppSelector((state) => state.user.userId);

  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "bot",
      content:
        "Hi! 👋 I'm your ScholarPASS AI Agent. I'm here to help you complete your profile by asking a few quick questions. This will help us personalize your learning experience. Ready to get started?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [liveMentorStatus, setLiveMentorStatus] = useState("online");
  const [missingTags, setMissingTags] = useState([]);
  const [answeredTags, setAnsweredTags] = useState({});
  const [currentTag, setCurrentTag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch missing tags on mount
  useEffect(() => {
    if (isOpen && userId) {
      fetchMissingTags();
    }
  }, [isOpen, userId]);

  const fetchMissingTags = async () => {
    try {
      setIsLoading(true);

      // Get auth token from localStorage
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(`/api/tags/missing/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data", data);
      if (data.success) {
        let extractedTags = [];

        // Handle both new API structure (categories) and fallback structure (simple array)
        if (data.missingTagNames && Array.isArray(data.missingTagNames)) {
          // New API structure - use the extracted tag names
          extractedTags = data.missingTagNames;
        } else if (Array.isArray(data.data)) {
          // Check if it's the new structure with categories
          if (data.data.length > 0 && data.data[0].master_tags) {
            // Extract tag names from categories
            data.data.forEach((category) => {
              if (category.master_tags && Array.isArray(category.master_tags)) {
                category.master_tags.forEach((tag) => {
                  if (tag.name) {
                    extractedTags.push(tag.name);
                  }
                });
              }
            });
          } else {
            // Fallback structure - simple array
            extractedTags = data.data;
          }
        }

        setMissingTags(extractedTags);

        if (extractedTags.length > 0) {
          // Start the conversation with the first question
          generateNextQuestion();
        }
      } else {
        toast.error(data.message || "Failed to load profile questions");
      }
    } catch (error) {
      console.error("Error fetching missing tags:", error);
      toast.error("Failed to load profile questions");
    } finally {
      setIsLoading(false);
    }
  };

  const generateNextQuestion = async () => {
    try {
      setIsTyping(true);

      // Get auth token from localStorage
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(`/api/chat/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          missingTags,
          answered: answeredTags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const { question, tag, completed } = data.data;

        if (completed) {
          // All questions answered, show completion message
          const completionMessage = {
            id: Date.now().toString(),
            type: "bot",
            content:
              "✅ Thanks! Your profile information has been updated successfully. I now have a better understanding of your learning preferences and can provide more personalized assistance.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, completionMessage]);
          setCurrentTag(null);
        } else {
          // Show the generated question
          const questionMessage = {
            id: Date.now().toString(),
            type: "bot",
            content: question,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, questionMessage]);
          setCurrentTag(tag);
        }
      } else {
        throw new Error(data.message || "Failed to generate question");
      }
    } catch (error) {
      console.error("Error generating question:", error);
      toast.error("Failed to generate question");

      // Fallback message
      const fallbackMessage = {
        id: Date.now().toString(),
        type: "bot",
        content:
          "I apologize, but I'm having trouble generating a question right now. Could you tell me a bit about your learning preferences?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // If we have a current tag, save the user's answer
    if (currentTag) {
      const newAnsweredTags = {
        ...answeredTags,
        [currentTag]: content.trim(),
      };
      setAnsweredTags(newAnsweredTags);

      // Check if this was the last question
      const remainingTags = missingTags.filter((tag) => !newAnsweredTags[tag]);
      console.log("remainingTags", remainingTags);

      if (remainingTags.length === 0) {
        // All questions answered, update the user's profile
        try {
          setIsTyping(true);

          // Get auth token from localStorage
          const token = localStorage.getItem("auth-token");
          if (!token) {
            toast.error("Authentication required. Please log in again.");
            return;
          }

          const updateResponse = await fetch(`/api/tags/update/${userId}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              answered: newAnsweredTags,
            }),
          });

          const updateData = await updateResponse.json();

          if (updateData.success) {
            const completionMessage = {
              id: Date.now().toString(),
              type: "bot",
              content:
                "✅ Thanks! Your profile information has been updated successfully. I now have a better understanding of your learning preferences and can provide more personalized assistance.",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, completionMessage]);
            setCurrentTag(null);
          } else {
            throw new Error(updateData.message || "Failed to update profile");
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          toast.error("Failed to update profile");
        } finally {
          setIsTyping(false);
        }
      } else {
        // Generate next question
        setTimeout(() => {
          generateNextQuestion();
        }, 1000);
      }
    } else {
      // No current tag, just show a helpful response
      setIsTyping(true);
      setTimeout(() => {
        const responseMessage = {
          id: Date.now().toString(),
          type: "bot",
          content:
            "Thanks for your message! I'm here to help you with your learning journey. If you have any questions about your courses or need assistance, feel free to ask!",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, responseMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  // Show loading state if we're fetching missing tags and no messages yet
  if (isLoading && messages.length === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md h-[600px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">ScholarPASS AI Agent</h3>
                <p className="text-xs opacity-90">
                  Profile Completion Assistant
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your profile questions...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">ScholarPASS AI Agent</h3>
              <p className="text-xs opacity-90">Profile Completion Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress indicator */}
        {missingTags.length > 0 && (
          <div className="px-4 py-2 bg-blue-50 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Profile Completion
              </span>
              <span className="text-xs text-blue-600">
                {Object.keys(answeredTags).length} of {missingTags.length}{" "}
                questions answered
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (Object.keys(answeredTags).length / missingTags.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[80%]">
                  {message.type === "bot" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs text-gray-500">
                        ScholarPASS AI
                      </span>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-500">
                      ScholarPASS AI is typing...
                    </span>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentTag ? "Type your answer here..." : "Ask me anything..."
              }
              onKeyPress={(e) =>
                e.key === "Enter" && handleSendMessage(inputValue)
              }
              className="flex-1"
              disabled={isTyping || isLoading}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              size="sm"
              disabled={isTyping || isLoading || !inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
