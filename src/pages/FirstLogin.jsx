import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TeamSearchBar from '../components/TeamFavoriteSearch';
import TeamBasketball from "../components/TeamBasketball";
import { getTeams } from "../api";

function FirstLogin() {
  const [teams, setTeams] = useState([]);
  const [popularTeams, setPopularTeams] = useState([]);
  const [message, setMessage] = useState(""); // Feedback message

  // Define your popular team names here
  const popularTeamNames = [
    "Heat",
    "Celtics",
    "Warriors",
    "Bulls",
    "Magic",
    "Knicks",
    "Mavericks",
    "Kings",
  ];

  useEffect(() => {
    getTeams()
      .then((teams) => {
        setTeams(teams);

        // Filter for popular teams by name
        const popular = teams.filter(team =>
          popularTeamNames.includes(team.name)
        );
        setPopularTeams(popular);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  const handleAddTeam = (team) => {
    // Add to favorites logic goes here

    // Show feedback message
    setMessage(`${team.name} added to favorites!`);
    setTimeout(() => {
      setMessage("");
    }, 3000); // Clear message after 3 seconds
  };

  return (
    <div className="container mx-auto mt-20 p-4">
      <NavBar />

      <h1 className="mb-6 text-2xl font-bold">Let's Get Started With Your Favorite Teams!</h1>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 shadow">
          {message}
        </div>
      )}

      {/* Popular Teams Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Popular Teams</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {popularTeams.map((team) => (
            <div key={team.id} className="flex items-center justify-between bg-secondary p-3 rounded shadow">
              <div className="flex items-center gap-3">
                <TeamBasketball team={team} />
              </div>
              <button
                onClick={() => handleAddTeam(team)}
                className="text-green-600 text-xl hover:text-green-800"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Add more teams to favorites!</h2>
        <TeamSearchBar
          teams={teams}
          renderExtra={(team) => (
            <button
              onClick={() => handleAddTeam(team)}
              className="ml-4 text-green-600 text-lg hover:text-green-800"
            >
              Add to favorites
            </button>
          )}
        />
      </div>
    </div>
  );
}

export default FirstLogin;