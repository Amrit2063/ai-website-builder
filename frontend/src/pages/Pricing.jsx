import React, { useState } from "react";
import { ArrowLeft, Coins, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import axios from "axios";
import {plans} from "../../utils/constant"
import { toast } from "react-toastify";

const Pricing = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState("");

  const handleBuy = async (planKey) => {

    if (!userData?._id) {
      navigate("/login");
      return;
    }

    if (planKey === "free") {
      navigate("/dashboard");
      return;
    }

    setLoading(planKey);

    try {
      const { data } = await axios.post(
        "/api/billing",
        { planType: planKey },
        { withCredentials: true },
      );

      if (data?.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        toast("Payment session could not be created.");
      }
    } catch (error) {
      toast(
        error.response?.data?.message ||
          "Something went wrong while processing payment.",
      );
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white px-6 pt-16 pb-24">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="relative z-10 mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl mx-auto text-center mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-zinc-400 text-lg">
          Buy credits once. Build anytime.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, i) => (
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ y: -14, scale: 1.03 }}
            className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all ${
              p.popular
                ? "border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30"
                : "border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"
            }`}
          >
            {/* Popular Badge */}
            {p.popular && (
              <span className="absolute top-5 right-5 px-3 py-1 text-xs rounded-full bg-indigo-500">
                Most Popular
              </span>
            )}

            {/* Plan Info */}
            <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
            <p className="text-zinc-400 mb-4">{p.description}</p>

            {/* Price */}
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-bold">{p.price}</span>
              <span className="text-sm text-zinc-400 mb-1">/month</span>
            </div>

            {/* Credits */}
            <div className="flex items-center gap-2 mb-8">
              <Coins size={18} className="text-yellow-400" />
              <span className="font-semibold">{p.credits} credits</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-10">
              {p.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
                  <Check size={16} className="text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={loading === p.key}
              onClick={() => handleBuy(p.key)}
              className={`w-full py-3 rounded-xl font-semibold transition cursor-pointer ${
                p.popular
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-white/10 hover:bg-white/20"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading === p.key ? "Processing..." : p.button}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
