import React, { useState } from 'react';
import { Button, Box, Avatar, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import { setUserMedia } from '../../store/userslice';
import { useDispatch } from 'react-redux';

const Input = styled('input')({
    display: 'none',
});

function ImageUpload({ avatar, user }) {
    const [image, setImage] = useState(avatar.url || "");
    const dispatch = useDispatch();
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
        const formData = new FormData();
        formData.append("files", file);

        try {
            const response = await fetch("http://tancatest.me/api/v1/media", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${user.token.AccessToken}`,
                    "x-client-id": user.id,
                    "session-id": user.session_id,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload image. Please try again.");
            }

            const result = await response.json();
            console.log("Upload result:", result);
            dispatch(setUserMedia(result.data));
        } catch (error) {
            console.error("Upload error:", error);
        }
    };
    return (
        <Box textAlign="center" p={2} backgroundColor="#F5F5F5" borderRadius="10px" height={"20%"}>
            <Avatar
                src={image}
                alt="Profile Picture"
                sx={{ width: 56, height: 56, mb: 2, mx: 'auto' }}
            />
            <Typography variant="body2" gutterBottom>
                Choose Image
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
                Max file memory 1 MB
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
                Format: .JPEG, .PNG
            </Typography>
            <label htmlFor="icon-button-file">
                <Input accept="image/*" id="icon-button-file" type="file" onChange={handleImageChange} />
                <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                    Upload
                </Button>
            </label>
        </Box>
    );
}

export default ImageUpload;
