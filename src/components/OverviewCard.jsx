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

const OverviewCard = ({ summary, periodLabel }) => {
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
                color={income ? "lime" : "red"}
                variant="light"
                size="xl"
              >
                {income > 0 ? <IoTrendingUp /> : <IoTrendingDown />}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Income{periodLabel ? ` • ${periodLabel}` : ""}
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
                color={expenses ? "lime" : "red"}
                variant="light"
                size="xl"
              >
                {expenses > 0 ? <IoTrendingUp /> : <IoTrendingDown />}
              </ThemeIcon>
              <Flex direction="column">
                <Text size="sm" c="dimmed">
                  Expenses{periodLabel ? ` • ${periodLabel}` : ""}
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
                  color={savingsRate > 0 ? "lime" : "red"}
                  variant="light"
                  size="xl"
                >
                  {savingsRate > 0 ? <IoTrendingUp /> : <IoTrendingDown />}
                </ThemeIcon>
                <Flex direction="column">
                  <Text size="sm" c="dimmed">
                    Savings Rate{periodLabel ? ` • ${periodLabel}` : ""}
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
                  color={net > 0 ? "lime" : "red"}
                  variant="light"
                  size="xl"
                >
                  {net > 0 ? <IoTrendingUp /> : <IoTrendingDown />}
                </ThemeIcon>
                <Flex direction="column">
                  <Text size="sm" c="dimmed">
                    Net Gain{periodLabel ? ` • ${periodLabel}` : ""}
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
