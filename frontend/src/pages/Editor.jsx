import axios from "axios";
import beautify from "js-beautify";
import {
  Code2,
  Monitor,
  Rocket,
  Send,
  Loader2,
  Sparkles,
  Undo2,
  Redo2,
  Save,
  X,
  Menu,
} from "lucide-react";
import MonacoEditor from "react-monaco-editor";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

// =============================
// LOADING STATES
// =============================
const loadingStages = [
  "Analyzing prompt...",
  "Planning website structure...",
  "Generating premium UI...",
  "Optimizing responsiveness...",
  "Finalizing production code...",
];

// =============================
// CODE FORMATTER
// =============================
const formatCode = (rawCode) => {
  if (!rawCode) return "";

  return beautify.html(rawCode, {
    indent_size: 2,
    wrap_line_length: 100,
    preserve_newlines: true,
    max_preserve_newlines: 2,
    end_with_newline: true,
    indent_inner_html: true,
  });
};

// =============================
// MAIN EDITOR COMPONENT
// =============================
const Editor = () => {
  // =============================
  // ROUTE PARAMS
  // =============================
  const { id } = useParams();

  // =============================
  // STATE MANAGEMENT
  // =============================
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  const [code, setCode] = useState("");
  const [savedCode, setSavedCode] = useState("");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [showChat, setShowChat] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // =============================
  // DERIVED STATE
  // =============================
  const hasUnsavedChanges = code !== savedCode;

  // =============================
  // INITIALIZE CODE STATE
  // =============================
  const initializeCodeState = (newCode) => {
    setCode(newCode);
    setSavedCode(newCode);
    setHistory([]);
    setRedoStack([]);
  };

  // =============================
  // CODE CHANGE MANAGEMENT
  // =============================
  const handleCodeChange = (val) => {
    if (val === code) return;

    setHistory((prev) => [...prev, code]);
    setRedoStack([]);
    setCode(val);
  };

  const handleUndo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;

      const previousCode = prevHistory[prevHistory.length - 1];
      setRedoStack((prevRedo) => [code, ...prevRedo]);
      setCode(previousCode);

      return prevHistory.slice(0, -1);
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const nextCode = redoStack[0];
    setHistory((prev) => [...prev, code]);
    setCode(nextCode);
    setRedoStack((prev) => prev.slice(1));
  };

  const handleBeautifyCurrentCode = () => {
    const beautified = formatCode(code);
    handleCodeChange(beautified);
  };

  // =============================
