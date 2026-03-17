import {
  Card,
  Flex,
  Grid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";

const OverviewCard = ({ summary }) => {
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
          radius="lg"
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
                <Title order={3}>${income?.toFixed(2)}</Title>
              </Flex>
            </Flex>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
        <Card
          h="100%"
          withBorder
          shadow="sm"
          p="md"
          radius="lg"
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
                <Title order={3}>${expenses?.toFixed(2)}</Title>
              </Flex>
            </Flex>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
        <Tooltip
          withArrow
          position="bottom"
          label="Percentage of your income you keep instead of spending."
        >
          <Card
            h="100%"
            withBorder
            shadow="sm"
            p="md"
            radius="lg"
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
            </Stack>
          </Card>
        </Tooltip>
      </Grid.Col>
      <Grid.Col span={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
        <Tooltip
          withArrow
          position="bottom"
          label="Difference between what you earned and what you spent during a period"
        >
          <Card
            h="100%"
            withBorder
            shadow="sm"
            p="md"
            radius="lg"
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
                  <Title order={3}>${net.toFixed(2)}</Title>
                </Flex>
              </Flex>
            </Stack>
          </Card>
        </Tooltip>
      </Grid.Col>
    </Grid>
  );
};

export default OverviewCard;
