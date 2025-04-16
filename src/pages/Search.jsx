import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TeamSearchBar from '../components/TeamFavoriteSearch';
import { getTeams, addFavorite } from "../api";

function Search() {
    const [teams, setTeams] = useState([]);
    const [message, setMessage] = useState(""); // Feedback message

    useEffect(() => {
        getTeams()
            .then((teams) => {
                setTeams(teams);
            })
            .catch((error) => {
                console.error("Error fetching teams:", error);
            });
    }, []);

    const handleAddTeam = (team) => {
        // Add to favorites logic goes here
        addFavorite(team.id);
        // Show feedback message
        setMessage(`${team.name} added to favorites!`);
        setTimeout(() => {
            setMessage("");
        }, 3000); // Clear message after 3 seconds
    };

    return (
        <div className="container mx-auto mt-20 p-4">
            <NavBar />

            {message && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-700 shadow">
                    {message}
                </div>
            )}

            {/* Search Bar */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Search for teams</h2>
                <TeamSearchBar
                    teams={teams}
                    renderExtra={(team) => (
                        <button
                            onClick={() => handleAddTeam(team)}
                            className="ml-4 text-green-600 text-lg hover:text-green-800"
                        >
                            Add to Favorites
                        </button>
                    )}
                />
            </div>
        </div>
    );
}

export default Search;