// WEBSITE ACTIONS
// =============================
const handleDeploy = async () => {
  try {
    if (!website?._id) {
      console.error("Website ID is missing.");
      setError("Website ID is missing. Please refresh and try again.");
      return;
    }

    const result = await axios.get(`/api/website/deploy/${website._id}`, {
      withCredentials: true,
    });

    const deployUrl = result.data.url;

    if (!deployUrl) {
      console.error("Deployment URL not found.");
      return;
    }

    // Open deployment in a new tab
    window.open(deployUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Error deploying website:", error);

    setError(
      error.response?.data?.message ||
        "Failed to deploy website. Please try again."
    );
  }
};

  const handleSaveCode = async () => {
    if (!hasUnsavedChanges || isSaving) return;

    try {
      setIsSaving(true);

      const formattedCode = formatCode(code);

      await axios.put(
        `/api/website/safe-save/${id}`,
        { code: formattedCode },
        { withCredentials: true },
      );

      setCode(formattedCode);
      setSavedCode(formattedCode);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save code changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPreviewInNewTab = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // =============================
  // AI WEBSITE UPDATE SYSTEM
  // =============================
  const handleUpdate = async () => {
    if (!prompt.trim() || isGenerating) return;

    const userPrompt = prompt;

    setMessages((m) => [...m, { role: "user", content: userPrompt }]);
    setPrompt("");
    setIsGenerating(true);
    setLoadingStep(0);

    let interval;

    try {
      interval = setInterval(() => {
        setLoadingStep((prev) =>
          prev < loadingStages.length - 1 ? prev + 1 : prev,
        );
      }, 1800);

      const result = await axios.put(
        `/api/website/update/${id}`,
        { prompt: userPrompt },
        { withCredentials: true },
      );

      clearInterval(interval);

      const beautifiedCode = formatCode(result.data.code);

      setMessages((m) => [...m, { role: "ai", content: result.data.message }]);

      initializeCodeState(beautifiedCode);
    } catch (error) {
      clearInterval(interval);

      setError(
        error.response?.data?.message ||
          "An error occurred while updating website data.",
      );
    } finally {
      setIsGenerating(false);
      setLoadingStep(0);
    }
  };

  // =============================
  // FETCH WEBSITE DATA
  // =============================
  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(`/api/website/get-by-id/${id}`, {
          withCredentials: true,
        });

        setWebsite(result.data);

        const formattedCode = formatCode(result.data.latestCode);
        initializeCodeState(formattedCode);

        setMessages(result.data.conversation || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "An error occurred while fetching website data.",
        );
      }
    };

    if (id) handleGetWebsite();
  }, [id]);

  // =============================
  // FORM SUBMISSION
  // =============================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    await handleUpdate();
  };

  // =============================
  // ERROR SCREEN
  // =============================
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  // =============================
  // LOADING SCREEN
  // =============================
  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  // =============================
  // MAIN UI
  // =============================
  return (
    <div className="h-screen w-screen bg-black text-white flex overflow-hidden">
      {/* MOBILE BACKDROP */}
      {showChat && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowChat(false)}
        />
      )}

      {/* CHAT SIDEBAR */}
      <aside
        className={`
          fixed lg:relative
          top-0 left-0
          h-full
          w-[85%] sm:w-[400px] lg:w-[350px]
          bg-black
          border-r border-white/10
          z-50
          transform transition-transform duration-300
          ${showChat ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        <Header website={website} />

        <div className="lg:hidden flex justify-end p-2 border-b border-white/10">
          <button
            onClick={() => setShowChat(false)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <Chat
          messages={messages}
          prompt={prompt}
          setPrompt={setPrompt}
          handleSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          loadingStep={loadingStep}
        />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative">
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-gray-900">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChat(!showChat)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10"
            >
              <Menu size={18} />
            </button>

            <span className="text-xs text-zinc-400">
              {showCode ? "Code Editor" : "Live Preview"}
            </span>

            {hasUnsavedChanges && showCode && (
              <span className="text-xs text-yellow-400 font-medium">
                Unsaved Changes
              </span>
            )}
          </div>

          <div className="flex gap-2 items-center">
            {!website.deployed && (
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition"
                onClick={handleDeploy}
              >
                <Rocket size={14} />
                Deploy
              </button>
            )}

            <button
              onClick={() => setShowCode(true)}
              className={`p-2 rounded-lg ${
                showCode ? "bg-white/10 text-indigo-400" : "hover:bg-white/10"
              }`}
            >
              <Code2 size={18} />
            </button>

            <button
              onClick={handleOpenPreviewInNewTab}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <Monitor size={18} />
            </button>
          </div>
        </div>

        {/* LIVE PREVIEW */}
        <div className="flex-1 bg-black">
          <iframe
            title="Live Preview"
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={code}
          />
        </div>

        {/* CODE EDITOR */}
        <div
          className={`absolute top-0 right-0 h-full w-full sm:w-[75%] lg:w-[55%] bg-[#0d1117] border-l border-white/10 shadow-2xl transform transition-transform duration-500 z-50 ${
            showCode ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-gray-900">
            <span className="text-sm font-medium">Code Editor</span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40"
              >
                <Undo2 size={16} />
              </button>

              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40"
              >
                <Redo2 size={16} />
              </button>

              <button
                onClick={handleSaveCode}
                disabled={!hasUnsavedChanges || isSaving}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Save size={14} />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={handleBeautifyCurrentCode}
                className="px-3 py-1.5 rounded-lg bg-green-600 text-sm hover:bg-green-500 transition"
              >
                Beautify
              </button>

              <button
                onClick={() => setShowCode(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <MonacoEditor
            width="100%"
            height="calc(100% - 56px)"
            language="html"
            theme="vs-dark"
            value={code}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
            }}
            onChange={handleCodeChange}
          />
        </div>
      </div>
    </div>
  );
};

// =============================
// HEADER COMPONENT
// =============================
function Header({ website }) {
  return (
    <header className="bg-gray-800 p-4 border-b border-white/10">
      <span className="font-semibold">{website?.title || "Untitled"}</span>
    </header>
  );
}

// =============================
// CHAT COMPONENT
// =============================
function Chat({
  messages,
  prompt,
  setPrompt,
  handleSendMessage,
  isGenerating,
  loadingStep,
}) {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingStep]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] ${
              m.role === "user" ? "ml-auto" : "mr-auto"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-white text-black"
                  : "bg-white/5 border text-zinc-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="max-w-[85%] mr-auto">
            <div className="p-3 rounded-xl bg-white/5 border text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="animate-spin" size={14} />
                {loadingStages[loadingStep]}
              </div>

              {loadingStages.map((step, i) => (
                <div
                  key={i}
                  className={`text-xs flex gap-2 ${
                    i <= loadingStep ? "text-green-400" : "text-zinc-500"
                  }`}
                >
                  <Sparkles size={10} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="Describe changes..."
            className="flex-1 px-3 py-2 bg-gray-800 border rounded-lg"
          />

          <button
            type="submit"
            disabled={isGenerating}
            className="p-2 bg-blue-600 rounded-lg"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Editor;
