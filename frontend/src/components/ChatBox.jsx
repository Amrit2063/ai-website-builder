import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { X, Send, Loader2, Sparkles } from "lucide-react";
import { loadingStages } from "../../utils/constant";

function ChatBox({
  website,
  setShowChat,
  initializeCodeState,
  formatCode,
  id,
}) {
  const [messages, setMessages] = useState(website?.conversation || []);
  const [prompt, setPrompt] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages(website?.conversation || []);
  }, [website?.conversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingStep, isGenerating]);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();

      if (!prompt.trim() || isGenerating) {
        return;
      }

      const userPrompt = prompt.trim();

      setMessages((prev) => [
        ...(prev || []),
        { role: "user", content: userPrompt },
      ]);

      setPrompt("");
      setIsGenerating(true);
      setLoadingStep(0);
      setError("");

      let interval;

      try {
        interval = setInterval(() => {
          setLoadingStep((prev) =>
            prev < loadingStages.length - 1 ? prev + 1 : prev,
          );
        }, 1800);

        const response = await axios.put(
          `/api/website/update/${id}`,
          { prompt: userPrompt },
          { withCredentials: true },
        );

        clearInterval(interval);

        // Properly extract backend response
        const { code, message, remainingCredits } = response.data || {};

        if (!code) {
          throw new Error("No updated code returned from server.");
        }

        // Beautify returned HTML/CSS/JS code
        const beautifiedCode = formatCode ? formatCode(code) : code;

        // Update preview/editor
        if (typeof initializeCodeState === "function") {
          initializeCodeState(beautifiedCode);
        }

        // Add AI response
        setMessages((prev) => [
          ...(prev || []),
          {
            role: "ai",
            content:
              `${message || "Website updated successfully."}` +
              (remainingCredits !== undefined
                ? `\nRemaining Credits: ${remainingCredits}`
                : ""),
          },
        ]);
      } catch (err) {
        clearInterval(interval);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An error occurred while updating website data.";

        setError(errorMessage);

        setMessages((prev) => [
          ...(prev || []),
          {
            role: "ai",
            content: `Error: ${errorMessage}`,
          },
        ]);
      } finally {
        setIsGenerating(false);
        setLoadingStep(0);
      }
    },
    [prompt, isGenerating, id, setMessages, formatCode, initializeCodeState],
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-white/10 flex items-center justify-between">
        <span className="font-semibold truncate">
          {website?.title || "Untitled"}
        </span>
      </header>

      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end p-2 border-b border-white/10">
        <button
          onClick={() => setShowChat?.(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] ${
                m.role === "user" ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "bg-white text-black"
                    : "bg-white/5 border border-white/10 text-zinc-200"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isGenerating && (
            <div className="max-w-[85%] mr-auto">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm">
                <div className="flex items-center gap-2 mb-3 font-medium">
                  <Loader2 className="animate-spin" size={14} />
                  {loadingStages[loadingStep]}
                </div>

                <div className="space-y-1">
                  {loadingStages.map((step, i) => (
                    <div
                      key={i}
                      className={`text-xs flex items-center gap-2 ${
                        i <= loadingStep ? "text-green-400" : "text-zinc-500"
                      }`}
                    >
                      <Sparkles size={10} />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Inline Error */}
          {error && (
            <div className="text-red-400 text-sm border border-red-500/20 bg-red-500/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-white/10"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              placeholder="Describe changes..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition flex items-center justify-center cursor-pointer"
              aria-label="Send message"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
