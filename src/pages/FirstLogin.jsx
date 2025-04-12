import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TeamSearchBar from '../components/TeamFavoriteSearch';
import { getTeams } from "../api";

function FirstLogin() {
  const [teams, setTeams] = useState([]);
  const [popularTeams, setPopularTeams] = useState([]);

  useEffect(() => {
    getTeams()
      .then((teams) => {
        setTeams(teams);

        // "popular" teams (right now just first six)
        const popular = teams.slice(0, 6);
        setPopularTeams(popular);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  const handleAddTeam = (team) => {
    console.log("Added team:", team.name);
    // ADD FAVORITES ADDING LOGIC 
  };

  return (
    <div className="container mx-auto mt-20 p-4">
      <NavBar />

      <h1 className="mb-6 text-2xl font-bold">Let's Get Started With Your Favorite Teams!</h1>

      {/* Popular Teams Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Popular Teams</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {popularTeams.map((team) => (
            <div key={team.id} className="flex items-center justify-between bg-secondary p-3 rounded shadow">
              <span className="text-lg">{team.full_name}</span>
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
        <h2 className="text-xl font-semibold mb-4">Search for your Teams</h2>
        <TeamSearchBar
          teams={teams}
          renderExtra={(team) => (
            <button
              onClick={() => handleAddTeam(team)}
              className="ml-4 text-green-600 text-lg hover:text-green-800"
            >
              +
            </button>
          )}
        />
      </div>
    </div>
  );
}

export default FirstLogin;
