import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { API_BASE_URL, HEADERS } from "../api";

// Fetch all teams from the api
function getTeams() {
  return axios.get(`${API_BASE_URL}teams`, {
    headers: HEADERS,
  });
}

function Search() {
  // State variables will go here
  const [teams, setTeams] = useState([]);

  // useEffect hooks will go here
  useEffect(() => {
    getTeams()
      .then((response) => {
        const filteredTeams = response.data.response.filter(
            // Only legitimite NBA teams will be added (May change in future)
            (team) => team.nbaFranchise && !team.allStar
          );
        setTeams(filteredTeams);
      })
      .catch((error) => {
        console.error("Error fetching today's games:", error);
      });
  }, []);

  return (
    <div className="container mx-auto mt-20 p-4">
      <NavBar />

      {/* Main content */}
      <h1 className="mb-6 text-2xl font-bold">Search</h1>

      {/* Search content will go here */}
      <div className="rounded-lg bg-white p-4 shadow">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div key={team.id} className="mb-4 rounded border p-4">
              <h3 className="text-lg font-bold">{`${team.name}`}</h3>
            </div>
          ))
        ) : (
          <p>No teams to display.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
