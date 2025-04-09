import React, { useState } from 'react';
import TeamBasketball from "../components/TeamBasketball";

const TeamSearchBar = ({ teams }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTeams = teams.filter((team) => {
        return team.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="bg-secondary rounded-lg p-4">
            <h3 className="text-lg">
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={handleInputChange}
                />
            </h3>
            <br></br>
            <ul>
                {teams.length > 0 ? (
                    filteredTeams.map((team) => (
                        <li key={team.id} className="mb-4 rounded border p-4">
                            <h3 className="text-lg font-bold"><TeamBasketball key={team.id} team={team} /></h3>
                        </li>
                    ))
                ) : (
                    <p>No teams to display.</p>
                )}
            </ul>
        </div>
    );
}

export default TeamSearchBar;
