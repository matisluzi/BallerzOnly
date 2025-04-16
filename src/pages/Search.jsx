import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TeamSearchBar from '../components/TeamFavoriteSearch';
import { getTeams, addFavorite, removeFavorite, checkFavorite } from "../api";

function Search() {
    const [teams, setTeams] = useState([]);
    const [favoritesMap, setFavoritesMap] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        getTeams()
            .then(async (fetchedTeams) => {
                setTeams(fetchedTeams);

                const favStatus = {};
                for (const team of fetchedTeams) {
                    try {
                        const res = await checkFavorite(team.id);
                        favStatus[team.id] = res.isFavorite;
                    } catch (err) {
                        console.error(`Error checking favorite for ${team.id}`, err);
                        favStatus[team.id] = false;
                    }
                }
                setFavoritesMap(favStatus);
            })
            .catch((error) => {
                console.error("Error fetching teams:", error);
            });
    }, []);

    const handleToggleFavorite = (team) => {
        const isFavorite = favoritesMap[team.id];

        if (isFavorite) {
            removeFavorite(team.id)
                .then(() => {
                    setFavoritesMap((prev) => ({
                        ...prev,
                        [team.id]: false,
                    }));
                    setMessage(`${team.name} removed from favorites.`);
                })
                .catch((err) => {
                    console.error("Error removing favorite:", err);
                    setMessage(`Failed to remove ${team.name} from favorites.`);
                });
        } else {
            addFavorite(team.id)
                .then(() => {
                    setFavoritesMap((prev) => ({
                        ...prev,
                        [team.id]: true,
                    }));
                    setMessage(`${team.name} added to favorites!`);
                })
                .catch((err) => {
                    console.error("Error adding favorite:", err);
                    setMessage(`Failed to add ${team.name} to favorites.`);
                });
        }

        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <div className="container mx-auto mt-20 p-4">
            <NavBar />

            {message && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-700 shadow">
                    {message}
                </div>
            )}

            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Search for teams</h2>
                <TeamSearchBar
                    teams={teams}
                    renderExtra={(team) => (
                        <button
                            onClick={() => handleToggleFavorite(team)}
                            className={`ml-4 text-lg hover:underline ${
                                favoritesMap[team.id] ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"
                            }`}
                        >
                            {favoritesMap[team.id] ? "Remove from Favorites" : "Add to Favorites"}
                        </button>
                    )}
                />
            </div>
        </div>
    );
}

export default Search;