import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

const PHASES = [
  "Analyzing your idea...",
  "Designing layout & structure...",
  "Writing HTML & CSS...",
  "Adding animations & interactions...",
  "Final quality checks...",
];

const Generate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [error, setError] = useState("");

  const handlegenerateWebsite = async () => {
    setLoading(true);
    try {
      console.log("Generation Started....");
      const result = await axios.post(
        `/api/website/generate`,
        { prompt },
        { withCredentials: true },
      );
      console.log(result);
      setProgress(100);
      setPhaseIndex(PHASES.length - 1);
      navigate(`/editor/${result.data.websiteId}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while generating the website.",
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!loading) {
      setPhaseIndex(0);
      setProgress(0);
      return;
    }
    let value = 0;
    let phase = 0;
    const interval = setInterval(() => {
      const increment =
        value < 20
          ? Math.random * 1.5
          : value < 60
            ? Math.random * 1.2
            : Math.random() * 0.6;
      value += increment;
      if (value >= 93) {
        value = 93;
      }
      phase = Math.min(
        Math.floor((value / 100) * PHASES.length),
        PHASES.length - 1,
      );
      setProgress(Math.floor(value));
      setPhaseIndex(phase);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);
  return (
    <div className="min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
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
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-4xl mb-5 font-bold leading-tight">
            Build Website
            <span className="block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {" "}
              Real AI power
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400">
            This process may take several minutes. genweb.ai focuses on quality,
            not short-term speed.
          </p>
        </motion.div>
        <div className="mb-14">
          <h1 className="text-xl font-semibold mb-2 text-white">
            Describe your website
          </h1>

          <div className="relative">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              className="w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20"
              placeholder="Describe the type of website you want to create, its purpose, and any specific features or design elements you have in mind..."
            ></textarea>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlegenerateWebsite}
            disabled={!prompt.trim() || loading}
            className={`px-14 py-4 rounded-2xl font-semibold text-lg ${
              prompt.trim() && !loading
                ? "bg-white text-black"
                : "bg-white/20 text-zinc-400 cursor-not-allowed"
            }`}
          >
            Generate Website
          </motion.button>
        </div>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto mt-12"
          >
            <div className="flex justify-between mb-2 text-xs text-zinc-400">
              <span>{PHASES[phaseIndex]}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-white to-zinc-300"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.8 }}
              />
            </div>
            <div className="text-center text-xs text-zinc-400 mt-4">
              Estimated time remaining:{" "}
              <span className="text-white font-medium">~8–12 minutes</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Generate;
