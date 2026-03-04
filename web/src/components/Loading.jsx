import React from "react";
import { Container, Group, Loader, Stack, Text } from "@mantine/core";

const Loading = ({ size = 30, title = "Loading data..." }) => {
  return (
    <Container h="90vh" fluid>
      <Stack h="100%" align="center" justify="center">
        <Loader size={size} />
        <Text mt="xs">{title}</Text>
      </Stack>
    </Container>
  );
};

export default Loading;
