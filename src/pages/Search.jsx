import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TeamSearchBar from '../components/TeamSearchBar';
import { getTeams } from "../api";

function Search() {
    // State variables will go here
    const [teams, setTeams] = useState([]);

    // useEffect hooks will go here
    useEffect(() => {
        getTeams()
            .then((teams) => {
                console.log("Fetched teams:", teams);
                setTeams(teams);
            })
            .catch((error) => {
                console.error("Error fetching teams:", error);
            });
    }, []);

    return (
        <div className="container mx-auto mt-20 p-4">
        <NavBar />

        {/* Main content */}
        <h1 className="mb-6 text-2xl font-bold">Search</h1>

        {/* Search content will go here */}
        <TeamSearchBar teams={teams} />

        </div>
    );
}

export default Search;
