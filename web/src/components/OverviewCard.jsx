import { Card, Flex, Grid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";

const OverviewCard = ({ summary, unit = "month" }) => {
  const { expenses, income, net, savingsRate } = summary;
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
                color={income ? "green" : "red"}
                variant="filled"
                size="xl"
              >
                {income > 0 ? <IoTrendingUp /> : <IoTrendingDown />}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Income
                </Text>
                <Title order={3}>${income}</Title>
              </Flex>
            </Flex>
            <Text size="sm" c="green.6">
              ${income} compared to last {unit}
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
                color={expenses ? "green" : "red"}
                variant="filled"
                size="xl"
              >
                {expenses > 0 ? <IoTrendingUp /> : <IoTrendingDown />}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Expenses
                </Text>
                <Title order={3}>${expenses}</Title>
              </Flex>
            </Flex>
            <Text size="sm" c="green.6">
              ${expenses} compared to last {unit}
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
                color={savingsRate > 0 ? "green" : "red"}
                variant="filled"
                size="xl"
              >
                {savingsRate > 0 ? <IoTrendingUp /> : <IoTrendingDown />}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Savings Rate
                </Text>
                <Title order={3}>{savingsRate}%</Title>
              </Flex>
            </Flex>
            <Text size="sm" c="green.6">
              {savingsRate} compared to last {unit}
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
                color={net > 0 ? "green" : "red"}
                variant="filled"
                size="xl"
              >
                {net > 0 ? <IoTrendingUp /> : <IoTrendingDown />}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Net Gain
                </Text>
                <Title order={3}>${net}</Title>
              </Flex>
            </Flex>

            <Flex align="center" gap="xs">
              <Text size="sm" c="green.6">
                + ${net} compared to last {unit}
              </Text>
            </Flex>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default OverviewCard;
