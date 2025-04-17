import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthService from "../auth/AuthService";
import { Question } from "@phosphor-icons/react";
import { useDropzone } from "react-dropzone";

function ProfilePicture({ profilePicture, onPictureUpdate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  // Handle file drop/selection using react-dropzone
  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Cleanup function for FileReader
      return () => {
        reader.abort(); // Abort reading if component unmounts or file changes
      };
    } else {
      // Optional: Clear preview if no file is selected/dropped
      // setSelectedFile(null); // Keep selectedFile if you want the upload button to persist until a new file is dropped
      // setPreviewUrl(null); // Keep preview if desired, or clear it
    }
  }, [acceptedFiles]); // Re-run effect when acceptedFiles changes

  // Upload profile picture
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        API_BASE_URL + "uploadPic.php",
        { image: previewUrl },
        { headers: AuthService.authHeader() },
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
    <div className="flex flex-col gap-2 items-center">

      {/* Display profile picture from database or preview */}
      {previewUrl || profilePicture ? (
        <img
          src={previewUrl || profilePicture}
          alt="Profile"
          className="max-w-80 rounded-2xl bg-white object-contain p-2 items-stretch md:items-center mt-2.5 mr-10"
        />
      ) : (
        <div className="flex items-center gap-1">
          <Question size={32} className="text-tertiary" />
          <span className="text-tertiary">
            You don't have a profile picture.
          </span>
        </div>
      )}

      {/* Upload controls */}
      <div className="mt-2">
        <div
          {...getRootProps({
            className:
              "dropzone bg-primary hover:bg-neutral-400 p-4 border-1 border-neutral-400 cursor-pointer",
          })}
        >
          <input {...getInputProps()} />
          <p className="justify-items-center ">Click to select files</p>
        </div>
        {selectedFile && (
          <button
            onClick={handleUpload}
            className="mt-2 rounded bg-blue-500 px-2 py-1 text-sm font-bold text-white hover:bg-blue-700"
          >
            Upload Picture
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfilePicture;
