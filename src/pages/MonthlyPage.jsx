import React from "react";
import {
  categoryMonthlyComparison,
  expenseData,
  NAVBAR_HEIGHT,
  summaryData,
  transactions,
} from "../data/mockdata";
import {
  ActionIcon,
  Affix,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Table,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import {
  IoArrowBack,
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoCalendarOutline,
  IoChatbubble,
  IoChatbubbleOutline,
  IoColorWandOutline,
  IoDocumentOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { BarChart, PieChart } from "@mantine/charts";
import { useWindowScroll } from "@mantine/hooks";
import Contribution from "../components/charts/ContributionChart";
import Comparison from "../components/charts/ComparisonChart";
import TransactionTable from "../components/tables/TransactionTable";
import ComparisonChart from "../components/charts/ComparisonChart";
import ContributionChart from "../components/charts/ContributionChart";

const MonthlyPage = () => {
  const [scroll, scrollTo] = useWindowScroll();

  const items = [
    { title: "Mantine", href: "#" },
    { title: "Mantine hooks", href: "#" },
    { title: "use-id", href: "#" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32}>
      {/* <Breadcrumbs>{items}</Breadcrumbs>
      <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
        {items}
      </Breadcrumbs> */}
      <Group justify="space-between" mb="xl">
        <Text size="xl" fw={700}>
          January 2025
        </Text>
        {/* <Button leftSection={<IoArrowBack />}>Back to Home</Button> */}
        <Box>
          <Button leftSection={<IoDocumentOutline />} mr="xs">
            Export PDF
          </Button>
          <Button variant="light" leftSection={<IoTrashOutline />} color="red">
            Delete Record
          </Button>
        </Box>
      </Group>
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
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
                    <IoArrowUpOutline color="#66A80F" />
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
                    <IoArrowDownOutline color="#FF8787" />
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
                    <IoArrowUpOutline color="#66A80F" />
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
                    <IoArrowUpOutline color="#66A80F" />
                    <Text size="sm" c="green.6">
                      + $100 compared to last month
                    </Text>
                  </Flex>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 5, lg: 5, xl: 5 }}>
          <ContributionChart />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 7, lg: 7, xl: 7 }}>
          <ComparisonChart />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <TransactionTable />
        </Grid.Col>
      </Grid>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={true}>
          {(transitionStyles) => (
            <Button
              variant="gradient"
              radius="xl"
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              <Flex align="center">
                <IoColorWandOutline style={{ marginRight: "0.2rem" }} />
                {scroll.y === 0 && "AI Insights"}
              </Flex>
            </Button>
          )}
        </Transition>
      </Affix>
    </Container>
  );
};

export default MonthlyPage;
