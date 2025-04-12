import React, { useState } from 'react';
import TeamBasketball from "../components/TeamBasketball";

const TeamSearchBar = ({ teams, renderExtra }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTeams = teams.filter((team) => {
        return team.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="bg-secondary rounded-lg p-4">
            <h3 className="text-lg mb-2">
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="w-full rounded border p-2"
                />
            </h3>
            <ul>
                {teams.length > 0 ? (
                    filteredTeams.map((team) => (
                        <li key={team.id} className="mb-4 flex items-center justify-between rounded border p-4">
                            <TeamBasketball team={team} />
                            {renderExtra?.(team)}
                        </li>
                    ))
                ) : (
                    <p>No teams to display.</p>
                )}
            </ul>
        </div>
    );
};

export default TeamSearchBar;