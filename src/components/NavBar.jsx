import Logo from "./Logo";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  NavLink,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IoAddOutline,
  IoCardOutline,
  IoCheckboxOutline,
  IoCloudyNightOutline,
  IoHomeOutline,
  IoListOutline,
  IoPartlySunnyOutline,
  IoPersonAddOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../store/slices/authSlice";
import { getAccounts } from "../store/slices/accountsSlice";
import { getActivePeriods } from "../store/slices/logSlice";
import AddRecord from "./popups/AddRecord";
import SidebarBalanceCard from "./cards/SidebarBalanceCard";
import Profile from "./popups/Profile";
import Loading from "./Loading";
import {
  FiCheckSquare,
  FiGrid,
  FiHome,
  FiInbox,
  FiList,
  FiMoon,
  FiSidebar,
  FiSliders,
  FiSun,
  FiX,
} from "react-icons/fi";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    description: "Overview and recent activity",
    path: "/dashboard",
    icon: <FiHome size={18} />,
  },
  {
    label: "Logs",
    description: "Track and edit entries",
    path: "/logs",
    icon: <FiList size={18} />,
  },
  {
    label: "Budgets",
    description: "Monthly limits and progress",
    path: "/budgets",
    icon: <FiSliders size={18} />,
  },
  {
    label: "Accounts",
    description: "Balances and account details",
    path: "/accounts",
    icon: <FiInbox size={18} />,
  },
  {
    label: "Categories",
    description: "Organize spending",
    path: "/categories",
    icon: <FiGrid size={18} />,
  },
];

const GUEST_ITEMS = [
  {
    label: "Login",
    description: "Access your workspace",
    path: "/login",
    icon: <IoPersonOutline size={18} />,
  },
  {
    label: "Register",
    description: "Create a new account",
    path: "/signup",
    icon: <IoPersonAddOutline size={18} />,
  },
];

