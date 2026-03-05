import "./App.css";
import { ActionIcon, AppShell, MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import YearlyPage from "./pages/YearlyPage";
import MonthlyPage from "./pages/MonthlyPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDisclosure } from "@mantine/hooks";
import { IoClose, IoMenu } from "react-icons/io5";
import LogsPage from "./pages/LogsPage";
import InsightsPage from "./pages/InsightsPage";
import BudgetsPage from "./pages/BudgetsPage";
import AccountsPage from "./pages/AccountsPage";
import CategoriesPage from "./pages/CategoriesPage";

function App() {
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <MantineProvider
      defaultColorScheme="light"
      theme={{
        defaultRadius: "md",
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
          <NavBar />
        </AppShell.Navbar>
        <AppShell.Main>
          <ActionIcon
            pos="fixed"
            size="xl"
            radius="xl"
            style={{ zIndex: 99 }}
            variant="white"
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
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
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
