import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";

// Load Google Fonts dynamically
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      navigate("/feed");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-4xl w-full rounded-xl p-8 shadow-2xl border border-orange-500 bg-white dark:bg-white/5 backdrop-blur-sm transition-colors duration-300">
        {/* Title */}
        <div className="text-center mb-6">
          <h1
            className="text-6xl font-extrabold text-orange-500 drop-shadow-md"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            BallerzOnly
          </h1>
          <p
            className="mt-2 text-lg text-orange-400 dark:text-orange-200 italic"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            For Ballers Only. NBA All day. Every day.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Link to="/signup">
            <button className="w-full rounded-md bg-orange-500 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 transition">
              Join the Squad
            </button>
          </Link>
          <Link to="/login">
            <button className="w-full rounded-md border border-orange-400 px-6 py-3 text-lg font-semibold text-orange-500 hover:bg-orange-500 hover:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 transition">
              Already a Member? Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;