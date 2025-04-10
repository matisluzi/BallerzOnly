import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { API_BASE_URL, HEADERS } from "../api";

// get games for certain team
function getTeamGames(teamId) {
  var games = axios.get(`${API_BASE_URL}games?team=${teamId}&season=2023`, {
    headers: HEADERS,
  });
  return games;
}

function Feed() {
  // State variables will go here
  //const [favorites, setFavorites] = useState([]);
  const [games, setGames] = useState([]);
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // getTeamGames("1") // Replace "1" with the actual team ID you want to fetch games for
  //     .then((response) => {
  //       setGames(response.data.response);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching team games:", error);
  //     });
  // }, [favorites]);
    // Function to fetch the preferred team
    const fetchPreferredTeam = async () => {
      try {
        const response = await fetch('../../api/preferredTeam.php', {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (data.team_id) {
          console.log("your fav team's id: ", data.team_id);
          setTeam(data.team_id); // Set the team ID if found
          getTeamGames(team);
        } else {
          setError("No preferred team found or user is not authenticated");
        }
      } catch (err) {
        setError('Error fetching data');
      }
    };

    fetchPreferredTeam();
  }, []);

  // // useEffect hooks will go here
  useEffect(() => {
    
    getTeamGames(team) // Replace "19" with the actual team ID you want to fetch games for
      .then((games) => {
        console.log("Fetched games:", games);
        setGames(games);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  }, [team]);

  return (
    <div className="container mx-auto mt-20 p-4">
      <NavBar />

      {/* Main content */}
      <h1 className="mb-6 text-2xl font-bold">Favorites</h1>

      {/* Feed content will go here */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">Your Favorite Teams</h2>
        {games.length > 0 ? (
          games.map((game) => (
            <div key={game.id} className="mb-4 rounded border p-4">
              <h3 className="text-lg font-bold">{`${game.teams.home.name} vs ${game.teams.visitors.name}`}</h3>
            </div>
          ))
        ) : (
          <p>No games for team found.</p>
        )}
      </div>
    </div>
  );
}

export default Feed;
