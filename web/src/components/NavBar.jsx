import Logo from "./Logo";
import {
  Avatar,
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
} from "@mantine/core";
import {
  IoBarChartOutline,
  IoCardOutline,
  IoCashOutline,
  IoCheckboxOutline,
  IoDocumentOutline,
  IoHappy,
  IoHomeOutline,
  IoListOutline,
  IoLogOutOutline,
  IoMoonOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoPodiumOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../store/slices/authSlice";
const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <>
      <Flex justify="center">
        <Logo titleSize={5} onClick={() => navigate("/")} />
      </Flex>
      {user?.token !== null ? (
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
              label="Logs"
              leftSection={<IoListOutline />}
              onClick={() => navigate("/logs")}
              c={pathname === "/logs" ? "lime" : "gray"}
            />
            <NavLink
              className="rounded-link"
              label="AI Insights"
              leftSection={<IoBarChartOutline />}
              onClick={() => navigate("/insights")}
              c={pathname === "/insights" ? "lime" : "gray"}
            />
            <NavLink
              className="rounded-link"
              label="Budgets"
              leftSection={<IoCheckboxOutline />}
              onClick={() => navigate("/budget")}
              c={pathname === "/budget" ? "lime" : "gray"}
            />
            <Divider />
            <Stack px="sm">
              <Text size="sm">Balances</Text>
              <Paper>
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
              </Paper>
              <Paper>
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
              </Paper>
              <Paper align="center" justify="space-between">
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
              </Paper>
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
                {user !== null && (
                  <Paper>
                    <Text size="sm" fw={700}>
                      {user.username}
                    </Text>
                  </Paper>
                )}
              </Group>

              <ActionIcon
                radius="sm"
                color="red"
                variant="light"
                onClick={handleLogout}
              >
                <IoLogOutOutline />
              </ActionIcon>
            </Flex>
          </Paper>
        </Stack>
      ) : (
        <Stack h="100%" justify="space-between" p="sm">
          <Stack>
            {" "}
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
