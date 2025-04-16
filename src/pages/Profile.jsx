import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import ProfilePicture from "../components/profilePic";
import AuthService from "../auth/AuthService";
import { getFavorites, getTeamDetails } from "../api";

function Profile() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profilePicture: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data and favorite teams
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [teamDetails, setTeamDetails] = useState({});

  useEffect(() => {
    const fetchProfileAndFavorites = async () => {
      try {
        setIsLoading(true);
        // Fetch profile data
        const profileResponse = await AuthService.getUserProfile();
        if (profileResponse.data.success) {
          const userData = profileResponse.data.user;
          setProfileData({
            name: userData.name,
            email: userData.email,
            profilePicture: userData.profile_picture
              ? `data:image/jpeg;base64,${userData.profile_picture}`
              : null,
          });
        } else {
          console.error(
            "Failed to fetch profile data:",
            profileResponse.data.message,
          );
        }

        // fetch favorite teams
        getFavorites()
          .then((response) => {
            const favs = response.favorites;
            console.log("Favorite teams:", favs);
            setFavoriteTeams(favs);

            const detailPromises = favs.map((id) =>
              getTeamDetails(id)
                .then((details) => ({ teamId: id, details }))
                .catch((err) => {
                  console.error(`Error fetching details for team ${id}:`, err);
                  return { teamId: id, details: null };
                }),
            );

            return Promise.all(detailPromises);
          })
          .catch((error) => {
            console.error("Error fetching favorite teams:", error);
          })
          .then((teamDetailsArray) => {
            // Process team details data
            const detailsObj = {};
            teamDetailsArray.forEach((item) => {
              detailsObj[item.teamId] = item.details;
            });
            setTeamDetails(detailsObj);
          });
      } catch (error) {
        console.error("Error fetching profile data or favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndFavorites();
  }, []);

  // Handle profile picture update
  const handleProfilePictureUpdate = (newPictureUrl) => {
    setProfileData((prev) => ({
      ...prev,
      profilePicture: newPictureUrl,
    }));
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto mt-20 p-4">
      <NavBar />

      <div className="bg-secondary flex w-full gap-4 rounded-lg p-4">
        <div className="flex grow flex-col">
          <h1 className="text-2xl font-bold">{profileData.name}</h1>
          <p className="text-tertiary">{profileData.email}</p>
          <div className="mt-4 flex flex-col justify-end">
            <h2 className="text-xl font-medium">Favorite Teams:</h2>
            <div className="">
              {favoriteTeams.length > 0 ? (
                <ul className="list-disc pl-5">
                  {favoriteTeams.map((teamId) => (
                    <li key={teamId} className="text-tertiary">
                      {teamDetails[teamId] ? (
                        <div>{teamDetails[teamId]?.team.displayName}</div>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-tertiary">No favorite teams found.</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <ProfilePicture
            className="pfp-image"
            profilePicture={profileData.profilePicture}
            onPictureUpdate={handleProfilePictureUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
