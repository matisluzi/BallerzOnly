/* Basketball Game Component */

import React, { useState, useEffect } from "react";
import { Question } from "@phosphor-icons/react";
import { getEventDetails } from "../api";

// show logo, or show question mark if logo is not available
const LogoWithFallback = ({ src, alt }) => {
  const [error, setError] = useState(false);
  return error || alt == "TBD" ? (
    <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full">
      <Question size={32} color="#000" />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="bg-secondary h-10 w-10 rounded-full object-contain"
    />
  );
};

function GameBasketball({ gameId }) {
  // State for game data
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // tracking hover state
  const [hovered, setHovered] = useState(false);

  // Fetch event details when the component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const details = await getEventDetails(gameId);
        setGame(details);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [gameId]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-primary flex w-72 items-center justify-center rounded-lg p-4">
        <p className="text-sm">Loading game data...</p>
      </div>
    );
  }

  // Show error state
  if (error || !game) {
    return (
      <div className="bg-primary flex w-72 items-center justify-center rounded-lg p-4">
        <p className="text-sm text-red-500">Error loading game data</p>
      </div>
    );
  }

  // game status
  const status = game.header.competitions[0].status?.type?.name;
  const isLive =
    status === "STATUS_IN_PROGRESS" || status === "STATUS_HALFTIME";
  const isFinished = status === "STATUS_FINAL" || status === "STATUS_POSTPONED";
  const isScheduled = !isLive && !isFinished;

  // espn link
  const link = game.header.links?.[0]?.href || "";

  // get current period and clock if available
  const period = game.header.competitions[0].status.period || 0;
  const clock = game.header.competitions[0].status.displayClock || "";

  // home team
  const homeTeamData = game.header.competitions[0].competitors.filter(
    (team) => team.homeAway === "home",
  )[0];

  const homeTeam = homeTeamData.team.name;
  const homeLogo = homeTeamData.team.logos?.[0].href;
  const homeScore = homeTeamData.score || 0;

  // away team
  const awayTeamData = game.header.competitions[0].competitors.filter(
    (team) => team.homeAway === "away",
  )[0];

  const awayTeam = awayTeamData.team.name;
  const awayLogo = awayTeamData.team.logos?.[0].href;
  const awayScore = awayTeamData.score || 0;

  // date and time
  const date = new Date(game.header.competitions[0].date).toLocaleDateString(
    [],
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  );
  const time = new Date(game.header.competitions[0].date).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  // getting geoboradcasts
  const geoBroadcasts =
    game.header.competitions[0].broadcasts
      ?.map((b) => b.media?.shortName)
      .filter(Boolean)
      .join(", ") || "No broadcast info";

  // Determine the winner for finished games
  const winner = isFinished
    ? parseInt(homeScore) > parseInt(awayScore)
      ? "home"
      : parseInt(homeScore) < parseInt(awayScore)
        ? "away"
        : "tie"
    : null;

  return (
    <div
      className="bg-primary relative flex w-72 cursor-pointer items-center justify-between rounded-lg p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(link, "_blank")}
    >
      {hovered && (
        <div className="absolute top-0 left-1/2 z-10 mb-1 -translate-x-1/2 -translate-y-full rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white">
          {geoBroadcasts}
        </div>
      )}

      {/* Home Team */}
      <div className="flex basis-1/4 flex-col items-center gap-2">
        <LogoWithFallback src={homeLogo} alt={homeTeam} />
        <p className="text-sm">{homeTeam}</p>
        {(isLive || isFinished) && (
          <p
            className={`text-lg font-bold ${winner === "home" ? "text-green-600" : ""}`}
          >
            {homeScore}
          </p>
        )}
      </div>

      {/* Middle Section - Different for each status */}
      <div className="flex basis-1/2 flex-col items-center">
        {isScheduled && (
          <>
            <p className="text-accent text-center text-xs">{date}</p>
            <p className="text-accent text-center text-xs">{time}</p>
          </>
        )}

        {isLive && (
          <>
            <p className="text-xs font-bold text-red-500">LIVE</p>
            <p className="text-accent text-center text-sm">{`Quarter ${period}`}</p>
            <p className="text-accent text-center text-xs">{clock}</p>
          </>
        )}

        {isFinished && (
          <>
            <p className="text-accent text-center text-xs font-bold uppercase">
              Finished
            </p>
            {winner === "tie" && (
              <p className="text-xs text-yellow-500">Tie Game</p>
            )}
          </>
        )}
      </div>

      {/* Away Team */}
      <div className="flex basis-1/4 flex-col items-center gap-2">
        <LogoWithFallback src={awayLogo} alt={awayTeam} />
        <p className="text-sm">{awayTeam}</p>
        {(isLive || isFinished) && (
          <p
            className={`text-lg font-bold ${winner === "away" ? "text-green-600" : ""}`}
          >
            {awayScore}
          </p>
        )}
      </div>
    </div>
  );
}
export default GameBasketball;
