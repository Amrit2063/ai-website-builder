import { ArrowLeft, Check, Rocket, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedid, setCopiedId] = useState(null);

  const handleDeploy = async (id) => {
    try {
      const result = await axios.get(`/api/website/deploy/${id}`, {
        withCredentials: true,
      });
      window.open(`${result.data.deployUrl}`, "_blank");
      setWebsites(
        (prev) =>
          prev.map((w) =>
            w._id === id
              ? { ...w, deployed: true, deployUrl: result.data.url }
              : w,
          ), ////check here
      );
    } catch (error) {
      console.error("Error deploying website:", error);
    }
  };
  useEffect(() => {
    const handleGetAllWebsites = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`/api/website/get-all`, {
          withCredentials: true,
        });
        console.log(result.data);
        setWebsites(result.data || []);
      } catch (error) {
        console.error("Error fetching websites:", error);
        setError(
          error.response?.data?.message ||
            "An error occurred while fetching websites.",
        );
      } finally {
        setLoading(false);
      }
    };

    handleGetAllWebsites();
  }, []);

  const handleCopy = async (site) => {
    await navigator.clipboard.writeText(site.deployUrl);
    setCopiedId(site._id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a103d] to-[#09090f] text-white">
      {/* Top Navbar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>

          <button
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold cursor-pointer hover:scale-105 transition"
            onClick={() => navigate("/generate")}
          >
            + Create New Website
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm text-zinc-400 mb-1">Welcome Back</p>
          <h1 className="text-3xl font-bold">{userData?.name || "User"}</h1>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="mt-24 text-center text-zinc-400">
            Loading Your Websites...
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-24 text-center text-red-400">{error}</div>
        )}

        {/* Empty State */}
        {websites.length === 0 && !loading && !error && (
          <div className="mt-24 text-center text-zinc-400">
            You have not created any websites yet.
          </div>
        )}

        {/* Website Cards */}
        {!loading && !error && websites?.length > 0 && (
          <div className="grid rid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {websites.map((w, i) => {
              const copied = copiedid === w._id;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col"
                >
                  {/* Website Preview */}
                  <div
                    className="relative h-40 bg-black cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/editor/${w._id}`)}
                  >
                    <iframe
                      srcDoc={w.latestCode}
                      title={w.title}
                      className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>

                  {/* Website Details */}
                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <h3 className="text-base font-semibold line-clamp-2">
                      {w.title}
                    </h3>

                    <p className="text-xs text-zinc-400">
                      Last Updated{" "}
                      {new Date(w.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {/* Deploy / Share Button */}
                    {!w.deployed ? (
                      <button
                        className="mt-auto flex items-center justify-center gap-2
                                 px-4 py-2 rounded-xl text-sm font-semibold
                                 bg-gradient-to-r from-indigo-500 to-purple-500
                                 hover:scale-105 transition"
                        onClick={() => handleDeploy(w._id)}
                      >
                        <Rocket size={18} />
                        Deploy
                      </button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(w)}
                        className={`mt-auto flex items-center justify-center gap-2
    px-4 py-2 rounded-xl text-sm font-medium
    transition-all
    ${
      copied
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : "bg-white/10 hover:bg-white/20 border border-white/10"
    }`}
                      >
                        {copied ? (
                          <>
                            <Check size={14} />
                            Link Copied
                          </>
                        ) : (
                          <>
                            <Share2 size={14} />
                            Share Link
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
