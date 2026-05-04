import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Import your Redux action from the correct path
// Update this path based on your actual project structure
import { setUserData } from "../redux/userSlice";
import LoginModel from "./LoginModel";

function Navbar() {
  // Get authenticated user data from Redux store
  const { userData } = useSelector((state) => state.user);

  // Controls profile dropdown visibility
  const [openLogin, setOpenLogin] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  // Reference for detecting outside clicks
  const profileRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close profile dropdown when user clicks outside of it
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

  // Handles secure logout process
  const handleLogout = async () => {
    try {
      // Logout API call
      await axios.get("/api/auth/logout", {
        withCredentials: true,
      });

      // Clear user data from Redux store
      dispatch(setUserData(null));

      // Close dropdown after logout
      setOpenProfile(false);

      // Show success notification
      toast.success("Logged out successfully", {
        autoClose: 3000,
      });

      // Redirect user to homepage after logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);

      // Show error toast if logout fails
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="text-lg font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            WebNest.ai
          </div>

          <div className="flex items-center gap-5">
            {/* Pricing navigation link */}
            <button
              className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </button>

            {/* Credits display for logged-in users */}
            {userData && (
              <button
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition"
                onClick={() => navigate("/pricing")}
              >
                <Coins size={14} className="text-yellow-400" />
                <span className="text-zinc-300">Credits</span>
                <span>{userData.credits || 0}</span>
                <span className="font-semibold">+</span>
              </button>
            )}

            {/* Guest user CTA */}
            {!userData ? (
              <button
                className="px-4 py-2 rounded-lg border border-white/20 cursor-pointer hover:bg-white/10 text-sm"
                onClick={() => setOpenLogin(true)}
              >
                Get Started
              </button>
            ) : (
              /* Logged-in user profile menu */
              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center cursor-pointer"
                  onClick={() => setOpenProfile((prev) => !prev)}
                >
                  <img
                    src={
                      userData.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userData.name || "User",
                      )}`
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
                      {/* User details */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium truncate">
                          {userData.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {userData.email}
                        </p>
                      </div>

                      {/* Credits section */}
                      <button
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm border-b border-white/10 hover:bg-white/5 cursor-pointer"
                        onClick={() => navigate("/pricing")}
                      >
                        <Coins size={14} className="text-yellow-400" />
                        <span className="text-zinc-300">Credits</span>
                        <span>{userData.credits || 0}</span>
                        <span className="font-semibold">+</span>
                      </button>

                      {/* Dashboard navigation */}
                      <button
                        className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 cursor-pointer"
                        onClick={() => navigate("/dashboard")}
                      >
                        Dashboard
                      </button>

                      {/* Logout action */}
                      <button
                        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 cursor-pointer"
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
      </motion.nav>

      {/* Login Modal */}
      {openLogin && (
        <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </>
  );
}

export default Navbar;
