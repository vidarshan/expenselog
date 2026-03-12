import { Card, Group, Text, ThemeIcon, Title } from "@mantine/core";
import React from "react";

const Feature = ({ icon, title, desc, color }) => {
  return (
    <Card h="100%" withBorder radius="lg" p="lg">
      <Group gap="sm">
        <ThemeIcon variant="filled" color={color} radius="xl" size={40}>
          {icon}
        </ThemeIcon>

        <Title c={color} tt="uppercase" order={5} fw={700}>
          {title}
        </Title>
      </Group>

      <Text c="dimmed" mt="sm" lh={1.6}>
        {desc}
      </Text>
    </Card>
  );
};

export default Feature;
