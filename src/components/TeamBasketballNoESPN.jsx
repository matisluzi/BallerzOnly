/* Basketball Team Component */

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

function TeamBasketball({ team }) {
  // if short team name is not available, use display name
  const teamName = team.name || team.displayName;

  const teamLogo = team.logos?.[0].href;

  return (
    <div className="bg-primary flex items-center gap-x-16 rounded-lg p-4">
      <div className="flex basis-1/4 flex-col items-center gap-2">
        <LogoWithFallback src={teamLogo} alt={teamName} />
        <p className="text-sm">{teamName}</p>
      </div>
    </div>
  );
}
export default TeamBasketball;
