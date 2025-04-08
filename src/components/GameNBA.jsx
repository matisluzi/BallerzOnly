/* NBA Game Component */

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

function GameNBA({ game }) {
  const homeTeam = game.teams.home.nickname;
  const visitorTeam = game.teams.visitors.nickname;
  const date = new Date(game.date.start).toLocaleDateString();
  const time = new Date(game.date.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-primary flex w-72 items-center justify-between rounded-lg p-4">
      <div className="flex basis-1/4 flex-col items-center gap-2">
        <LogoWithFallback src={game.teams.home.logo} alt={homeTeam} />
        <p className="text-sm">{homeTeam}</p>
      </div>
      <div className="flex basis-1/2 flex-col items-center">
        <p className="text-accent basis-1/2 text-center text-xs">{date}</p>
        <p className="text-accent basis-1/2 text-center text-xs">{time}</p>
      </div>
      <div className="flex basis-1/4 flex-col items-center gap-2">
        <LogoWithFallback src={game.teams.visitors.logo} alt={visitorTeam} />
        <p className="text-sm">{visitorTeam}</p>
      </div>
    </div>
  );
}
export default GameNBA;
