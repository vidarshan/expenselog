import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  PasswordInput,
  rem,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoSparklesOutline,
  IoTimeOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { AuthFeature } from "../components/AuthFeature";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { getUser, loginUser } from "../store/slices/authSlice";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "test@expenselog.com",
      password: "password123",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    await dispatch(loginUser(values));
    await dispatch(getUser());
  };

  useEffect(() => {
    if (user.token != null) {
      navigate("/dashboard");
    }
  }, [navigate, user.token]);

  return (
    <Container size="lg" h="calc(100vh - 28px)">
      <Center h="100%">
        <Box w="100%" maw={rem(980)}>
          <Paper withBorder radius="xl" p="md">
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
                    <Text size="sm">Track smarter. Save better.</Text>
                  </Box>
                </Group>

                <Text mt="sm" maw={420}>
                  A calm, modern personal finance dashboard to track income,
                  spending, and savings—without the spreadsheet chaos.
                </Text>

                <Stack mt="lg" gap="lg">
                  <AuthFeature
                    icon={<IoTimeOutline />}
                    color="violet"
                    title="Real-time balance overview"
                    desc="Always know where you stand this month."
                  />
                  <AuthFeature
                    icon={<IoTrendingUpOutline />}
                    color="orange"
                    title="Monthly insights & trends"
                    desc="Spot patterns and improve spending habits."
                  />
                  <AuthFeature
                    icon={<IoWalletOutline />}
                    color="gray"
                    title="Smart salary tracking"
                    desc="Supports fixed and variable income models."
                  />
                  <AuthFeature
                    icon={<IoSparklesOutline />}
                    color="cyan"
                    title="AI spending insights"
                    desc="Get intelligent insights about your spending habits and personalized suggestions to improve your finances."
                  />
                </Stack>

                <Paper mt="lg" withBorder p="sm">
                  <Text mb="xs" size="sm" fw={700}>
                    Tip
                  </Text>
                  <Text size="sm">
                    Keep your dashboard simple: focus on net, income, expenses,
                    and recent activity.
                  </Text>
                </Paper>
              </Paper>

              <Divider
                orientation="vertical"
                display={{ base: "none", md: "block" }}
              />

              <Box
                w={{ base: "100%", md: "50%" }}
                style={{ alignSelf: "stretch" }}
              >
                <Paper radius="xl" w="100%" h="100%" p="md" withBorder>
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon radius="lg" size="xl" variant="filled">
                      <IoPersonOutline size={18} />
                    </ThemeIcon>

                    <Box>
                      <Title order={2}>Login</Title>
                      <Text mt={2}>Welcome back — sign in to continue.</Text>
                    </Box>
                  </Group>
                  {error && (
                    <Alert
                      icon={<IoWarningOutline />}
                      my="lg"
                      variant="light"
                      color="red"
                      title={error}
                    />
                  )}
                  <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                      mt="xl"
                      label="Email"
                      placeholder="you@example.com"
                      radius="lg"
                      {...form.getInputProps("email")}
                    />

                    <PasswordInput
                      mt="md"
                      label="Password"
                      placeholder="••••••••"
                      radius="lg"
                      {...form.getInputProps("password")}
                    />

                    <Group justify="space-between" mt="sm">
                      <Text size="sm">New here?</Text>
                      <Text
                        onClick={() => navigate("/signup")}
                        c="lime"
                        size="sm"
                        fw={700}
                        style={{ cursor: "pointer" }}
                      >
                        Create account
                      </Text>
                    </Group>

                    <Button
                      type="submit"
                      fullWidth
                      mt="lg"
                      radius="lg"
                      size="md"
                    >
                      Login
                    </Button>

                    <Text size="xs" mt="md">
                      By continuing, you agree to keep your credentials safe.
                    </Text>
                  </form>
                </Paper>
              </Box>
            </Flex>
          </Paper>
        </Box>
      </Center>
    </Container>
  );
};

export default LoginPage;
