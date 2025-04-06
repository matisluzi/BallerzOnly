import React, { useState } from 'react';

const TeamSearchBar = ({ teams }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTeams = teams.filter(
        (team) => team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="rounded-lg bg-white p-4 shadow">
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
                            <h3 className="text-lg font-bold">{`${team.name}`}</h3>
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
