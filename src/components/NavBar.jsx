import Logo from "./Logo";
import {
  Avatar,
  Button,
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
  IoLogInOutline,
  IoMoonOutline,
  IoPersonOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const loggedIn = true;
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();

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
      <Login opened={opened} close={close} />
      <Logo logoSize={30} titleSize={3} onClick={() => navigate("/")} />
      {loggedIn ? (
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Avatar style={{ cursor: "pointer" }} color="cyan" radius="xl">
              VR
            </Avatar>
          </Popover.Target>
          <Popover.Dropdown>
            <Flex direction="column" align="center" gap="sm">
              <Avatar color="cyan" radius="xl">
                VR
              </Avatar>
              <Title ta="center" order={5}>
                Vidarshan
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
                      event.currentTarget.checked ? "dark" : "light"
                    )
                  }
                />
              </Flex>
              <Button
                leftSection={<IoPersonOutline />}
                onClick={() => navigate("/profile")}
                fullWidth
              >
                Edit Profile
              </Button>
              <Button
                leftSection={<IoLogInOutline />}
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
        <Button size="xs" onClick={open}>
          Get Started
        </Button>
      )}
    </Flex>
  );
};

export default NavBar;
