import React, { useState } from "react";
import { CheckCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const PaymentCancelModal = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-3xl shadow-2xl p-8 text-center"
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-5">
              <CheckCircle
                size={72}
                className="text-green-400 drop-shadow-lg"
              />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-white mb-3">
              Payment Failed
            </h2>

            {/* Description */}
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Your payment has been cancelled. Your subscription or credits are
              not added to your account.
            </p>

            {/* Success Badge */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl py-3 px-4 mb-6">
              <p className="text-red-400 font-medium text-sm">
                Transaction failed
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoHome}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-black font-semibold hover:scale-[1.02] transition cursor-pointer"
              >
                <Home size={18} />
                Go to Home Page
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentCancelModal;
