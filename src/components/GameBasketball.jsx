/* Basketball Game Component */

import React, { useState } from "react";
import { Question } from "@phosphor-icons/react";

// show logo, or show question mark if logo is not available
const LogoWithFallback = ({ src, alt }) => {
  const [error, setError] = useState(false);
  return error ? (
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

function GameBasketball({ game }) {
  // home team
  // if short team name is not available, use display name
  const homeTeam =
    game.competitions[0].competitors.filter(
      (team) => team.homeAway === "home",
    )[0].team.name ||
    game.competitions[0].competitors.filter(
      (team) => team.homeAway === "home",
    )[0].team.displayName;

  const homeLogo =
    game.competitions[0].competitors.filter(
      (team) => team.homeAway === "home",
    )[0].team.logo ||
    game.competitions[0].competitors.filter(
      (team) => team.homeAway === "home",
    )[0].team.logos?.[0].href;

  // away team
  // if short team name is not available, use display name
  const awayTeam =
    game.competitions[0].competitors.filter(
      (team) => team.homeAway === "away",
    )[0].team.name ||
    game.competitions[0].competitors.filter(
      (team) => team.homeAway === "away",
    )[0].team.displayName;
  const awayLogo =
    game.competitions[0].competitors.filter(
      (team) => team.homeAway === "away",
    )[0].team.logo ||
    game.competitions[0].competitors.filter(
      (team) => team.homeAway === "away",
    )[0].team.logos?.[0].href;

  // date and time
  const date = new Date(game.date).toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const time = new Date(game.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-primary flex w-72 items-center justify-between rounded-lg p-4">
      <div className="flex basis-1/4 flex-col items-center gap-2">
        <LogoWithFallback src={homeLogo} alt={homeTeam} />
        <p className="text-sm">{homeTeam}</p>
      </div>
      <div className="flex basis-1/2 flex-col items-center">
        <p className="text-accent basis-1/2 text-center text-xs">{date}</p>
        <p className="text-accent basis-1/2 text-center text-xs">{time}</p>
      </div>
      <div className="flex basis-1/4 flex-col items-center gap-2">
        <LogoWithFallback src={awayLogo} alt={awayTeam} />
        <p className="text-sm">{awayTeam}</p>
      </div>
    </div>
  );
}
export default GameBasketball;
