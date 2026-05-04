import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

// PREMIUM LOADING STAGES
export const loadingStages = [
  "Analyzing prompt...",
  "Planning website structure...",
  "Generating premium UI...",
  "Optimizing responsiveness...",
  "Finalizing production code...",
];

const Generate = () => {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // WEBSITE GENERATION
  const handlegenerateWebsite = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await axios.post(
        `/api/website/generate`,
        { prompt },
        { withCredentials: true },
      );

      setProgress(100);
      setStageIndex(loadingStages.length - 1);

      setTimeout(() => {
        navigate(`/editor/${result.data.websiteId}`);
      }, 800);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while generating the website.",
      );
      setLoading(false);
    }
  };

  // DYNAMIC PREMIUM LOADER
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setStageIndex(0);
      return;
    }

    let currentProgress = 0;

    const interval = setInterval(() => {
      let increment;

      if (currentProgress < 15) {
        increment = Math.random() * 4 + 2;
      } else if (currentProgress < 35) {
        increment = Math.random() * 3 + 1.5;
      } else if (currentProgress < 60) {
        increment = Math.random() * 2 + 1;
      } else if (currentProgress < 85) {
        increment = Math.random() * 1.2 + 0.5;
      } else {
        increment = Math.random() * 0.4;
      }

      currentProgress += increment;

      if (currentProgress > 95) {
        currentProgress = 95;
      }

      setProgress(Math.floor(currentProgress));

      const nextStage = Math.min(
        Math.floor((currentProgress / 100) * loadingStages.length),
        loadingStages.length - 1,
      );

      setStageIndex(nextStage);
    }, 1800);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a103d] to-[#09090f] text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={20} className="text-white" />
            </button>

            <h1 className="text-lg font-semibold text-white">
              Genweb<span className="text-zinc-400">.ai</span>
            </h1>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl mb-2 font-bold leading-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Build Websites with Just Your Prompt
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Turn your ideas into premium, production-ready websites powered by
            AI.
          </p>
        </motion.div>

        {/* PROMPT AREA */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-3 text-white">
            Describe your website
          </h2>

          <div className="relative">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              disabled={loading}
              className="w-full h-32 p-6 rounded-3xl bg-zinc-950/70 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60"
              placeholder="Describe the type of website you want to create, its purpose, design style, and key features..."
            />
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>

        {/* GENERATE BUTTON */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            onClick={handlegenerateWebsite}
            disabled={!prompt.trim() || loading}
            className={`px-14 py-4 rounded-2xl font-semibold text-lg flex items-center gap-3 transition-all cursor-pointer ${
              prompt.trim() && !loading
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl"
                : "bg-white/20 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Sparkles className="animate-pulse" size={20} />
                Building...
              </>
            ) : (
              "Generate Website"
            )}
          </motion.button>
        </div>

        {/* PREMIUM AI LOADER */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto mt-14"
            >
              <div className="bg-zinc-950/50 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
                {/* Current Stage */}
                <div className="text-center mb-8">
                  <motion.div
                    key={stageIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-semibold text-white"
                  >
                    {loadingStages[stageIndex]}
                  </motion.div>

                  <p className="text-zinc-400 text-sm mt-2">
                    AI is crafting your website experience
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-zinc-400 mb-2">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut", duration: 1 }}
                    />
                  </div>
                </div>

                {/* Stage Timeline */}
                <div className="space-y-3">
                  {loadingStages.map((stage, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 text-sm transition-all ${
                        index <= stageIndex ? "text-white" : "text-zinc-500"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index < stageIndex
                            ? "bg-green-400"
                            : index === stageIndex
                              ? "bg-indigo-400 animate-pulse"
                              : "bg-zinc-700"
                        }`}
                      />

                      <span>{stage}</span>
                    </div>
                  ))}
                </div>

                {/* Estimated Time */}
                <div className="text-center text-xs text-zinc-500 mt-8">
                  Estimated completion:
                  <span className="text-white font-medium ml-2">
                    ~2–4 minutes
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Generate;
