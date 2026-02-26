import Logo from "./Logo";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  Flex,
  Popover,
  Switch,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import Login from "./Login";
import { useDisclosure } from "@mantine/hooks";
import {
  IoBarChartOutline,
  IoLogInOutline,
  IoMoonOutline,
  IoPersonOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { pickinitials } from "../utils/pickinitials";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../store/slices/authSlice";
const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  console.log(user);

  const [opened, { open, close }] = useDisclosure(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <Flex
      h={64}
      align="center"
      justify="space-between"
      px="md"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 20,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Drawer opened={opened} onClose={close} title="Authentication">
        {/* Drawer content */}
      </Drawer>
      <Button onClick={() => open()}>Open</Button>
      {/* <Login opened={opened} close={close} /> */}
      <Logo logoSize={30} titleSize={3} onClick={() => navigate("/")} />
      {!loading && user?.token != null ? (
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Avatar
              style={{ cursor: "pointer" }}
              color="lime"
              variant="filled"
              radius="xl"
            >
              {pickinitials(user?.username)}
            </Avatar>
          </Popover.Target>
          <Popover.Dropdown>
            <Flex direction="column" align="center" gap="sm">
              <Avatar color="cyan" size="xl" radius="xl">
                {pickinitials(user?.username)}
              </Avatar>

              <Title ta="center" order={5}>
                {user?.username}
              </Title>

              <Flex align="center" w="100%" justify="space-between">
                <Text fw={700} size="sm">
                  Theme
                </Text>
                <Switch
                  my="sm"
                  size="md"
                  checked={colorScheme === "dark"}
                  onLabel={<IoMoonOutline />}
                  offLabel={<IoSunnyOutline />}
                  onChange={(event) =>
                    setColorScheme(
                      event.currentTarget.checked ? "dark" : "light",
                    )
                  }
                />
              </Flex>
              <Button
                leftSection={<IoBarChartOutline />}
                onClick={() => navigate("/dashboard")}
                fullWidth
              >
                Dashboard
              </Button>
              <Button
                leftSection={<IoPersonOutline />}
                variant="light"
                onClick={() => navigate("/profile")}
                fullWidth
              >
                Account
              </Button>
              <Button
                leftSection={<IoLogInOutline />}
                onClick={() => dispatch(logout())}
                variant="light"
                color="red"
                fullWidth
              >
                Log Out
              </Button>
            </Flex>
          </Popover.Dropdown>
        </Popover>
      ) : (
        <Button leftSection={<IoLogInOutline />} size="xs" onClick={open}>
          Login
        </Button>
      )}
    </Flex>
  );
};

export default NavBar;
