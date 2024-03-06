import React from "react"
import { Box, Text } from "@chakra-ui/react"

export default function Logo({ text, ...props }) {
  return (
    <Box { ...props }>
      <Text fontSize="lg" fontWeight="bold">
        { text }
      </Text>
    </Box>
  )
}
