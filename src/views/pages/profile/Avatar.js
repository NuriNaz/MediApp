import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

function UserProfile() {
    const [file, setFile] = useState(null);
    const [profilePicture, setProfilePicture] = useState('/default-avatar.png');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (event) => {
            setProfilePicture(event.target.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Create a new FormData object
            const formData = new FormData();

            // Add the new profile picture to the FormData object
            formData.append('profile_picture', file);

            // Send the HTTP request to the server to update the profile picture
            await axios.post('/api/update-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Display a success message to the user
            alert('Profile picture updated successfully!');

            // Reset the form and clear the file input element
            setFile(null);
            event.target.reset();
        } catch (error) {
            // Display an error message to the user
            console.error(error);
            alert('An error occurred while updating your profile picture. Please try again later.');
        }
    };

    return (
        <div>
            <Avatar src={profilePicture} sx={{ width: 128, height: 128 }} />
            <form onSubmit={handleSubmit}>
                <label htmlFor="profile-picture-input">
                    <span>
                        <i className="fa fa-pencil"></i>
                    </span>
                </label>
                <input id="profile-picture-input" type="file" accept="image/*" onChange={handleFileChange} hidden />
                {/* <Button variant="contained" color="primary" type="submit">
                    Update Profile Picture
                </Button> */}
            </form>
        </div>
    );
}

export default UserProfile;
