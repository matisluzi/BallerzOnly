import axios from "axios";

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
      return response.data.sports[0].leagues[0].teams.map(team => team.team);
    }
    return [];
  });
};