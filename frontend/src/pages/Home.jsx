import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { Coins } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginModel from "../components/LoginModel.jsx";
import { highlights } from "../../utils/constant.js";
import { setUserData } from "../redux/userSlice";

const Home = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [websites, setWebsites] = useState(null);

  const { userData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ref for profile dropdown
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });

      dispatch(setUserData(null));
      setOpenProfile(false);

      toast.success("Logged out successfully", {
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData) return;

    const handleGetAllWebsites = async () => {
      try {
        const result = await axios.get("/api/website/get-all", {
          withCredentials: true,
        });

        setWebsites(result.data || []);
      } catch (error) {
        console.error("Error fetching websites:", error);
      }
    };

    handleGetAllWebsites();
  }, [userData]);

  return (
    <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
      {/* Navbar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">GenWeb.ai</div>

          <div className="flex items-center gap-5">
            <div
              className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </div>

            {userData && (
              <div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition"
                onClick={() => navigate("/pricing")}
              >
                <Coins size={14} className="text-yellow-400" />
                <span className="text-zinc-300">Credits</span>
                <span>{userData.credits || 0}</span>
                <span className="font-semibold">+</span>
              </div>
            )}

            {!userData ? (
              <button
                className="px-4 py-2 rounded-lg border border-white/20 cursor-pointer hover:bg-white/10 text-sm"
                onClick={() => setOpenLogin(true)}
              >
                Get Started
              </button>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center cursor-pointer"
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  <img
                    src={
                      userData.avatar ||
                      `https://ui-avatars.com/api/?name=${userData.name || "User"}`
                    }
                    alt="User Avatar"
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border border-white/20 object-cover"
                  />
                </button>

                <AnimatePresence>
                  {openProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium truncate">
                          {userData.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {userData.email}
                        </p>
                      </div>

                      <button
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm border-b border-white/10 hover:bg-white/5"
                        onClick={() => navigate("/pricing")}
                      >
                        <Coins size={14} className="text-yellow-400" />
                        <span className="text-zinc-300">Credits</span>
                        <span>{userData.credits || 0}</span>
                        <span className="font-semibold">+</span>
                      </button>

                      <button
                        className="w-full px-4 py-3 text-left text-sm hover:bg-white/5"
                        onClick={() => navigate("/dashboard")}
                      >
                        Dashboard
                      </button>

                      <button
                        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="pt-44 pb-32 px-6 text-center">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Create stunning websites <br />
          <span className="bg-linear-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            with AI-powered
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
        >
          Build your online presence effortlessly with GenWeb.ai. Our AI-driven
          platform helps you create beautiful, responsive websites in minutes.
          No coding required!
        </motion.p>

        {userData ? (
          <button
            className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        ) : (
          <button
            className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12"
            onClick={() => setOpenLogin(true)}
          >
            Get Started
          </button>
        )}
      </section>

      {/* Highlights */}
      {userData && (
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl"
              >
                <h1 className="text-xl font-semibold mb-3">{highlight}</h1>
                <p className="text-sm text-zinc-400">
                  GenWeb.ai leverages cutting-edge AI technology to analyze your
                  preferences and industry trends, generating unique and
                  visually appealing website designs tailored to your needs.
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Websites Section */}
      {userData && websites?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <h3 className="text-2xl font-bold text-center mb-6">Your Websites</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {websites.slice(0, 3).map((website) => (
              <motion.div
                key={website._id}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/editor/${website._id}`)}
                className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <div className="h-40 bg-black">
                  <iframe
                    srcDoc={website.latestCode}
                    className="w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                    title={website.name}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold line-clamp-2">
                    {website.title}
                  </h3>

                  <p className="text-xs text-zinc-400">
                    Last Updated{" "}
                    {new Date(website.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-zinc-500">
        &copy; {new Date().getFullYear()} GenWeb.ai. All rights reserved.
      </footer>

      {/* Login Modal */}
      {openLogin && (
        <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
};

export default Home;
