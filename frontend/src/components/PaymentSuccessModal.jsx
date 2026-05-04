import React, { useEffect, useState } from "react";
import { CheckCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";

const PaymentSuccessModal = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAndRefreshPayment = async () => {
      try {
        // Extract session ID from URL if present
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");

        if (sessionId) {
          const res = await axios.post(
            "/api/billing/verify-payment",
            { sessionId },
            { withCredentials: true }
          );
        }

        // Refresh user data to get updated credits
        const userRes = await axios.get("/api/user/me", {
          withCredentials: true,
        });
        dispatch(setUserData(userRes.data));
      } catch (error) {
        console.error("Failed to verify or refresh after payment:", error);
      }
    };

    verifyAndRefreshPayment();
  }, [dispatch]);

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
              Payment Successful 🎉
            </h2>

            {/* Description */}
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Your payment has been processed successfully. Your subscription or
              credits are now active and ready to use.
            </p>

            {/* Success Badge */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl py-3 px-4 mb-6">
              <p className="text-green-400 font-medium text-sm">
                Transaction completed securely
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

export default PaymentSuccessModal;
