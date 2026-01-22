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
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";

const Login = ({ opened, close }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "vidarshan@gmail.com",
      password: "123456",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = (e) => {
    console.log(e);
    login(e.email);
    close();
  };

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
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              mt="md"
              label="Email"
              placeholder="Your email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              mt="md"
              label="Password"
              placeholder="Your password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />

            <Button type="submit" mt="xl" fullWidth>
              Login
            </Button>
          </form>
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
