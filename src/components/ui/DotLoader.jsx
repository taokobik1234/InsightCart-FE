import React from "react";
import { Box, Typography } from "@mui/material";

const DotLoader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh" // Full height
      flexDirection="column"
    >
      <Typography variant="h6" mb={2}>
        Loading...
      </Typography>
      <Box display="flex" gap="5px">
        <Box
          sx={{
            width: "10px",
            height: "10px",
            backgroundColor: "#00D5FA",
            borderRadius: "50%",
            animation: "dot-flash 1.4s infinite ease-in-out",
            animationDelay: "0s",
          }}
        ></Box>
        <Box
          sx={{
            width: "10px",
            height: "10px",
            backgroundColor: "#00D5FA",
            borderRadius: "50%",
            animation: "dot-flash 1.4s infinite ease-in-out",
            animationDelay: "0.2s",
          }}
        ></Box>
        <Box
          sx={{
            width: "10px",
            height: "10px",
            backgroundColor: "#00D5FA",
            borderRadius: "50%",
            animation: "dot-flash 1.4s infinite ease-in-out",
            animationDelay: "0.4s",
          }}
        ></Box>
      </Box>

      {/* CSS Keyframes */}
      <style>
        {`
          @keyframes dot-flash {
            0%, 80%, 100% {
              opacity: 0;
            }
            40% {
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default DotLoader;
