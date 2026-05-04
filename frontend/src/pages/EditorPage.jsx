import axios from "axios";
import beautify from "js-beautify";
import { Code2, Monitor, Rocket, X, Menu, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Core components
import CodeEditor from "../components/CodeEditor";
import ChatBox from "../components/ChatBox";

// CODE FORMATTER
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

// MAIN EDITOR COMPONENT
const EditorPage = () => {
  // Route params
  const { id } = useParams();

  // Website state
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");

  // Code state
  const [code, setCode] = useState("");
  const [previewCode, setPreviewCode] = useState("");
  const [savedCode, setSavedCode] = useState("");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // UI state
  const [showChat, setShowChat] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Deploy modal state
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployUrl, setDeployUrl] = useState("");

  // Detect unsaved changes
  const hasUnsavedChanges = code !== savedCode;

  // INITIALIZE CODE STATE
  const initializeCodeState = (newCode) => {
    setCode(newCode);
    setSavedCode(newCode);
    setHistory([]);
    setRedoStack([]);
  };

  // DEPLOY WEBSITE
  const handleDeploy = async () => {
    try {
      if (!website?._id) {
        setError("Website ID is missing. Please refresh and try again.");
        return;
      }

      const result = await axios.get(`/api/website/deploy/${website._id}`, {
        withCredentials: true,
      });

      const deployedSiteUrl = result.data.url;

      if (!deployedSiteUrl) {
        setError("Deployment URL not found.");
        return;
      }

      // Show success modal instead of opening new tab
      setDeployUrl(deployedSiteUrl);
      setShowDeployModal(true);

      // Mark website as deployed
      setWebsite((prev) => ({
        ...prev,
        deployed: true,
      }));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to deploy website. Please try again.",
      );
    }
  };

  // OPEN LIVE PREVIEW IN NEW TAB
  const handleOpenPreviewInNewTab = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    setPreviewCode(code);
  }, [code]);

  // FETCH WEBSITE DATA
  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(`/api/website/get-by-id/${id}`, {
          withCredentials: true,
        });

        setWebsite(result.data);

        const formattedCode = formatCode(result.data.latestCode);
        initializeCodeState(formattedCode);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "An error occurred while fetching website data.",
        );
      }
    };

    if (id) handleGetWebsite();
  }, [id]);

  // ERROR SCREEN
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  // LOADING SCREEN
  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="h-screen w-screen bg-black text-white flex overflow-hidden">
      {/* Deploy Success Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl text-center animate-fadeIn">
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-400" size={60} />
            </div>

            <h2 className="text-2xl font-bold text-green-400 mb-3">
              Deployment Successful 🚀
            </h2>

            <p className="text-zinc-300 mb-5">
              Your website is now live and ready to share with the world.
            </p>

            <div className="bg-black/40 rounded-lg p-3 mb-4 text-sm text-indigo-300 break-all border border-white/5">
              {deployUrl}
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 py-2 rounded-lg font-semibold transition"
              >
                Visit Website
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(deployUrl);
                  toast.success("Website URL copied...");
                }}
                className="w-full py-2 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer"
              >
                Copy URL
              </button>

              <button
                onClick={() => setShowDeployModal(false)}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sidebar backdrop */}
      {showChat && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowChat(false)}
        />
      )}

      {/* Chat sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full w-[85%] sm:w-[400px] lg:w-[350px] bg-black border-r border-white/10 z-50 transform transition-transform duration-300 lg:translate-x-0 flex flex-col
          ${showChat ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <ChatBox
          website={website}
          setShowChat={setShowChat}
          initializeCodeState={initializeCodeState}
          formatCode={formatCode}
          id={id}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top toolbar */}
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
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition cursor-pointer"
                onClick={handleDeploy}
              >
                <Rocket size={14} />
                Deploy
              </button>
            )}

            <button
              onClick={() => setShowCode(true)}
              className={`p-2 rounded-lg ${
                showCode ? "bg-white/10 text-indigo-400" : "hover:bg-white/10 cursor-pointer"
              }`}
            >
              <Code2 size={18} />
            </button>

            <button
              onClick={handleOpenPreviewInNewTab}
              className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <Monitor size={18} />
            </button>
          </div>
        </div>

        {/* Live preview */}
        <div className="flex-1 bg-black">
          <iframe
            key={previewCode}
            title="Live Preview"
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={previewCode}
          />
        </div>

        {/* Modular Code Editor */}
        <CodeEditor
          id={id}
          code={code}
          setCode={setCode}
          savedCode={savedCode}
          setSavedCode={setSavedCode}
          history={history}
          setHistory={setHistory}
          redoStack={redoStack}
          setRedoStack={setRedoStack}
          showCode={showCode}
          setShowCode={setShowCode}
          setError={setError}
        />
      </div>
    </div>
  );
};

// HEADER COMPONENT
function Header({ website }) {
  return (
    <header className="bg-gray-800 p-4 border-b border-white/10">
      <span className="font-semibold">{website?.title || "Untitled"}</span>
    </header>
  );
}

export default EditorPage;
