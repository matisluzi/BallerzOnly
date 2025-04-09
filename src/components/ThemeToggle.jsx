import { useTheme } from "../theme/ThemeContext.jsx";
import { Moon, Sun } from "@phosphor-icons/react";

function ThemeToggle({ size = 24 }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="">
      {theme === "dark" ? (
        <Sun
          weight="fill"
          size={size}
          className="text-neutral-100 transition-colors hover:text-amber-200"
        />
      ) : (
        <Moon weight="fill" size={size} className="text-primary" />
      )}
    </button>
  );
}

export default ThemeToggle;
