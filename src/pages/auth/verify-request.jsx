import { Box, Typography, useMediaQuery, Button } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCallback } from "react";
import {
    ArrowForward
} from "@mui/icons-material";

export default function VerifyRequest() {
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { email } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');

    const sendVerificationEmail = useCallback(async () => {
        try {
            const response = await fetch(`http://tancatest.me/api/v1/users/${type}`, {
                method: 'POST', // or 'GET' if the API requires
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                }),
            })
                .then(response => response.json())

            if (response.message !== "Success") {
                console.log(response);
            } else {
                console.log("Send verify email successfully");
            }

        } catch (error) {
            console.log(error);
        }
    }, [email, type]);
    sendVerificationEmail();

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
                <Typography mb={"20px"}>
                    We have sent a verification link to your email <br />
                </Typography>

                <Typography>
                    Click on the link to complete the verification process. <br />
                    You might need to check your spam folder.
                </Typography>

                <Box flexDirection={"row"} display={"flex"} justifyContent={"center"} gap={"40px"}  >
                    <Button
                        onClick={() => sendVerificationEmail()}
                        sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: "#3B82F6",
                            color: "#FFFFFF",
                            "&:hover": { cursor: "pointer" },
                        }}
                        variant="contained"
                    >
                        Resend email
                    </Button>
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
    )
}
