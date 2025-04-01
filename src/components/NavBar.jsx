import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";

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

    // Redirect to login page
    navigate("/login", {
      state: { message: "You have been logged out successfully." },
    });
  };

  return (
    <div className="fixed top-0 left-0 z-10 flex w-full justify-center px-2 py-3">
      <div className="bg-secondary w-full rounded-xl px-4 py-2 shadow-lg md:max-w-xl">
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

          {/* Sport & Account */}
          <div className="flex items-center space-x-4">
            <div className="relative ml-2">
              <button
                className="bg-tertiary rounded px-2 py-1 text-sm hover:bg-blue-600"
                onClick={() => {
                  const newSport = sport === "NBA" ? "NFL" : "NBA";
                  setSport(newSport);
                }}
              >
                {sport}
              </button>
            </div>

            <div className="relative">
              {/* Account dropdown (user is always logged in) */}
              <button
                className="bg-tertiary flex items-center rounded px-2 py-1 text-sm hover:bg-blue-600"
                onClick={toggleAccountDropdown}
              >
                Account
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
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
