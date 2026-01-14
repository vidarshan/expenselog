import {
  Button,
  Card,
  Container,
  Flex,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <Container size="xl">
      <Card w={400} withBorder>
        <Title order={2}>Sign Up</Title>
        <Text mb="md">Create a new account</Text>
        <TextInput label="Email" />
        <TextInput label="Name" />
        <PasswordInput
          mt="md"
          label="Password"
          placeholder="Input placeholder"
        />
        <Flex mt="md">
          <Button
            variant="light"
            mr="xs"
            fullWidth
            onClick={() => navigate("/login")}
          >
            Already a member?
          </Button>
          <Button ml="xs" fullWidth>
            Login
          </Button>
        </Flex>
      </Card>
    </Container>
  );
};

export default SignupPage;
