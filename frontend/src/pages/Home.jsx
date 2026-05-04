import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

// Core UI components
import Navbar from "../components/Navbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
import Highlights from "../components/Highlights.jsx";
import WebsiteCard from "../components/WebsiteCard.jsx";

const Home = () => {
  // Get authenticated user data from Redux store
  const { userData } = useSelector((state) => state.user);

  // Stores fetched user websites
  const [websites, setWebsites] = useState([]);

  // Loading state for better UX if needed later
  const [loading, setLoading] = useState(false);

  // Fetch all websites for logged-in user
  useEffect(() => {
    // Skip API call if user is not logged in
    if (!userData) return;

    const handleGetAllWebsites = async () => {
      try {
        setLoading(true);

        // Fetch user's websites from backend
        const result = await axios.get("/api/website/get-all", {
          withCredentials: true,
        });

        // Store websites safely
        setWebsites(result.data || []);
      } catch (error) {
        console.error("Error fetching websites:", error);
      } finally {
        setLoading(false);
      }
    };

    handleGetAllWebsites();
  }, [userData]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a103d] to-[#09090f] text-white overflow-hidden">
      {/* ==================== Navbar ==================== */}
      <Navbar />

      {/* ==================== Hero Section ==================== */}
      <HeroSection />

      {/* ==================== Highlights Section ==================== */}
      {/* Only visible for authenticated users */}
      {userData && <Highlights />}

      {/* ==================== User Websites Section ==================== */}
      {userData && websites.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-32">
          {/* Section title */}
          <h2 className="text-2xl font-bold text-center mb-6">Your Websites</h2>

          {/* Website cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {websites.slice(0, 3).map((website) => (
              <WebsiteCard key={website._id} website={website} />
            ))}
          </div>
        </section>
      )}

      {/* ==================== Empty State ==================== */}
      {userData && !loading && websites.length === 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-32 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            You haven't created any websites yet.
          </h2>
          <p className="text-zinc-400">
            Start building your first AI-powered website today.
          </p>
        </section>
      )}

      {/* ==================== Footer ==================== */}
      <footer className="text-center py-8 text-zinc-500 border-t border-white/5">
        &copy; {new Date().getFullYear()} GenWeb.ai. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
