import { Card, Flex, Grid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";

const OverviewCard = ({
  prevIncome = 0.0,
  currentIncome = 0.0,
  prevExpense = 0.0,
  currentExpenses = 0.0,
  prevTransactions = 0,
  currentTransactions = 0,
  gainOrLoss,
  unit = "month",
}) => {
  return (
    <Grid>
      <Grid.Col span={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
        <Card
          h="100%"
          withBorder
          shadow="sm"
          p="md"
          style={{ flex: "1 1 200px" }}
          className="hoverGroup"
        >
          <Stack spacing="xs">
            <Flex gap={10} align="center">
              <ThemeIcon
                color={currentIncome > prevIncome ? "green" : "red"}
                variant="filled"
                size="xl"
              >
                {currentIncome > prevIncome ? (
                  <IoTrendingUp />
                ) : (
                  <IoTrendingDown />
                )}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Income
                </Text>
                <Title order={3}>${currentIncome}</Title>
              </Flex>
            </Flex>
            <Text size="sm" c="green.6">
              ${currentIncome - prevIncome} compared to last {unit}
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
        <Card
          h="100%"
          withBorder
          shadow="sm"
          p="md"
          style={{ flex: "1 1 200px" }}
        >
          <Stack spacing="xs">
            <Flex gap={10} align="center">
              <ThemeIcon
                color={currentExpenses > prevExpense ? "green" : "red"}
                variant="filled"
                size="xl"
              >
                {currentExpenses > prevExpense ? (
                  <IoTrendingUp />
                ) : (
                  <IoTrendingDown />
                )}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Expenses
                </Text>
                <Title order={3}>${currentExpenses}</Title>
              </Flex>
            </Flex>
            <Text size="sm" c="green.6">
              ${currentExpenses - prevExpense} compared to last {unit}
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
        <Card
          h="100%"
          withBorder
          shadow="sm"
          p="md"
          style={{ flex: "1 1 200px" }}
        >
          <Stack spacing="xs">
            <Flex gap={10} align="center">
              <ThemeIcon
                color={currentTransactions > prevTransactions ? "green" : "red"}
                variant="filled"
                size="xl"
              >
                {currentTransactions > prevTransactions ? (
                  <IoTrendingUp />
                ) : (
                  <IoTrendingDown />
                )}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Transactions
                </Text>
                <Title order={3}>{currentTransactions}</Title>
              </Flex>
            </Flex>
            <Text size="sm" c="green.6">
              {currentTransactions - prevTransactions} compared to last {unit}
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
        <Card
          h="100%"
          withBorder
          shadow="sm"
          p="md"
          style={{ flex: "1 1 200px" }}
        >
          <Stack spacing="xs">
            <Flex align="center" gap={10}>
              <ThemeIcon
                color={currentTransactions > prevTransactions ? "green" : "red"}
                variant="filled"
                size="xl"
              >
                {currentTransactions > prevTransactions ? (
                  <IoTrendingUp />
                ) : (
                  <IoTrendingDown />
                )}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Net Gain
                </Text>
                <Title order={3}>${gainOrLoss}</Title>
              </Flex>
            </Flex>

            <Flex align="center" gap="xs">
              <Text size="sm" c="green.6">
                + ${gainOrLoss} compared to last {unit}
              </Text>
            </Flex>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default OverviewCard;
