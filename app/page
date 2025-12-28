"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const [ingredients, setIngredients] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetchIngredients();
    }
  }, [session]);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ingredients');
      const data = await response.json();
      setIngredients(data.ingredients);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
    setLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900">
        <h1 className="text-4xl font-bold text-white mb-8">Dawning Ingredient Tracker</h1>
        <button
          onClick={() => signIn("bungie")}
          className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Sign in with Bungie
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {session.user.name}</h1>
            <p className="text-gray-300 mt-2">Your Dawning Ingredients</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>

        {loading && <p className="text-white text-center">Loading ingredients...</p>}

        {ingredients && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(ingredients).map(([hash, data]) => (
              <div
                key={hash}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
                  {/* You'll add ingredient icons here from your Supabase bucket */}
                  <span className="text-2xl">🎁</span>
                </div>
                <p className="text-white font-semibold text-sm">{data.name}</p>
                <p className="text-yellow-400 text-xl font-bold">{data.count}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={fetchIngredients}
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mx-auto block"
        >
          Refresh Ingredients
        </button>
      </div>
    </div>
  );
}
