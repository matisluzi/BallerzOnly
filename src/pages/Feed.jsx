import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { API_BASE_URL, HEADERS } from "../api";

// get today's games from API
function getTodaysGames() {
  return axios.get(`${API_BASE_URL}games?date=${getTodaysDate()}`, {
    headers: HEADERS,
  });
}

// function to get today's date in YYYY-MM-DD format
function getTodaysDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Feed() {
  // State variables will go here
  const [games, setGames] = useState([]);

  // useEffect hooks will go here
  useEffect(() => {
    getTodaysGames()
      .then((response) => {
        setGames(response.data.response);
      })
      .catch((error) => {
        console.error("Error fetching today's games:", error);
      });
  }, []);

  return (
    <div className="container mx-auto mt-20 p-4">
      <NavBar />

      {/* Main content */}
      <h1 className="mb-6 text-2xl font-bold">Feed</h1>

      {/* Feed content will go here */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">Today's Games</h2>
        {games.length > 0 ? (
          games.map((game) => (
            <div key={game.id} className="mb-4 rounded border p-4">
              <h3 className="text-lg font-bold">{`${game.teams.home.name} vs ${game.teams.visitors.name}`}</h3>
            </div>
          ))
        ) : (
          <p>No games today.</p>
        )}
      </div>
    </div>
  );
}

export default Feed;