const NavBar = ({ opened, close, expanded, isDesktop, onToggleExpand }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { user: authUser, loading: authLoading } = useSelector(
    (state) => state.auth,
  );
  const { accounts, loading: accountsLoading } = useSelector(
    (state) => state.accounts,
  );

  const token = authUser?.token || null;
  const username = authUser?.username || "";
  const isAuthed = !!token;

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [profileOpened, setProfileOpened] = useState(false);
  const [recordOpened, setRecordOpened] = useState(false);

  const shouldFetchMe = useMemo(
    () => isAuthed && !username,
    [isAuthed, username],
  );

  useEffect(() => {
    if (!isAuthed) return;

    dispatch(getAccounts());
    dispatch(getActivePeriods());
  }, [dispatch, isAuthed]);

  useEffect(() => {
    if (!shouldFetchMe) return;
    dispatch(getUser());
  }, [dispatch, shouldFetchMe]);

  const goTo = (path) => {
    navigate(path);
    if (opened) {
      close();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpened(false);
    navigate("/", { replace: true });
    if (opened) {
      close();
    }
  };

  const compactDesktop = isDesktop && !expanded;
  const isMobile = !isDesktop;

  const renderExpandToggle = () =>
    isDesktop ? (
      <ActionIcon
        size="lg"
        variant="subtle"
        color="gray"
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand();
        }}
      >
        <FiSidebar />
      </ActionIcon>
    ) : null;

  const renderNavItem = (item) => {
    if (compactDesktop) {
      return (
        <Tooltip key={item.path} label={item.label} position="right" withArrow>
          <ActionIcon
            size={44}
            radius="lg"
            variant={pathname === item.path ? "light" : "transparent"}
            color={pathname === item.path ? "lime" : "gray"}
            onClick={() => goTo(item.path)}
          >
            {item.icon}
          </ActionIcon>
        </Tooltip>
      );
    }

    return (
      <NavLink
        key={item.path}
        className="rounded-link"
        label={item.label}
        description={item.description}
        leftSection={
          <ThemeIcon
            size={34}
            radius="md"
            variant={pathname === item.path ? "filled" : "light"}
            color={pathname === item.path ? "lime" : "gray"}
          >
            {item.icon}
          </ThemeIcon>
        }
        active={pathname === item.path}
        onClick={() => goTo(item.path)}
        styles={{
          root: {
            paddingBlock: 10,
            paddingInline: 10,
            borderRadius: 16,
          },
          body: {
            overflow: "hidden",
          },
          label: {
            fontSize: 14,
            fontWeight: 700,
          },
          description: {
            fontSize: 11,
            lineHeight: 1.3,
          },
        }}
      />
    );
  };

  return (
    <>
      {isAuthed && (
        <Profile
          opened={profileOpened}
          setOpened={() => setProfileOpened(false)}
          handleLogout={handleLogout}
        />
      )}

      {isAuthed && (
        <AddRecord
          expenseOpened={recordOpened}
          setExpenseOpened={setRecordOpened}
        />
      )}

      <Stack h="100%" justify="space-between" gap="md">
        <Stack
          className="sidebar-scroll"
          gap={compactDesktop ? "lg" : "md"}
          align={compactDesktop ? "center" : "stretch"}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: compactDesktop ? 0 : 4,
          }}
        >
          {isMobile ? (
            <Group justify="space-between" align="center">
              <Logo
                titleSize={4}
                logoSize={22}
                withTitle
                onClick={() => goTo("/")}
              />
              <ActionIcon
                size="lg"
                variant="subtle"
                color="gray"
                aria-label="Close navigation"
                onClick={close}
              >
                <FiX />
              </ActionIcon>
            </Group>
          ) : null}

          {compactDesktop ? (
            <Stack align="center" gap="xs">
              <Logo
                titleSize={5}
                logoSize={28}
                withTitle={false}
                onClick={() => goTo("/")}
              />
            </Stack>
          ) : (
            <Group>
              <Flex w="100%" justify="center">
                <Logo
                  titleSize={4}
                  logoSize={22}
                  withTitle
                  onClick={() => goTo("/")}
                />
              </Flex>
            </Group>
          )}

          {isAuthed ? (
            <>
              {compactDesktop ? (
                <Tooltip label="Create Log" position="right" withArrow>
                  <ActionIcon
                    size={48}
                    radius="lg"
                    variant="filled"
                    color="lime"
                    onClick={() => setRecordOpened(true)}
                  >
                    <IoAddOutline />
                  </ActionIcon>
                </Tooltip>
              ) : (
                <Button
                  leftSection={<IoAddOutline />}
                  onClick={() => setRecordOpened(true)}
                  fullWidth
                  size="md"
                  radius="xl"
                >
                  Create Log
                </Button>
              )}

              {compactDesktop ? (
                <Stack gap="sm" align="center">
                  {NAV_ITEMS.map(renderNavItem)}
                </Stack>
              ) : (
                <Paper withBorder radius="lg" p="xs">
                  <Stack gap={4}>{NAV_ITEMS.map(renderNavItem)}</Stack>
                </Paper>
              )}

              {compactDesktop || isMobile ? null : (
                <Paper withBorder radius="lg" p="sm">
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="xs" fw={700} c="dimmed">
                        ACCOUNTS
                      </Text>
                      <Badge variant="light">{accounts.length}</Badge>
                    </Group>

                    {accountsLoading ? (
                      <Loading h="auto" size="xs" title="Loading accounts" />
                    ) : accounts.length > 0 ? (
                      <Stack gap="xs">
                        {accounts.map((account) => (
                          <SidebarBalanceCard
                            key={account._id}
                            title={account.name}
                            type={account.type}
                            balance={account.currentBalance}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Paper withBorder p="sm" radius="lg">
                        <Text size="sm" c="dimmed">
                          No accounts yet. Create one to start tracking
                          balances.
                        </Text>
                      </Paper>
                    )}
                  </Stack>
                </Paper>
              )}

              {isMobile ? (
                <Paper withBorder radius="lg" p="sm">
                  <Group justify="space-between" wrap="nowrap">
                    <Box>
                      <Text size="xs" fw={700} c="dimmed">
                        ACCOUNTS
                      </Text>
                      <Text size="sm">
                        {accounts.length > 0
                          ? `${accounts.length} account${accounts.length === 1 ? "" : "s"} available`
                          : "No accounts yet"}
                      </Text>
                    </Box>
                    <Badge variant="light">{accounts.length}</Badge>
                  </Group>
                </Paper>
              ) : null}

              <Divider />

              <Group justify={compactDesktop ? "center" : "space-between"}>
                {compactDesktop ? null : <Text size="sm">Theme</Text>}
                <Tooltip
                  label={`Switch to ${colorScheme === "dark" ? "light" : "dark"} mode`}
                  position="right"
                  withArrow
                  disabled={!compactDesktop}
                >
                  <ActionIcon
                    size="xl"
                    variant="light"
                    color={colorScheme === "light" ? "blue" : "yellow"}
                    onClick={() =>
                      setColorScheme(colorScheme === "dark" ? "light" : "dark")
                    }
                  >
                    {colorScheme === "light" ? <FiMoon /> : <FiSun />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            </>
          ) : (
            <Stack
              gap={compactDesktop ? "sm" : 6}
              align={compactDesktop ? "center" : "stretch"}
            >
              {GUEST_ITEMS.map(renderNavItem)}
            </Stack>
          )}
        </Stack>
        {isAuthed ? (
          authLoading ? (
            <Loading h="auto" size="xs" title="Loading profile" />
          ) : (
            <Tooltip
              label="Manage profile"
              position={compactDesktop ? "right" : "top"}
              withArrow
              disabled={!compactDesktop}
            >
              <Paper
                withBorder
                radius="lg"
                p="sm"
                style={{
                  display: "flex",
                  flexDirection: compactDesktop ? "column" : "row",
                  alignItems: "center",
                  justifyContent: compactDesktop ? "center" : "space-between",
                  gap: 6,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpened(true);
                }}
              >
                <Group
                  justify={compactDesktop ? "center" : "flex-start"}
                  wrap="nowrap"
                  style={{ flex: compactDesktop ? "unset" : 1, minWidth: 0 }}
                >
                  <Avatar color="violet" variant="filled" radius="xl">
                    {username?.[0] || "U"}
                  </Avatar>

                  {compactDesktop ? null : (
                    <Stack gap={0} style={{ minWidth: 0 }}>
                      <Text size="sm" fw={700}>
                        {username || "User"}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Manage profile and salary
                      </Text>
                    </Stack>
                  )}
                </Group>

                {renderExpandToggle()}
              </Paper>
            </Tooltip>
          )
        ) : isDesktop ? (
          <Paper
            withBorder
            radius="lg"
            p="sm"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: compactDesktop ? "center" : "space-between",
              gap: 8,
            }}
          >
            {compactDesktop ? null : <Box></Box>}

            {renderExpandToggle()}
          </Paper>
        ) : null}
      </Stack>
    </>
  );
};

export default NavBar;
