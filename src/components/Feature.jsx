import { Card, Group, Text, ThemeIcon, Title } from "@mantine/core";
import React from "react";

const Feature = ({ icon, title, desc, color }) => {
  return (
    <Card withBorder radius="lg" p="lg">
      <Group gap="sm">
        <ThemeIcon variant="light" color={color} radius="md" size={40}>
          {icon}
        </ThemeIcon>

        <Title order={3} fw={500}>
          {title}
        </Title>
      </Group>

      <Text c="dimmed" mt='sm' lh={1.6}>
        {desc}
      </Text>
    </Card>
  );
};

export default Feature;
