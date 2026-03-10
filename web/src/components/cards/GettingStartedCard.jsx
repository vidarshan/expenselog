import {
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IoCheckmark } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const GettingStartedCard = ({
  accountsCount = 0,
  categoriesCount = 0,
  hasTransactions = false,
  setOpened,
}) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Title order={3} mb="xs">
        Getting Started
      </Title>

      <Text size="sm" mb="md">
        Set up the basics before tracking your finances.
      </Text>

      <Stack gap="md">
        <Card withBorder radius="md" p="md">
          <Group align="flex-start" wrap="nowrap">
            <ThemeIcon
              color={accountsCount > 0 ? "lime" : "red"}
              radius="xl"
              size="lg"
              variant="filled"
            >
              {accountsCount > 0 ? <IoCheckmark /> : "1"}
            </ThemeIcon>

            <Stack gap={6} flex={1}>
              <Text
                fw={600}
                td={accountsCount > 0 ? "line-through" : undefined}
                c={accountsCount > 0 ? "dimmed" : undefined}
              >
                Create Account
              </Text>

              <Text
                size="sm"
                c="dimmed"
                td={accountsCount > 0 ? "line-through" : undefined}
              >
                Add where your money is stored (bank, cash, credit card).
              </Text>

              {accountsCount > 0 ? (
                <Text c="green">Done</Text>
              ) : (
                <Button
                  radius="md"
                  variant="filled"
                  w="fit-content"
                  onClick={() => navigate("/accounts")}
                >
                  Create Account
                </Button>
              )}
            </Stack>
          </Group>
        </Card>

        <Card withBorder radius="md" p="md">
          <Group align="flex-start" wrap="nowrap">
            <ThemeIcon
              color={categoriesCount > 0 ? "lime" : "red"}
              radius="xl"
              size="lg"
              variant="filled"
            >
              {categoriesCount > 0 ? <IoCheckmark /> : "2"}
            </ThemeIcon>

            <Stack gap={6} flex={1}>
              <Text
                fw={600}
                td={categoriesCount > 0 ? "line-through" : undefined}
                c={categoriesCount > 0 ? "dimmed" : undefined}
              >
                Create Categories
              </Text>

              <Text
                size="sm"
                c="dimmed"
                td={categoriesCount > 0 ? "line-through" : undefined}
              >
                Organize your expenses like Food, Rent, Transport.
              </Text>

              {categoriesCount > 0 ? (
                <Text c="green">We've created some for you</Text>
              ) : (
                <Button
                  radius="md"
                  variant="filled"
                  w="fit-content"
                  onClick={() => navigate("/categories")}
                >
                  Create Categories
                </Button>
              )}
            </Stack>
          </Group>
        </Card>

        <Card withBorder radius="md" p="md">
          <Group align="flex-start" wrap="nowrap">
            <ThemeIcon
              color={hasTransactions ? "lime" : "orange"}
              radius="xl"
              size="lg"
              variant="filled"
            >
              {hasTransactions ? <IoCheckmark /> : "3"}
            </ThemeIcon>

            <Stack gap={6} flex={1}>
              <Text
                fw={600}
                td={hasTransactions ? "line-through" : undefined}
                c={hasTransactions ? "dimmed" : undefined}
              >
                Add First Transaction
              </Text>

              <Text
                size="sm"
                c="dimmed"
                td={hasTransactions ? "line-through" : undefined}
              >
                Start tracking income or expenses.
              </Text>

              {hasTransactions ? (
                <Text tt="uppercase" fw={700} c="green">
                  Done
                </Text>
              ) : (
                <Button
                  radius="md"
                  variant="filled"
                  w="fit-content"
                  disabled={accountsCount === 0 || categoriesCount === 0}
                  onClick={() => setOpened(true)}
                >
                  Add Transaction
                </Button>
              )}
            </Stack>
          </Group>
        </Card>
      </Stack>
    </Box>
  );
};

export default GettingStartedCard;
