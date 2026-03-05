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
} from "@mantine/core";
import {
  IoAddOutline,
  IoCardOutline,
  IoCashOutline,
  IoCheckboxOutline,
  IoHappy,
  IoHomeOutline,
  IoListOutline,
  IoLogOutOutline,
  IoMoonOutline,
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

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const authUser = useSelector((state) => state.auth.user);
  const token = authUser?.token || null;
  const username = authUser?.username || "";

  const { accounts } = useSelector((state) => state.accounts);

  const { colorScheme, setColorScheme } = useMantineColorScheme();
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
      <AddRecord expenseOpened={opened} setExpenseOpened={setOpened} />

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

            <Stack px="sm">
              <Group justify="space-between">
                <Text size="sm">Theme</Text>
                <Switch
                  size="sm"
                  checked={colorScheme === "dark"}
                  onLabel={<IoMoonOutline />}
                  offLabel={<IoSunnyOutline />}
                  onChange={(event) =>
                    setColorScheme(
                      event.currentTarget.checked ? "dark" : "light",
                    )
                  }
                />
              </Group>
            </Stack>
          </Stack>

          <Paper
            className="hover-class"
            onClick={() => navigate("/profile")}
            py="md"
          >
            <Flex align="center" justify="space-between">
              <Group gap="xs" justify="flex-start">
                <ThemeIcon>
                  <IoHappy />
                </ThemeIcon>

                <Paper>
                  <Text size="sm" fw={700}>
                    {username || "User"}
                  </Text>
                </Paper>
              </Group>

              <ActionIcon
                radius="sm"
                color="red"
                variant="light"
                onClick={(e) => {
                  e.stopPropagation(); // prevents triggering /profile click
                  handleLogout();
                }}
              >
                <IoLogOutOutline />
              </ActionIcon>
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
