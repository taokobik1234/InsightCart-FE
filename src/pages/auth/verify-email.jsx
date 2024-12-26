import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    ArrowForward
} from "@mui/icons-material";
import { Box, Typography, useMediaQuery, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const location = useLocation();
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        // Function to parse query parameters
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            verifyToken(token);
        }
    }, [location.search]);

    const verifyToken = async (token) => {
        try {
            const response = await fetch(`http://tancatest.me/api/v1/users/verify?token=${encodeURIComponent(token)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.message !== 'Success') {
                setResponseMessage(data.message || 'Failed to verify');
            } else {
                setResponseMessage("Verification Successful");
            }
        } catch (error) {
            setResponseMessage(error.message);
        }
    };

    return (
        <Box>
            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={"#F0F0F0"}
            >
                <Typography fontWeight="800" variant="h4" sx={{ mb: "20px" }} fontFamily={"bold"}>
                    Verify your email address
                </Typography>

                <Typography>
                    {responseMessage}
                </Typography>

                <Box flexDirection={"row"} display={"flex"} justifyContent={"center"} gap={"40px"}  >
                    <Button
                        onClick={() => navigate("/auth/sign-in")}
                        sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: "#FFFFFF",
                            color: "#3B82F6",
                            "&:hover": { cursor: "pointer" },
                        }}
                        variant="contained"
                    >
                        Return to sign in <ArrowForward />
                    </Button>
                </Box>

            </Box>
        </Box>
    );
}

export default VerifyEmail;
