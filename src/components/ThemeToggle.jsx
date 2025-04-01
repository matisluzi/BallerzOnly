import { useTheme } from "../theme/ThemeContext.jsx";
import { Moon, Sun } from "@phosphor-icons/react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="rounded-md p-2">
      {theme === "dark" ? (
        <Sun size={24} color="#FFD700" />
      ) : (
        <Moon size={24} color="#FFD700" />
      )}
    </button>
  );
};
