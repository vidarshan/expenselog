import {
  Button,
  Card,
  Container,
  Flex,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useSelection } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loading } = useSelection((state) => state.auth);

  return (
    <Container bg="blue" size="xl">
      <Card w={400} withBorder>
        <Title order={2}>Login</Title>
        <Text mb="md">Welcome back</Text>
        <TextInput label="Email" placeholder="Input placeholder" />
        <PasswordInput
          mt="md"
          label="Password"
          placeholder="Input placeholder"
        />
        <Flex mt="md">
          <Button
            loading={loading}
            variant="light"
            mr="xs"
            fullWidth
            onClick={() => navigate("/signup")}
          >
            New member?
          </Button>
          <Button ml="xs" fullWidth>
            Login
          </Button>
        </Flex>
      </Card>
    </Container>
  );
};

export default LoginPage;
