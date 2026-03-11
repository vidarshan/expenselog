import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import Feature from "../components/Feature";
import { NAVBAR_HEIGHT } from "../data/mockdata";
import {
  IoAppsOutline,
  IoArrowDownOutline,
  IoBarChartOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoSparklesOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { Helmet } from "react-helmet";
import Logo from "../components/Logo";

const HomePage = () => {
  const { scrollIntoView, targetRef } = useScrollIntoView({ offset: 0 });

  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32}>
      <Helmet>
        <title>Home | ExpenseLog</title>
      </Helmet>

      <Flex direction="column" mih={`calc(80vh - ${NAVBAR_HEIGHT}px)`}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={{ flex: 1 }}
        >
          <Logo logoSize={40} />
          <Title order={1} ta="center" size="3.5rem" fw={600}>
            Understand your money,
          </Title>

          <Title order={1} ta="center" c="dimmed" size="3.5rem" fw={600}>
            Without overthinking it.
          </Title>

          <Text
            ta="center"
            mt="lg"
            fw={500}
            size="lg"
            c="dimmed"
            maw={720}
            lh={1.6}
          >
            A simple expense tracker that helps you log income and expenses,
            visualize spending patterns, and stay aware of where your money
            goes.
          </Text>

          <Button
            mt="xl"
            size="lg"
            leftSection={<IoArrowDownOutline />}
            onClick={() =>
              scrollIntoView({
                alignment: "center",
              })
            }
          >
            View features
          </Button>
        </Flex>
      </Flex>

      <Divider my="xl" />

      <Stack align="center" gap="md" my="xl">
        <Title ta="center" c="lime">
          Why ExpenseLog?
        </Title>

        <Text ta="center" fw={500} size="md" c="dimmed" maw={720}>
          Most expense trackers push budgeting rules and restrictions.
          ExpenseLog focuses on awareness instead. Helping you understand your
          spending without pressure, automation, or unnecessary complexity.
        </Text>
      </Stack>

      <Divider my="xl" />
      <Stack ref={targetRef} align="center" my={64} gap="md">
        <Title ta="center" order={2}>
          Start tracking today
        </Title>

        <Text ta="center" c="dimmed" maw={600}>
          Build better awareness of your finances with a clean, focused
          experience designed to stay out of your way.
        </Text>
      </Stack>
      <Grid gutter={20}>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
          <Feature
            icon={<IoCalendarOutline />}
            color="green"
            title="Income & Expense Tracking"
            desc="Log all your income sources and expenses in one place. See your financial flow clearly"
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
          <Feature
            icon={<IoAppsOutline size={20} />}
            color="orange"
            title="Category-Based Organization"
            desc="Automatically categorize transactions (Food, Shopping, Transport, Bills, etc.) for easy analysis."
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
          <Feature
            icon={<IoTrendingUpOutline size={20} />}
            color="pink"
            title="Monthly & Yearly Reports"
            desc="View summaries of your spending and income by month or year, with gains/loss trends."
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
          <Feature
            icon={<IoBarChartOutline size={20} />}
            color="gray"
            title="Interactive Visualizations"
            desc="Charts and graphs compare categories and months, helping you spot patterns and plan ahead."
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
          <Feature
            icon={<IoCashOutline size={20} />}
            color="red"
            title="Income Type & Stability Insights"
            desc="Track whether your income is stable (salary) or flexible (freelance/business) and adjust budgets accordingly."
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
          <Feature
            icon={<IoSparklesOutline size={20} />}
            color="blue"
            title="AI-Powered Financial Insights"
            desc="Suggest budget adjustments, potential savings opportunities, or warn of overspending trends."
          />
        </Grid.Col>
      </Grid>

      <Divider my="xl" />
      <Stack align="center" my={64} gap="md">
        <Title ta="center" order={2}>
          Get started in a few simple steps
        </Title>

        <Text ta="center" c="dimmed" maw={600}>
          Set up your income, log your expenses, and gain clear insights into
          your finances, all in minutes, with no clutter or complexity.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" my="xl">
        {[
          {
            step: "Step 1",
            title: "Log transactions",
            desc: "Add income and expenses with categories, dates, and notes.",
          },
          {
            step: "Step 2",
            title: "Review summaries",
            desc: "See monthly totals, balances, and spending breakdowns.",
          },
          {
            step: "Step 3",
            title: "Reflect & adjust",
            desc: "Notice patterns over time and make informed decisions.",
          },
        ].map((item) => (
          <Card key={item.step} withBorder radius="lg" p="lg">
            <Stack gap="xs">
              <Text size="xs" fw={700} c="lime" tt="uppercase">
                {item.step}
              </Text>

              <Title order={4} fw={500}>
                {item.title}
              </Title>

              <Text c="dimmed" lh={1.6}>
                {item.desc}
              </Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default HomePage;
