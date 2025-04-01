import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-700">
        Welcome to BallerzOnly
      </h1>

      <Link to="/signup">
        <button className="mb-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
          Sign Up
        </button>
      </Link>
      <Link to="/login">
        <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
          Log In
        </button>
      </Link>
    </div>
  );
}

export default Welcome;
