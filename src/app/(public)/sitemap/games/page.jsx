"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ChevronRight } from "lucide-react";
import axios from "@/lib/axios";

// Game Card: Only title, description, image, and link
const GameCard = ({ game, index }) => {
  // Clean description: remove HTML tags and trim
  const cleanDescription = game.description
    ? game.description.replace(/<[^>]*>/g, "").trim() ||
      "No description available."
    : "No description available.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
      }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* Game Image */}
      <div className="relative overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
        {game.image ? (
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>
      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {game.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3">
          {cleanDescription}
        </p>
        {game.link ? (
          <a
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-300"
          >
            Play Now
            <ChevronRight className="w-4 h-4" />
          </a>
        ) : (
          <span className="mt-auto text-xs text-gray-400 italic">
            No link available
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch games from API
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/games?limit=1000");
        setGames(res.data?.data || []);
      } catch (err) {
        setError("Failed to load games.");
        setGames([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-6 leading-tight">
            Game Library
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover amazing games across all genres and platforms.{" "}
            <span className="text-purple-600 font-semibold">
              Start your adventure today!
            </span>
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Loading games...
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch the latest games
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Failed to load games
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No games found
            </h3>
            <p className="text-gray-500">
              No games are available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {games.map((game, idx) => (
              <GameCard key={game.id} game={game} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
