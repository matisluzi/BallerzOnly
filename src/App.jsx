import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Welcome from "./pages/Welcome";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Feed from "./pages/Feed";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

import "./index.css";

function App() {
  return (
    <div className="mx-auto md:max-w-3xl">
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />


          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
