import React, { useState } from "react";
import axios from "axios";
import beautify from "js-beautify";
import MonacoEditor from "react-monaco-editor";
import {
  Loader2,
  Undo2,
  Redo2,
  Save,
  X,
} from "lucide-react";

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
// CODE EDITOR COMPONENT
// =============================
const CodeEditor = ({
  id,
  code = "",
  setCode,
  savedCode = "",
  setSavedCode,
  history = [],
  setHistory,
  redoStack = [],
  setRedoStack,
  showCode = false,
  setShowCode,
  setError,
}) => {
  // =============================
  // LOCAL STATE
  // =============================
  const [isSaving, setIsSaving] = useState(false);

  // Detect unsaved changes
  const hasUnsavedChanges = code !== savedCode;

  // =============================
  // CODE CHANGE HANDLER
  // =============================
  const handleCodeChange = (val) => {
    // Prevent errors if state handlers are missing
    if (!setCode || !setHistory || !setRedoStack) return;
    if (val === code) return;

    setHistory((prev) => [...prev, code]);
    setRedoStack([]);
    setCode(val);
  };

  // =============================
  // UNDO FUNCTIONALITY
  // =============================
  const handleUndo = () => {
    if (!setHistory || !setRedoStack || !setCode) return;
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;

      const previousCode = prevHistory[prevHistory.length - 1];
      setRedoStack((prevRedo) => [code, ...prevRedo]);
      setCode(previousCode);

      return prevHistory.slice(0, -1);
    });
  };

  // =============================
  // REDO FUNCTIONALITY
  // =============================
  const handleRedo = () => {
    if (!setHistory || !setRedoStack || !setCode) return;
    if (redoStack.length === 0) return;

    const nextCode = redoStack[0];
    setHistory((prev) => [...prev, code]);
    setCode(nextCode);
    setRedoStack((prev) => prev.slice(1));
  };

  // =============================
  // BEAUTIFY CURRENT CODE
  // =============================
  const handleBeautifyCurrentCode = () => {
    const beautified = formatCode(code);
    handleCodeChange(beautified);
  };

  // =============================
  // SAVE CODE TO BACKEND
  // =============================
  const handleSaveCode = async () => {
    if (!setCode || !setSavedCode) return;
    if (!hasUnsavedChanges || isSaving) return;

    try {
      setIsSaving(true);

      const formattedCode = formatCode(code);

      await axios.put(
        `/api/website/safe-save/${id}`,
        { code: formattedCode },
        { withCredentials: true }
      );

      // Update local state after successful save
      setCode(formattedCode);
      setSavedCode(formattedCode);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to save code changes."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`absolute top-0 right-0 h-full w-full sm:w-[75%] lg:w-[55%] bg-[#0d1117] border-l border-white/10 shadow-2xl transform transition-transform duration-500 z-50 ${
        showCode ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* ============================= */}
      {/* TOP TOOLBAR */}
      {/* ============================= */}
      <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-gray-900">
        <span className="text-sm font-medium">Code Editor</span>

        <div className="flex items-center gap-2">
          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
          >
            <Undo2 size={16} />
          </button>

          {/* Redo Button */}
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
          >
            <Redo2 size={16} />
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveCode}
            disabled={!hasUnsavedChanges || isSaving}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Save size={14} />
            )}
            {isSaving ? "Saving..." : "Save"}
          </button>

          {/* Beautify Button */}
          <button
            onClick={handleBeautifyCurrentCode}
            className="px-3 py-1.5 rounded-lg bg-green-600 text-sm hover:bg-green-500 transition cursor-pointer"
          >
            Beautify
          </button>

          {/* Close Editor */}
          <button
            onClick={() => setShowCode(false)}
            className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
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
  );
};

export default CodeEditor;
