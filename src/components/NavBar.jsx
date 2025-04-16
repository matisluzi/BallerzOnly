import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";
import ThemeToggle from "./ThemeToggle";
import { CaretDown } from "@phosphor-icons/react";

function NavBar() {
  const navigate = useNavigate();

  // Authentication state - now we only need the user
  const [user, setUser] = useState(null);

  // current page
  const [currentPage, setCurrentPage] = useState("welcome");
  const pages = ["welcome", "favorites", "feed", "search"];

  // selected sport and dropdown visibility
  const [sport, setSport] = useState("NBA");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get user info on component mount
  useEffect(() => {
    const getUserInfo = () => {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    };

    getUserInfo();

    // Listen for storage events to update user state when localStorage changes
    window.addEventListener("storage", getUserInfo);

    return () => {
      window.removeEventListener("storage", getUserInfo);
    };
  }, []);

  const toggleAccountDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setIsDropdownOpen(false);

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));

    // Redirect to welcome page
    navigate("/", {
      state: { message: "You have been logged out successfully." },
    });
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex w-full justify-center px-2 py-3">
      <div className="w-full rounded-xl bg-neutral-200/70 px-4 py-2 backdrop-blur-2xl md:max-w-2xl dark:bg-stone-800/70">
        <div className="flex items-center justify-between">
          {/* Title */}
          <Link to="/" className="text-xl font-bold">
            BallerzOnly
          </Link>

          {/* Links */}
          <div className="flex items-center space-x-4">
            <Link to="/favorites" className="text-sm md:text-base">
              Favorites
            </Link>
            <Link to="/feed" className="text-sm md:text-base">
              Feed
            </Link>
            <Link to="/search" className="text-sm md:text-base">
              Search
            </Link>
          </div>

          {/* Theme & Account */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <ThemeToggle size={22} />

            {/* Account dropdown */}
            <div className="relative">
              <button
                className="bg-tertiary flex items-center rounded px-2 py-1 text-sm"
                onClick={toggleAccountDropdown}
              >
                Account
                <CaretDown
                  size={16}
                  className="text-primary ml-1"
                  weight="bold"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 text-gray-800 shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
