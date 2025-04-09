import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { getTeamGames, formatDateForAPI } from "../api";
import GameBasketball from "../components/GameBasketball";

function Feed() {
  // State variables will go here
  const [favorites, setFavorites] = useState([]);
  const [games, setGames] = useState([]);

  // useEffect hooks will go here
  useEffect(() => {
    getTeamGames("19") // Replace "19" with the actual team ID you want to fetch games for
      .then((games) => {
        console.log("Fetched games:", games);
        setGames(games);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  }, [favorites]);

  return (
    <div className="container mx-auto mt-20 p-4">
      <NavBar />

      {/* Main content */}
      <h1 className="mb-6 text-2xl font-bold">Favorites</h1>

      {/* Feed content will go here */}
      <div className="bg-secondary rounded-lg p-4">
        <h2 className="mb-4 text-xl font-semibold">Your Favorite Teams</h2>
        {games.length > 0 ? (
          games.map((game) => <GameBasketball key={game.id} game={game} />)
        ) : (
          <p>No games for team found.</p>
        )}
      </div>
    </div>
  );
}

export default Feed;
