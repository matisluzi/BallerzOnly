import React, { useState } from "react";
import axios from "axios";
import AuthService from "../auth/AuthService"; // Make sure path is correct
import "../index.css";

function ProfilePicture({profilePicture, onPictureUpdate}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload profile picture
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        API_BASE_URL + "uploadPic.php",
        { image: previewUrl },
        { headers: AuthService.authHeader() }
      );

      if (response.data.success) {
        // Notify parent component about the update
        if (onPictureUpdate) {
          onPictureUpdate(previewUrl);
        }
        alert("Profile picture updated successfully!");
      } else {
        alert("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("An error occurred while uploading the profile picture");
    }
  };



  return (
    <div className="profile-image">
      {/* Display profile picture from database or preview */}
      <img
        src={previewUrl || profilePicture || "https://via.placeholder.com/80"}
        alt="Profile"
      />
      
      {/* Upload controls */}
      <div className="mt-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-slate-500"
        />
        {selectedFile && (
          <button
            onClick={handleUpload}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Upload Picture
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfilePicture;