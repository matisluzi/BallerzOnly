import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import ProfilePicture from "../components/profilePic";
import "../index.css";
import AuthService from "../auth/AuthService";

function Profile() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profilePicture: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await AuthService.getUserProfile();
        
        if (response.data.success) {
          const userData = response.data.user;
          setProfileData({
            name: userData.name,
            email: userData.email,
            profilePicture: userData.profile_picture ? 
              `data:image/jpeg;base64,${userData.profile_picture}` : null
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Handle profile picture update
  const handleProfilePictureUpdate = (newPictureUrl) => {
    setProfileData(prev => ({
      ...prev,
      profilePicture: newPictureUrl
    }));
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading profile...</div>;
  }

  return (
    <div className="justify items-center">
      <div className="container mx-auto mt-20 p-4">
        <NavBar />
      </div>
      
      <div className="container rounded-lg bg-[#F2F2F2] p-4 shadow columns-2 items-center w-full">
        <div className="profile-col1">
          <ProfilePicture className="pfp-image"
            profilePicture={profileData.profilePicture}
            onPictureUpdate={handleProfilePictureUpdate}
          />
        </div>
        
        <div className="profile-col2">
          <h1 className="profile-title">Name</h1>
          <p className="profile-name">{profileData.name}</p>
          <div>
            <h1 className="profile-following-title">Sports/Teams Following</h1>
            <div className="profile-following"> 
              <p>will place the followed teams with function</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;