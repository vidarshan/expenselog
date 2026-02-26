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
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
  IoBuildOutline,
  IoCardOutline,
  IoCashOutline,
  IoCheckboxOutline,
  IoClose,
  IoDocumentOutline,
  IoHomeOutline,
  IoListOutline,
  IoMenu,
  IoPodiumOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  console.log("location", location);
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
            <Logo titleSize={5} onClick={() => navigate("/")} />
          </Flex>
          <Stack h="100%" justify="space-between" p="sm">
            <Stack>
              {" "}
              <NavLink
                className="rounded-link"
                label="Dashboard"
                leftSection={<IoHomeOutline />}
                onClick={() => navigate("/dashboard")}
                c={pathname === "/dashboard" ? "lime" : "gray"}
              />
              <NavLink
                className="rounded-link"
                href="#required-for-focus"
                label="Logs"
                leftSection={<IoListOutline />}
                onClick={() => navigate("/logs")}
                c={pathname === "/logs" ? "lime" : "gray"}
              />
              <NavLink
                className="rounded-link"
                href="#required-for-focus"
                label="AI Insights"
                leftSection={<IoBarChartOutline />}
                onClick={() => navigate("/insights")}
                c={pathname === "/insights" ? "lime" : "gray"}
              />
              <NavLink
                className="rounded-link"
                href="#required-for-focus"
                label="Reports"
                leftSection={<IoDocumentOutline />}
                onClick={() => navigate("/reports")}
                c={pathname === "/reports" ? "lime" : "gray"}
              />
              <NavLink
                className="rounded-link"
                href="#required-for-focus"
                label="Budgets"
                leftSection={<IoCheckboxOutline />}
                onClick={() => navigate("/budget")}
                c={pathname === "/budget" ? "lime" : "gray"}
              />
              <Divider />
              <Stack px="sm">
                <Text size="sm">Balances</Text>
                <UnstyledButton>
                  <Flex align="center" justify="space-between">
                    <Group gap={6}>
                      <ActionIcon color="lime" variant="light" radius="sm">
                        <IoCashOutline />
                      </ActionIcon>
                      <Text size="sm" fw={600}>
                        Cash
                      </Text>
                    </Group>
                    <Text size="sm" fw={600}>
                      $1,340
                    </Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton>
                  <Flex align="center" justify="space-between">
                    <Group gap={6}>
                      <ActionIcon color="orange" variant="light" radius="sm">
                        <IoCardOutline />
                      </ActionIcon>
                      <Text size="sm" fw={600}>
                        Credit
                      </Text>
                    </Group>
                    <Text size="sm" fw={600}>
                      $1,340
                    </Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton align="center" justify="space-between">
                  <Flex align="center" justify="space-between">
                    <Group gap={6}>
                      <ActionIcon color="violet" variant="light" radius="sm">
                        <IoPodiumOutline />
                      </ActionIcon>
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
