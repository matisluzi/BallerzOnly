import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TeamSearchBar from '../components/TeamFavoriteSearch';
import TeamBasketball from "../components/TeamBasketballNoESPN";
import { getTeams, addFavorite, removeFavorite, checkFavorite } from "../api";

function FirstLogin() {
  const [teams, setTeams] = useState([]);
  const [popularTeams, setPopularTeams] = useState([]);
  const [favoritesMap, setFavoritesMap] = useState({});
  const [message, setMessage] = useState("");

  const popularTeamNames = [
    "Heat", "Celtics", "Warriors", "Bulls",
    "Magic", "Knicks", "Mavericks", "Kings",
  ];

  useEffect(() => {
    getTeams()
      .then(async (fetchedTeams) => {
        setTeams(fetchedTeams);

        const popular = fetchedTeams.filter(team =>
          popularTeamNames.includes(team.name)
        );
        setPopularTeams(popular);

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
    <div className="container mx-auto p-4">
      {/* Done Button */}
      <div className="text-center mt-10">
        <Link
          to="/favorites"
          className="inline-block text-lg text-blue-600 px-10 py-5 rounded hover:bg-green-100 transition"
        >
          Press here to finish adding favorites!
        </Link>
      </div>

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
                onClick={() => handleToggleFavorite(team)}
                className={`text-xl ${
                  favoritesMap[team.id]
                    ? "text-red-600 hover:text-red-800"
                    : "text-green-600 hover:text-green-800"
                }`}
              >
                {favoritesMap[team.id] ? "−" : "+"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-12 mb-12">
        <h2 className="text-xl font-semibold mb-4">Add more teams to favorites!</h2>
        <TeamSearchBar
          teams={teams}
          renderExtra={(team) => (
            <button
              onClick={() => handleToggleFavorite(team)}
              className={`ml-4 text-lg hover:underline ${
                favoritesMap[team.id]
                  ? "text-red-600 hover:text-red-800"
                  : "text-green-600 hover:text-green-800"
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

export default FirstLogin;