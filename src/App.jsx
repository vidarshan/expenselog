import "./App.css";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Divider,
  Flex,
  Group,
  MantineProvider,
  NavLink,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import DashboardPage from "./pages/DashboardPage";
import YearlyPage from "./pages/YearlyPage";
import MonthlyPage from "./pages/MonthlyPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDisclosure } from "@mantine/hooks";
import Logo from "./components/Logo";
import {
  IoBarChartOutline,
  IoBrush,
  IoCardOutline,
  IoCashOutline,
  IoCheckboxOutline,
  IoClose,
  IoDocumentOutline,
  IoHomeOutline,
  IoListOutline,
  IoMenu,
  IoTrendingUpOutline,
} from "react-icons/io5";

function App() {
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        defaultRadius: "lg",
        primaryColor: "lime",
      }}
    >
      <AppShell
        padding="md"
        navbar={{
          width: 200,
          breakpoint: "sm",
          collapsed: { mobile: !opened, desktop: !opened },
        }}
      >
        <AppShell.Navbar>
          <Flex justify="center">
            <Logo titleSize={5} />
          </Flex>
          <Stack h="100%" justify="space-between" p="sm">
            <Stack>
              {" "}
              <NavLink
                className="rounded-link"
                href="#required-for-focus"
                label="Dashboard"
                leftSection={<IoHomeOutline />}
              />
              <NavLink
                className="rounded-link"
                href="#required-for-focus"
                label="Logs"
                leftSection={<IoListOutline />}
              />
              <NavLink
                className="rounded-link"
                href="#required-for-focus"
                label="AI Insights"
                leftSection={<IoBarChartOutline />}
              />
              <NavLink
                className="rounded-link"
                href="#required-for-focus"
                label="Reports"
                leftSection={<IoDocumentOutline />}
              />
              <NavLink
                className="rounded-link"
                href="#required-for-focus"
                label="Budgets"
                leftSection={<IoCheckboxOutline />}
              />
              <Divider />
              <Stack px="sm">
                <Text size="sm">Balances</Text>
                <UnstyledButton c="green">
                  <Flex justify="space-between">
                    <Group gap={6}>
                      <IoCashOutline />
                      <Text size="sm" fw={600}>
                        Cash
                      </Text>
                    </Group>
                    <Text size="sm" fw={600}>
                      $1,340
                    </Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton c="orange">
                  <Flex justify="space-between">
                    <Group gap={6}>
                      <IoCardOutline />
                      <Text size="sm" fw={600}>
                        Credit
                      </Text>
                    </Group>
                    <Text size="sm" fw={600}>
                      $1,340
                    </Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton c="violet">
                  <Flex justify="space-between">
                    <Group gap={6}>
                      <IoCashOutline />
                      <Text size="sm" fw={600}>
                        Bank
                      </Text>
                    </Group>
                    <Text size="sm" fw={600}>
                      $1,340
                    </Text>
                  </Flex>
                </UnstyledButton>
              </Stack>
            </Stack>

            <NavLink
              className="rounded-link"
              href="#required-for-focus"
              label="Vidarshan"
              leftSection={<Avatar size="sm" variant="light" />}
            />
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
          <ActionIcon
            pos="fixed"
            size="xl"
            radius="xl"
            variant="light"
            onClick={toggle}
          >
            {opened ? <IoClose /> : <IoMenu />}
          </ActionIcon>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:year"
              element={
                <ProtectedRoute>
                  <YearlyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:year/:month"
              element={
                <ProtectedRoute>
                  <MonthlyPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
      {/* <AppShell
        padding="md"
        navbar={{
          width: 240,
          breakpoint: "sm",
          collapsed: {
            mobile: !opened,
            desktop: false,
          },
        }}
      >
        <AppShell.Navbar>
          <Flex justify="center">
            <ActionIcon onClick={() => toggle()}>
              <IoBrush />
            </ActionIcon>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Logo titleSize={4} logoSize={20} />
          </Flex>
        </AppShell.Navbar>

        <AppShell.Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:year"
              element={
                <ProtectedRoute>
                  <YearlyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:year/:month"
              element={
                <ProtectedRoute>
                  <MonthlyPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell> */}
      {/* <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:year"
          element={
            <ProtectedRoute>
              <YearlyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:year/:month"
          element={
            <ProtectedRoute>
              <MonthlyPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {location.pathname === "/" && <Footer />} */}
    </MantineProvider>
  );
}

export default App;
