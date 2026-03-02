import { Box, Group, Text, ThemeIcon } from "@mantine/core";
import React from "react";

export const AuthFeature = ({ icon, title, desc, color }) => {
  return (
    <Group align="flex-start" wrap="nowrap" gap="sm">
      <ThemeIcon radius="md" size={34} variant="filled" color={color}>
        {icon}
      </ThemeIcon>

      <Box>
        <Text fw={700}>{title}</Text>
        <Text size="sm">{desc}</Text>
      </Box>
    </Group>
  );
};
