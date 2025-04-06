import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import "../index.css";

function Profile() {
return (
    <div className="justify items-center">

        <div className="container mx-auto mt-20 p-4">
        <NavBar />
        </div>
        {/* Feed content will go here */}
        <div className=" container rounded-lg bg-[#F2F2F2] p-4 shadow columns-2 items-center w-full">
            <div className="profile-col1">
            <img
                className="w-50 h-20 mr-4 rounded-full"
                src="https://via.placeholder.com/80"
                alt="Profile"
            />
            </div>
            <div className="profile-col2">
                <h1 className="profile-title">Name</h1>
                <p className="profile-name">
                Profile name (taken from database)
                </p>
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


