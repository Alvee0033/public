"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Calendar,
  RefreshCw,
  AlertCircle,
  Trophy,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function GamesPage() {
  // Get user from Redux state
  const user = useAppSelector((state) => state.auth.user);
  const studentId = user?.student_id;
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const id = studentId;

      if (!id) {
        throw new Error("Student ID not found");
      }

      // Step 2: Get assigned games for the student
      const gamesResponse = await axios.get(`/games/assign/${id}`);
      const assignedGames = Array.isArray(gamesResponse.data?.data?.games)
        ? gamesResponse.data.data.games
        : [];

      // Step 3: Use the nested games object directly
      setGames(assignedGames);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError(error.message || "Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchData();
    }
  }, [studentId]);

  const handleRetry = () => {
    fetchData();
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2)
      return "bg-gradient-to-r from-green-400 to-emerald-500 text-white";
    if (difficulty <= 4)
      return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
    return "bg-gradient-to-r from-red-400 to-pink-500 text-white";
  };

  const getDifficultyLabel = (difficulty) => {
    if (difficulty <= 2) return "Easy";
    if (difficulty <= 4) return "Medium";
    return "Hard";
  };

  const getRandomCardGradient = (index) => {
    const gradients = [
      "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500",
      "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500",
      "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600",
      "bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500",
      "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500",
      "bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600",
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2 bg-gradient-to-r from-purple-200 to-pink-200" />
            <Skeleton className="h-4 w-96 bg-gradient-to-r from-blue-200 to-purple-200" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="h-80 bg-white/70 backdrop-blur-sm border-0 shadow-xl"
              >
                <CardHeader className="pb-3">
                  <Skeleton className="h-32 w-full rounded-md mb-4 bg-gradient-to-r from-purple-200 to-pink-200" />
                  <Skeleton className="h-5 w-3/4 mb-2 bg-gradient-to-r from-blue-200 to-purple-200" />
                  <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-green-200 to-blue-200" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2 bg-gradient-to-r from-yellow-200 to-orange-200" />
                  <Skeleton className="h-4 w-2/3 mb-4 bg-gradient-to-r from-pink-200 to-red-200" />
                  <Skeleton className="h-8 w-full bg-gradient-to-r from-indigo-200 to-purple-200" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Alert
            variant="destructive"
            className="mb-6 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-xl"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="ml-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                Assigned Games
              </h1>
              <p className="text-gray-600 text-lg">
                {games.length > 0
                  ? `You have ${games.length} amazing game${
                      games.length === 1 ? "" : "s"
                    } assigned`
                  : "No games currently assigned"}
              </p>
            </div>
          </div>

          {games.length > 0 && (
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                <Trophy className="h-4 w-4 mr-2" />
                {games.length} Active Games
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 shadow-lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          )}
        </div>

        {/* Games Grid */}
        {games.length === 0 ? (
          <Card className="text-center py-16 bg-white/70 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="pt-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                No Games Assigned
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                You don't have any games assigned at the moment. Check back
                later or contact your instructor.
              </p>

              <div className="flex flex-col gap-5">
                <div>
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg px-6 py-3"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check Again
                  </Button>
                </div>

                <a
                  href="https://games.tutorsplan.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg px-6 py-3"
                  >
                    <Gamepad2 className="h-4 w-4 mr-2" />
                    Play as You Like
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game, index) => (
              <Card
                key={game.id}
                className="hover:shadow-2xl transition-all duration-300 group overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:scale-105"
              >
                {/* Colorful Header Bar */}
                <div className={`h-2 ${getRandomCardGradient(index)}`} />

                {/* Game Image */}
                {game.games?.image && game.games.image !== "" && (
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={game.games.image || "/placeholder.svg"}
                      alt={game.games.title || `Game ${game.games.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `/placeholder.svg?height=200&width=300&text=Game+${game.games.id}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl font-bold group-hover:text-purple-600 transition-colors line-clamp-2 text-gray-800">
                        {game.games?.title || `Game ${game.games?.id}`}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-3 text-gray-600">
                        <div className="p-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full">
                          <Calendar className="h-3 w-3 text-white" />
                        </div>
                        Assigned{" "}
                        {game.created_at
                          ? new Date(game.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "-"}
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {game.games?.description && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg mb-4">
                      <p
                        className="text-sm text-gray-700 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: game.games.description,
                        }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 text-xs font-semibold shadow-md">
                      <Zap className="h-3 w-3 mr-1" />
                      ID: {game.games?.id}
                    </Badge>
                    {game.games?.link ? (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg px-4 py-2 font-semibold"
                        asChild
                      >
                        <a
                          href={game.games.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Play Now
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled
                        className="bg-gray-300 text-gray-500 px-4 py-2"
                      >
                        Play Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
