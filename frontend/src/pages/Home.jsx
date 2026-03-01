import React, { useState } from "react";
import { motion } from "motion/react";
import LoginModel from "../components/LoginModel.jsx";

const Home = () => {
  const highlights = [
    "AI-Powered Design: Our platform uses advanced AI algorithms to generate stunning website designs tailored to your preferences and industry.",
    "Responsive Layouts: Your website will look great on any device, thanks to our responsive design templates.",
    "Production Ready Output: Get clean, production-ready code that you can easily deploy or customize further.",
  ];
  const [openLogin, setOpenLogin] = useState(false);
  return (
    <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">GenWeb.ai</div>
          <div className="flex items-center gap-5">
            <div className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer">
              Pricing
            </div>
            <button
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm"
              onClick={() => setOpenLogin(true)}
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
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
        <button
          className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12"
          onClick={() => setOpenLogin(true)}
        >
          Get Started
        </button>
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-xl"
            >
              <h1 className="text-xl font-semibold mb-3">{highlight}</h1>
              <p className="text-sm text-zinc-400">
                GenWeb.ai leverages cutting-edge AI technology to analyze your
                preferences and industry trends, generating unique and visually
                appealing website designs that are tailored to your specific
                needs. Whether you're a small business owner, a creative
                professional, or an entrepreneur, our platform ensures that your
                website stands out with a design that resonates with your target
                audience.
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      <footer className="text-center py-8 text-zinc-500">
        &copy; {new Date().getFullYear()} GenWeb.ai. All rights reserved.
      </footer>
      {openLogin && (
        <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
};

export default Home;
