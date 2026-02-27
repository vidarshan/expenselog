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
} from "@mantine/core";
import {
  IoSparklesOutline,
  IoShieldCheckmarkOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
  IoReceiptOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import { AuthFeature } from "../components/AuthFeature";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
  const navigate = useNavigate();

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
                  <ThemeIcon radius="md" variant="filled" size="xl">
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
                  <AuthFeature
                    icon={<IoShieldCheckmarkOutline />}
                    title="Secure by default"
                    desc="Hashed passwords + JWT protected API."
                  />
                </Stack>

                <Paper mt="lg" withBorder p="sm">
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

              <Box style={{ flex: 1, display: "flex" }}>
                <Paper radius="xl" w="100%" h="100%" p="md" withBorder>
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon radius="md" variant="filled" size="xl">
                      <IoPersonAddOutline size={18} />
                    </ThemeIcon>

                    <Box>
                      <Title order={2}>Create account</Title>
                      <Text mt={2}>Start tracking your money today.</Text>
                    </Box>
                  </Group>

                  <TextInput
                    mt="lg"
                    label="Name"
                    placeholder="Your name"
                    radius="md"
                  />

                  <TextInput
                    mt="md"
                    label="Email"
                    placeholder="you@example.com"
                    radius="md"
                  />

                  <PasswordInput
                    mt="md"
                    label="Password"
                    placeholder="Create a strong password"
                    radius="md"
                  />

                  <Select
                    mt="md"
                    label="Salary type"
                    placeholder="Choose salary type"
                    radius="md"
                    data={[
                      { value: "fixed", label: "Fixed" },
                      { value: "variable", label: "Variable" },
                    ]}
                  />

                  <Text size="xs" mt={6}>
                    You can change this later in Settings.
                  </Text>

                  <Button fullWidth mt="lg" radius="md" size="md">
                    Create account
                  </Button>
                  <Group my="md" align="center" justify="space-between">
                    <Text size="sm">Already have an account? </Text>
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
            </Flex>
          </Paper>
        </Box>
      </Center>
    </Container>
  );
}
