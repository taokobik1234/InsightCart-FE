import React from 'react';
import { Button, Box, Avatar, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});

function ImageUpload() {
    return (
        <Box textAlign="center" p={2} backgroundColor="#F5F5F5" borderRadius="10px" height={"20%"}>
            <Avatar
                src=""
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
                <Input accept="image/*" id="icon-button-file" type="file" />
                <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                    Upload
                </Button>
            </label>
        </Box>
    );
}

export default ImageUpload;
