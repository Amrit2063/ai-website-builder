import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import LoginModel from "./LoginModel";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const { userData } = useSelector((state) => state.user);
  const [openLogin, setOpenLogin] = useState(false);

  const navigate = useNavigate();
  return (
    <div>
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
          <div className="flex justify-center gap-5 flex-col sm:flex-row sm:gap-10">
            <button
              className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition sm:mt-12 cursor-pointer"
              onClick={() => navigate("/generate")}
            >
              Create Website
            </button>
          </div>
        ) : (
          <button
            className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12"
            onClick={() => setOpenLogin(true)}
          >
            Get Started
          </button>
        )}
      </section>

      {/* Login Modal */}
      {openLogin && (
        <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
}

export default HeroSection;
