import { Card, Flex, Grid, Stack, Text, Title } from "@mantine/core";
import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";

const OverviewCard = () => {
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
            <Text size="sm" c="dimmed">
              Income
            </Text>
            <Title order={3}>$4,980</Title>
            <Flex align="center" gap="xs">
              <IoTrendingUp color="#66A80F" />
              <Text size="sm" c="green.6">
                + $300 compared to last month
              </Text>
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
          style={{ flex: "1 1 200px" }}
        >
          <Stack spacing="xs">
            <Text size="sm" c="dimmed">
              Expenses
            </Text>
            <Title order={3}>$3,100</Title>
            <Flex align="center" gap="xs">
              <IoTrendingDown color="#FF8787" />
              <Text size="sm" c="red.6">
                - $100 compared to last month
              </Text>
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
          style={{ flex: "1 1 200px" }}
        >
          <Stack spacing="xs">
            <Text size="sm" c="dimmed">
              Transactions
            </Text>
            <Title order={3}>22</Title>
            <Flex align="center" gap="xs">
              <IoTrendingUp color="#66A80F" />
              <Text size="sm" c="green.6">
                +3 compared to last month
              </Text>
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
          style={{ flex: "1 1 200px" }}
        >
          <Stack spacing="xs">
            <Text size="sm" c="dimmed">
              Net Gain
            </Text>
            <Title order={3}>$280</Title>
            <Flex align="center" gap="xs">
              <IoTrendingUp color="#66A80F" />
              <Text size="sm" c="green.6">
                + $100 compared to last month
              </Text>
            </Flex>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default OverviewCard;
