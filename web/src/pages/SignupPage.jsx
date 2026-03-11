import React from "react";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
  ThemeIcon,
  Select,
  Alert,
} from "@mantine/core";
import {
  IoSparklesOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
  IoReceiptOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import { AuthFeature } from "../components/AuthFeature";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../store/slices/authSlice";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "test",
      email: "test11@expenselog.com",
      password: "password123",
      type: "fixed",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    const newUser = {
      email: values.email,
      name: values.name,
      password: values.password,
      salary: {
        type: values.type,
        fixed: {
          amount: 0,
        },
        variable: [],
      },
    };

    await dispatch(signUpUser(newUser));
  };

  return (
    <Container size="lg" h="calc(100vh - 28px)">
      <Center h="100%">
        <Box style={{ width: "100%", maxWidth: rem(980) }}>
          <Paper h="100%" withBorder radius="xl" p={rem(18)}>
            <Flex
              gap={rem(18)}
              direction={{ base: "column", md: "row" }}
              align="stretch"
            >
              <Paper p="sm" w={{ base: "100%", md: "50%" }} h="100%">
                <Group gap="sm" mb="xs">
                  <ThemeIcon radius="lg" variant="filled" size="xl">
                    <IoSparklesOutline size={18} />
                  </ThemeIcon>

                  <Box>
                    <Title order={3}>ExpenseLog</Title>
                    <Text size="sm">Start tracking in minutes.</Text>
                  </Box>
                </Group>

                <Text mt="sm" maw={420}>
                  Create an account and set your salary to unlock a clean
                  monthly dashboard, trends, and category insights.
                </Text>

                <Stack mt="lg" gap="sm">
                  <AuthFeature
                    icon={<IoSparklesOutline />}
                    color="cyan"
                    title="AI spending insights"
                    desc="Get intelligent insights about your spending habits and personalized suggestions to improve your finances."
                  />
                  <AuthFeature
                    icon={<IoReceiptOutline />}
                    color="orange"
                    title="Fast expense logging"
                    desc="Add transactions quickly with categories."
                  />
                  <AuthFeature
                    icon={<IoTrendingUpOutline />}
                    color="violet"
                    title="Monthly insights"
                    desc="Understand spending and improve habits."
                  />
                  <AuthFeature
                    icon={<IoWalletOutline />}
                    color="gray"
                    title="Salary support"
                    desc="Works for fixed or variable income."
                  />
                </Stack>

                <Paper mt="lg" radius="lg" withBorder p="sm">
                  <Text size="sm" fw={700}>
                    Quick setup
                  </Text>
                  <Text size="sm">
                    You can update salary and preferences anytime from Settings.
                  </Text>
                </Paper>
              </Paper>

              <Divider
                orientation="vertical"
                display={{ base: "none", md: "block" }}
              />
              <Divider
                orientation="vertical"
                display={{ base: "none", md: "block" }}
              />

              <Box w={{ base: "100%", md: "50%" }} h="100%">
                <Box
                  component="form"
                  onSubmit={form.onSubmit(handleSubmit)}
                  h="100%"
                >
                  <Paper radius="xl" w="100%" h="100%" p="md" withBorder>
                    <Group gap="sm" wrap="nowrap">
                      <ThemeIcon radius="lg" variant="filled" size="xl">
                        <IoPersonAddOutline size={18} />
                      </ThemeIcon>
                      <Box>
                        <Title order={2}>Create account</Title>
                        <Text mt={2}>Start tracking your money today.</Text>
                      </Box>
                    </Group>
                    {error && (
                      <Alert
                        my="lg"
                        variant="filled"
                        color="red"
                        title={error}
                      />
                    )}

                    <TextInput
                      label="Name"
                      placeholder="Your name"
                      radius="lg"
                      {...form.getInputProps("name")}
                    />

                    <TextInput
                      mt="md"
                      label="Email"
                      placeholder="you@example.com"
                      radius="lg"
                      {...form.getInputProps("email")}
                    />

                    <PasswordInput
                      mt="md"
                      label="Password"
                      placeholder="Create a strong password"
                      radius="lg"
                      {...form.getInputProps("password")}
                    />

                    <Select
                      mt="md"
                      label="Salary type"
                      placeholder="Choose salary type"
                      radius="lg"
                      data={[
                        { value: "fixed", label: "Fixed" },
                        { value: "variable", label: "Variable" },
                      ]}
                      {...form.getInputProps("type")}
                    />

                    <Text size="xs" mt={6}>
                      You can change this later in Settings.
                    </Text>

                    <Button
                      type="submit"
                      fullWidth
                      mt="lg"
                      radius="lg"
                      size="md"
                      loading={loading}
                    >
                      Create account
                    </Button>

                    <Group my="lg" align="center" justify="space-between">
                      <Text size="sm">Already have an account?</Text>
                      <Text
                        onClick={() => navigate("/login")}
                        c="lime"
                        size="sm"
                        style={{ cursor: "pointer" }}
                      >
                        Login
                      </Text>
                    </Group>

                    <Text size="xs" mt="md">
                      By creating an account, you agree to keep your credentials
                      safe.
                    </Text>
                  </Paper>
                </Box>
              </Box>
            </Flex>
          </Paper>
        </Box>
      </Center>
    </Container>
  );
}
