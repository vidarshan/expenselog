import "./App.css";
import { lazy, Suspense, useState } from "react";
import {
  Affix,
  AppShell,
  Burger,
  MantineProvider,
  ActionIcon,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Route, Routes } from "react-router-dom";
import { FiGithub } from "react-icons/fi";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import Loading from "./components/Loading";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LogsPage = lazy(() => import("./pages/LogsPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const BudgetsPage = lazy(() => import("./pages/BudgetsPage"));
const AccountsPage = lazy(() => import("./pages/AccountsPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [desktopExpanded, setDesktopExpanded] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 48em)");
  const navbarExpanded = !isDesktop || desktopExpanded;

  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        defaultRadius: "lg",
        primaryColor: "lime",
      }}
    >
      <Notifications position="top-center" />
      <AppShell
        padding="md"
        transitionDuration={220}
        transitionTimingFunction="ease"
        navbar={{
          width: navbarExpanded ? 280 : 88,
          breakpoint: "sm",
          collapsed: { mobile: !opened, desktop: false },
        }}
      >
        <AppShell.Navbar
          p={navbarExpanded ? "sm" : "xs"}
          style={{
            overflow: "hidden",
            transition: "padding 220ms ease, width 220ms ease",
          }}
        >
          <NavBar
            opened={opened}
            close={close}
            expanded={navbarExpanded}
            isDesktop={!!isDesktop}
            onToggleExpand={() => setDesktopExpanded((value) => !value)}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <Burger
            hiddenFrom="sm"
            opened={opened}
            onClick={toggle}
            aria-label="Toggle navigation"
            mt="xs"
            mb="md"
          />

          <Suspense fallback={<Loading title="Loading page..." h="60vh" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/login"
                element={
                  <AuthRoute>
                    <LoginPage />
                  </AuthRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <AuthRoute>
                    <SignupPage />
                  </AuthRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logs"
                element={
                  <ProtectedRoute>
                    <LogsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute>
                    <InsightsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budgets"
                element={
                  <ProtectedRoute>
                    <BudgetsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounts"
                element={
                  <ProtectedRoute>
                    <AccountsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <CategoriesPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppShell.Main>
      </AppShell>

      <Affix position={{ bottom: 20, right: 20 }}>
        <ActionIcon
          component="a"
          href="https://github.com/vidarshan/expenselog"
          target="_blank"
          rel="noopener noreferrer"
          radius="xl"
          variant="gradient"
          gradient={{ from: "violet", to: "yellow", deg: 22 }}
          size="xl"
        >
          <FiGithub />
        </ActionIcon>
      </Affix>
    </MantineProvider>
  );
}

export default App;
