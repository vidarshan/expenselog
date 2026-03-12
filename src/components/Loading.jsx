import React from "react";
import { Container, Group, Loader, Stack, Text } from "@mantine/core";

const Loading = ({ size = "xl", title = "Loading data...", h = "90vh" }) => {
  return (
    <Container h={h} fluid>
      <Stack h="100%" align="center" justify="center">
        <Loader size={size} />
        <Text size="sm" fw={600} mt="xs">
          {title}
        </Text>
      </Stack>
    </Container>
  );
};

export default Loading;
