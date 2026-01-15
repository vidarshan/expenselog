import { Button, Container, Flex, Title } from "@mantine/core";
import React from "react";
import { NAVBAR_HEIGHT } from "../data/mockdata";
import { IoSadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      size="md"
      pt={NAVBAR_HEIGHT + 32}
      h={"calc(100vh - " + NAVBAR_HEIGHT + "px)"}
    >
      <Flex h="100%" align="center" direction="column" justify="center">
        <IoSadOutline size={100} />
        <Title mt="lg">404 - Page Not Found</Title>
        <Button size="xl" mt="lg" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Flex>
    </Container>
  );
};

export default NotFoundPage;
