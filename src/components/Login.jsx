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
import { useDispatch } from "react-redux";
import { getUser, loginUser } from "../store/slices/authSlice";

const Login = ({ opened, close }) => {
  const { login } = useAuth();
  const dispatch = useDispatch();
  const [mode, setMode] = useState("login");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "test@expenselog.com",
      password: "password123",
      name: "vidarshan",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      name: (value) =>
        mode === "login"
          ? null
          : value.trim().length > 0
            ? null
            : "Name is required",
    },
  });

  const handleLogin = () => {
    dispatch(loginUser());
  };

  const handleSubmit = async (values) => {
    if (mode === "login") {
      await dispatch(loginUser(values));
      await dispatch(getUser());
    } else {
    }
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
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        {mode === "login" ? (
          <>
            <Title c="lime" mt="xs" order={4}>
              Welcome Back
            </Title>

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
          </>
        ) : (
          <>
            <Title c="lime" mt="xs" order={4}>
              Create a new account
            </Title>
            <TextInput
              mt="md"
              label="Email"
              placeholder="Your email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <TextInput
              mt="md"
              label="Name"
              placeholder="Your Name"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <PasswordInput
              mt="md"
              label="Password"
              placeholder="Your password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <Button type="submit" mt="xl" fullWidth>
              Sign Up
            </Button>
          </>
        )}
      </form>
    </Modal>
  );
};

export default Login;
