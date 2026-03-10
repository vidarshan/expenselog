import Logo from "./Logo";
import {
  Divider,
  Flex,
  Text,
  NavLink,
  Paper,
  Group,
  ActionIcon,
  Stack,
  useMantineColorScheme,
  Switch,
  ThemeIcon,
  Button,
  Avatar,
} from "@mantine/core";
import {
  IoAddOutline,
  IoCardOutline,
  IoCheckboxOutline,
  IoClose,
  IoCloudyNightOutline,
  IoHappy,
  IoHomeOutline,
  IoListOutline,
  IoLogOutOutline,
  IoMenu,
  IoMoonOutline,
  IoPartlySunnyOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../store/slices/authSlice";
import AddRecord from "./popups/AddRecord";
import SidebarBalanceCard from "./cards/SidebarBalanceCard";
import { getAccounts } from "../store/slices/accountsSlice";
import { useViewportSize } from "@mantine/hooks";
import AccountCard from "./cards/AccountCard";
import Profile from "./popups/Profile";

const NavBar = ({ toggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { width } = useViewportSize();

  const authUser = useSelector((state) => state.auth.user);
  const token = authUser?.token || null;
  const username = authUser?.username || "";

  const { accounts } = useSelector((state) => state.accounts);

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [accountOpened, setAccountOpened] = useState(false);
  const [opened, setOpened] = useState(false);

  const isAuthed = !!token;

  // Only fetch profile if we have a token but no loaded username yet (common after refresh)
  const shouldFetchMe = useMemo(() => {
    return isAuthed && !username;
  }, [isAuthed, username]);

  // Fetch accounts immediately after login (token becomes truthy)
  useEffect(() => {
    if (!isAuthed) return;

    dispatch(getAccounts());
  }, [dispatch, isAuthed]);

  // Fetch /auth/me only when needed (prevents loops)
  useEffect(() => {
    if (!shouldFetchMe) return;

    dispatch(getUser());
  }, [dispatch, shouldFetchMe]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <>
      {isAuthed && (
        <Profile
          opened={accountOpened}
          setOpened={() => setAccountOpened(false)}
          handleLogout={handleLogout}
        />
      )}
      {isAuthed && (
        <AddRecord expenseOpened={opened} setExpenseOpened={setOpened} />
      )}
      {width <= 768 && (
        <ActionIcon
          pos="fixed"
          size="xl"
          top={10}
          right={10}
          radius="xl"
          variant="white"
          onClick={toggle}
        >
          {!opened ? <IoClose /> : <IoMenu />}
        </ActionIcon>
      )}
      <Flex justify="center">
        <Logo titleSize={5} onClick={() => navigate("/")} />
      </Flex>

      {isAuthed ? (
        <Stack h="100%" justify="space-between" p="sm">
          <Stack>
            <Button
              leftSection={<IoAddOutline />}
              variant="light"
              onClick={() => setOpened(true)}
            >
              Create Log
            </Button>

            <Divider />

            <NavLink
              className="rounded-link"
              label="Dashboard"
              leftSection={<IoHomeOutline />}
              onClick={() => navigate("/dashboard")}
              c={pathname === "/dashboard" ? "lime" : "gray"}
            />
            <NavLink
              className="rounded-link"
              label="Logs"
              leftSection={<IoListOutline />}
              onClick={() => navigate("/logs")}
              c={pathname === "/logs" ? "lime" : "gray"}
            />
            <NavLink
              className="rounded-link"
              label="Budgets"
              leftSection={<IoCheckboxOutline />}
              onClick={() => navigate("/budgets")}
              c={pathname === "/budgets" ? "lime" : "gray"}
            />
            <NavLink
              className="rounded-link"
              label="Accounts"
              leftSection={<IoCardOutline />}
              onClick={() => navigate("/accounts")}
              c={pathname === "/accounts" ? "lime" : "gray"}
            />

            <Divider />

            <Stack px="sm">
              <Text size="sm">Balances</Text>

              {accounts?.length ? (
                accounts.map((a) => (
                  <SidebarBalanceCard
                    key={a._id}
                    title={a.name}
                    type={a.type}
                    balance={a.currentBalance}
                  />
                ))
              ) : (
                <Text size="xs">No accounts found.</Text>
              )}
            </Stack>

            <Divider />

            <Stack py={0} px={0}>
              <Group justify="space-between">
                <Text size="xs">Theme</Text>
                <ActionIcon
                  size="md"
                  variant="light"
                  color={colorScheme === "light" ? "blue" : "yellow"}
                  onClick={() =>
                    setColorScheme(colorScheme === "dark" ? "light" : "dark")
                  }
                >
                  {colorScheme === "light" ? (
                    <IoCloudyNightOutline />
                  ) : (
                    <IoPartlySunnyOutline />
                  )}
                </ActionIcon>
              </Group>
            </Stack>
          </Stack>

          <Paper className="hover-class" onClick={() => setAccountOpened(true)}>
            <Flex align="center" justify="space-between">
              <Group gap="xs" justify="flex-start">
                <Avatar color="lime" radius="xl">
                  {username?.[0] || "U"}
                </Avatar>
                <Paper>
                  <Text size="sm" fw={700}>
                    {username || "User"}
                  </Text>
                </Paper>
              </Group>
            </Flex>
          </Paper>
        </Stack>
      ) : (
        <Stack h="100%" justify="space-between" p="sm">
          <Stack>
            <NavLink
              className="rounded-link"
              label="Login"
              leftSection={<IoPersonOutline />}
              onClick={() => navigate("/login")}
              c={pathname === "/login" ? "lime" : "gray"}
            />
            <NavLink
              className="rounded-link"
              label="Register"
              leftSection={<IoPersonAddOutline />}
              onClick={() => navigate("/signup")}
              c={pathname === "/signup" ? "lime" : "gray"}
            />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default NavBar;
