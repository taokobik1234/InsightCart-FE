import React from 'react'
import { Box, Typography } from '@mui/material'
export default function HeaderTitle() {
  return (
    <Box
        backgroundColor={"#F0F0F0"}
        p="1rem 6%"
      >
        <Typography fontWeight="bold" fontSize="32px" color="#00D5FA" sx={{ "&:hover": { cursor: "pointer" }}}>
             InsightCart
        </Typography>
    </Box>
  )
}
