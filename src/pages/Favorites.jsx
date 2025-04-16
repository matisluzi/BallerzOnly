import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { getTeamGames, getTeamDetails, getFavorites, removeFavorite } from "../api";
import GameBasketball from "../components/GameBasketball";

function Favorites() {
  // State variables will go here
  const [favorites, setFavorites] = useState([]);
  const [teamDetails, setTeamDetails] = useState({});
  const [games, setGames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorites when the component mounts
  useEffect(() => {
    setLoading(true);
    getFavorites()
      .then((response) => {
        const favs = response.favorites;
        setFavorites(favs);

        // Create two promise arrays - one for games, one for team details
        const gamePromises = favs.map((id) =>
          getTeamGames(id)
            .then((teamGames) => ({ teamId: id, games: teamGames }))
            .catch((err) => {
              console.error(`Error fetching games for team ${id}:`, err);
              return { teamId: id, games: [] };
            }),
        );

        const detailPromises = favs.map((id) =>
          getTeamDetails(id)
            .then((details) => ({ teamId: id, details }))
            .catch((err) => {
              console.error(`Error fetching details for team ${id}:`, err);
              return { teamId: id, details: null };
            }),
        );

        // Return a promise that resolves when both sets of promises are complete
        return Promise.all([
          Promise.all(gamePromises),
          Promise.all(detailPromises),
        ]);
      })
      .then(([teamGamesArray, teamDetailsArray]) => {
        // Process games data
        const gamesObj = {};
        teamGamesArray.forEach((item) => {
          gamesObj[item.teamId] = item.games;
        });
        setGames(gamesObj);

        // Process team details data
        const detailsObj = {};
        teamDetailsArray.forEach((item) => {
          detailsObj[item.teamId] = item.details;
        });
        setTeamDetails(detailsObj);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load your favorite teams. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleRemoveFavorite = (teamId) => {
    removeFavorite(teamId)
      .then(() => {
        setFavorites((prev) => prev.filter((id) => id !== teamId));
      })
      .catch((err) => {
        console.error("Failed to remove favorite:", err);
      });
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-20 p-4">
        <NavBar />
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-20 p-4">
        <NavBar />
        <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 p-4">
      <NavBar />

      <h1 className="mb-6 text-2xl font-bold">Your Feed</h1>

      <div className="bg-secondary mb-6 rounded-lg p-4">
        <h2 className="mb-4 text-xl font-semibold">Your Favorite Teams</h2>
        {favorites.length > 0 ? (
          favorites.map((teamId) => (
            <div
              key={teamId}
              className="relative mb-6 rounded-lg bg-white p-4 shadow dark:bg-neutral-900/60"
            >
              {/* Remove button */}
              <button
                onClick={() => handleRemoveFavorite(teamId)}
                className="absolute top-2 right-2 text-red-500 text-lg hover:text-red-700"
                title="Remove from Favorites"
              >
                −
              </button>

              {/* Linking to ESPN */}
              {teamDetails[teamId]?.team ? (
                <h3 className="mb-3 text-lg font-semibold text-blue-600 dark:text-blue-300">
                  <a
                    href={teamDetails[teamId].team.links?.[0]?.href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {teamDetails[teamId].team.displayName}
                  </a>
                </h3>
              ) : (
                <h3 className="mb-3 text-lg font-semibold text-blue-600 dark:text-blue-300">
                  Loading...
                </h3>
              )}

              {/* Games section */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Games:</h4>
                {games[teamId] && games[teamId].length > 0 ? (
                  <div className="space-y-3">
                    {games[teamId].map((game) => (
                      <GameBasketball key={game.id} gameId={game.id} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No upcoming games scheduled</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="mb-4 text-gray-500">You haven't added any favorite teams yet.</p>
            <a
              href="/#/search"
              className="inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
            >
              Add Favorite Teams
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
