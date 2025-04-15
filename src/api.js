import axios from "axios";
import AuthService, { API_BASE_URL as PHP_API_URL } from "./auth/AuthService";

export const API_BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/"; //"https://v2.nba.api-sports.io/";

// Format date in YYYYMMDD format used by the API
export const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

// Get games for a specific date
export const getGamesForDate = (date) => {
  const formattedDate = formatDateForAPI(date);
  return axios
    .get(`${API_BASE_URL}scoreboard?dates=${formattedDate}`)
    .then((response) => {
      if (response.data && response.data.events) {
        return response.data.events;
      }
      return [];
    });
};

// Get games for a specific team
export const getTeamGames = (teamId, date) => {
  // check if date provided
  const formattedDate = date ? formatDateForAPI(date) : null;
  const url = date
    ? `${API_BASE_URL}teams/${teamId}/schedule?dates=${formattedDate}`
    : `${API_BASE_URL}teams/${teamId}/schedule`;
  return axios.get(url).then((response) => {
    if (response.data && response.data.events) {
      return response.data.events;
    }
    return [];
  });
};

// Get all teams
export const getTeams = () => {
  const url = `${API_BASE_URL}teams`;
  return axios.get(url).then((response) => {
    if (
      response.data &&
      response.data.sports &&
      response.data.sports[0].leagues &&
      response.data.sports[0].leagues[0].teams
    ) {
      // Extract the teams and return the array of team objects.
      return response.data.sports[0].leagues[0].teams.map((team) => team.team);
    }
    return [];
  });
};

// Get team details by team ID
export const getTeamDetails = (teamId) => {
  const url = `${API_BASE_URL}teams/${teamId}`;
  return axios.get(url).then((response) => {
    if (response.data) {
      return response.data;
    }
    return null;
  });
};

// Get event details by event ID
export const getEventDetails = (eventId) => {
  const url = `${API_BASE_URL}summary?event=${eventId}`;
  return axios.get(url).then((response) => {
    if (response.data) {
      return response.data;
    }
    return null;
  });
};

// Add a team to favorites
export const addFavorite = (teamId) => {
  return axios
    .post(
      PHP_API_URL + "favorites-add.php",
      { team_id: teamId },
      { headers: AuthService.authHeader() },
    )
    .then((response) => {
      return response.data;
    });
};

// Remove a team from favorites
export const removeFavorite = (teamId) => {
  return axios
    .post(
      PHP_API_URL + "favorites-remove.php",
      { team_id: teamId },
      { headers: AuthService.authHeader() },
    )
    .then((response) => {
      return response.data;
    });
};

// Get all favorite teams for the current user
export const getFavorites = () => {
  return axios
    .get(PHP_API_URL + "favorites-get.php", {
      withCredentials: true,
      headers: AuthService.authHeader(),
    })
    .then((response) => {
      return response.data;
    });
};

// Check if a team is in the user's favorites
export const checkFavorite = (teamId) => {
  return axios
    .get(PHP_API_URL + "favorites-check.php", {
      params: { team_id: teamId },
      headers: AuthService.authHeader(),
    })
    .then((response) => {
      return response.data;
    });
};

// Toggle favorite status (add if not favorite, remove if already favorite)
export const toggleFavorite = (teamId) => {
  return this.checkFavorite(teamId).then((response) => {
    if (response.isFavorite) {
      return this.removeFavorite(teamId);
    } else {
      return this.addFavorite(teamId);
    }
  });
};
