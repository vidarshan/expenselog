import {
  Button,
  Flex,
  Modal,
  PasswordInput,
  SegmentedControl,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useState } from "react";

const Login = ({ opened, close }) => {
  const [mode, setMode] = useState("login");

  return (
    <Modal opened={opened} onClose={close} centered>
      <Flex justify="space-between">
        <SegmentedControl
          mb="sm"
          value={mode}
          size="md"
          onChange={setMode}
          data={[
            { value: "login", label: "Log In" },
            { value: "signup", label: "Sign Up" },
          ]}
        />
      </Flex>

      {mode === "login" ? (
        <>
          <Title c="lime" mt="xs" order={4}>
            Welcome Back
          </Title>
          <TextInput mt="md" label="Email" placeholder="Your email" />
          <PasswordInput mt="md" label="Password" placeholder="Your password" />
          <Button mt="xl" fullWidth>
            Login
          </Button>
        </>
      ) : (
        <>
          <Title c="lime" mt="xs" order={4}>
            Create a new account
          </Title>
          <TextInput mt="md" label="Email" placeholder="Your email" />
          <TextInput mt="md" label="Name" placeholder="Your Name" />
          <PasswordInput mt="md" label="Password" placeholder="Your password" />
          <Button mt="xl" fullWidth>
            Sign Up
          </Button>
        </>
      )}
    </Modal>
  );
};

export default Login;
