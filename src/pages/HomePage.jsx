import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { Helmet } from "react-helmet";
import {
  IoAppsOutline,
  IoArrowDownOutline,
  IoBarChartOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoLayersOutline,
  IoPhonePortraitOutline,
  IoSparklesOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import Feature from "../components/Feature";
import Logo from "../components/Logo";
import { NAVBAR_HEIGHT } from "../data/mockdata";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { scrollIntoView, targetRef } = useScrollIntoView({ offset: 0 });
  const { user: authUser } = useSelector((state) => state.auth);

  const token = authUser?.token || null;
  const isAuthed = !!token;
  const GRAPH_ITEMS = [
    { value: 38, color: "#3b5bdb" },
    { value: 72, color: "#e8590c" },
    { value: 76, color: "#099268" },
    { value: 56, color: "#0c8599" },
    { value: 94, color: "#e03131" },
    { value: 61, color: "#f08c00" },
    { value: 88, color: "#7fb430" },
    { value: 110, color: "#9c36b5" },
    { value: 84, color: "#f08c00" },
    { value: 67, color: "#1971c2" },
  ];

  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32} pb={72}>
      <Helmet>
        <title>Home | ExpenseLog</title>
      </Helmet>

      <Grid gutter={32} align="center" mih={`calc(82vh - ${NAVBAR_HEIGHT}px)`}>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="lg" maw={640}>
            <Badge
              w="fit-content"
              variant="light"
              color="lime"
              radius="xl"
              size="lg"
            >
              Personal finance without the noise
            </Badge>

            <Box>
              <Logo logoSize={38} />
              <Title order={1} mt="md" size="3.6rem" fw={700} lh={1.05}>
                Understand your money,
              </Title>
              <Title order={1} c="dimmed" size="3.6rem" fw={700} lh={1.05}>
                without overthinking it.
              </Title>
            </Box>

            <Text fw={500} size="lg" c="dimmed" maw={620} lh={1.7}>
              ExpenseLog helps you log transactions, review account balances,
              watch spending trends, download polished monthly or yearly
              reports, and get useful signals from your data without turning the
              app into a chore.
            </Text>

            <Group>
              <Button
                size="lg"
                radius="xl"
                leftSection={<IoArrowDownOutline />}
                onClick={() =>
                  scrollIntoView({
                    alignment: "start",
                  })
                }
              >
                Explore features
              </Button>
              {!isAuthed && (
                <Button
                  component="a"
                  href="/signup"
                  size="lg"
                  radius="xl"
                  variant="light"
                >
                  Create account
                </Button>
              )}
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              {[
                {
                  value: "Fast logging",
                  label: "Add income and expenses quickly",
                },
                {
                  value: "Clear views",
                  label: "Monthly summaries and trends",
                },
                {
                  value: "Downloadable reports",
                  label: "Export monthly or yearly PDF-ready summaries",
                },
              ].map((item) => (
                <Paper key={item.value} withBorder radius="lg" p="md">
                  <Text fw={700}>{item.value}</Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    {item.label}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper
            withBorder
            radius="xl"
            p="md"
            style={{
              background:
                "linear-gradient(160deg, rgba(163, 230, 53, 0.16), rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.01))",
            }}
          >
            <Stack gap="md">
              <Paper withBorder radius="lg" p="md">
                <Group justify="space-between" mb="md">
                  <Box>
                    <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                      Dashboard Preview
                    </Text>
                    <Text fw={700}>Monthly Overview</Text>
                  </Box>
                  <ThemeIcon radius="xl" size={40} color="lime" variant="light">
                    <IoTrendingUpOutline size={20} />
                  </ThemeIcon>
                </Group>

                <SimpleGrid cols={3} spacing="sm">
                  {[
                    ["Income", "$4,800"],
                    ["Expenses", "$2,940"],
                    ["Net", "$1,860"],
                  ].map(([label, value]) => (
                    <Paper key={label} radius="lg" p="sm" withBorder>
                      <Text size="xs" c="dimmed">
                        {label}
                      </Text>
                      <Text fw={700} mt={4}>
                        {value}
                      </Text>
                    </Paper>
                  ))}
                </SimpleGrid>

                <Paper mt="md" radius="lg" p="sm" withBorder>
                  <Text size="xs" c="dimmed" mb="xs">
                    Spending Activity
                  </Text>
                  <Flex align="flex-end" gap={8} h={120}>
                    {GRAPH_ITEMS.map((item, i) => (
                      <Box
                        key={i}
                        style={{
                          flex: 1,
                          height: item.value,
                          background: item.color,
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      />
                    ))}
                  </Flex>
                </Paper>
              </Paper>

              <Grid gutter="md" align="stretch">
                <Grid.Col span={7}>
                  <Paper
                    withBorder
                    radius="lg"
                    p="md"
                    h="100%"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                      Logs Preview
                    </Text>
                    <Stack gap="xs" mt="sm">
                      {[
                        ["Groceries", "Food", "-$82.40"],
                        ["Salary", "Income", "+$2,400.00"],
                        ["Transport", "Travel", "-$19.00"],
                      ].map(([name, tag, amount]) => (
                        <Paper key={name} withBorder radius="lg">
                          <Flex justify="space-between" wrap="nowrap" p="sm">
                            <Box>
                              <Text size="sm" fw={700}>
                                {name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {tag}
                              </Text>
                            </Box>
                            <Text
                              size="sm"
                              fw={700}
                              c={amount.startsWith("+") ? "lime" : "red"}
                            >
                              {amount}
                            </Text>
                          </Flex>
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>
                </Grid.Col>

                <Grid.Col span={5}>
                  <Paper
                    withBorder
                    radius="lg"
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    p="md"
                  >
                    <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                      AI Insight
                    </Text>
                    <Text mt="sm" fw={700}>
                      Food spending is trending up this month.
                    </Text>
                    <Text size="sm" c="dimmed" mt="xs" lh={1.6}>
                      Placeholder preview for smart suggestions and spending
                      warnings.
                    </Text>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Divider my="xl" />

      <Stack align="center" gap="md" my="xl">
        <Title ta="center" c="lime">
          Why ExpenseLog?
        </Title>

        <Text ta="center" fw={500} size="md" c="dimmed" maw={720}>
          Most expense trackers push budgeting rules and restrictions.
          ExpenseLog focuses on awareness instead, helping you understand your
          spending without pressure, automation, or unnecessary complexity.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb={72}>
        {[
          {
            icon: <IoLayersOutline size={18} />,
            title: "One workspace",
            desc: "Transactions, accounts, budgets, and insights stay connected instead of scattered across tabs.",
          },
          {
            icon: <IoCheckmarkCircleOutline size={18} />,
            title: "Simple by default",
            desc: "The flow stays focused on logging and reviewing, not endless setup or complex rules.",
          },
          {
            icon: <IoPhonePortraitOutline size={18} />,
            title: "Works on real screens",
            desc: "A practical layout for laptops and smaller devices, so your financial overview stays readable.",
          },
        ].map((item, index) => (
          <Paper key={item.title} withBorder radius="xl" p="lg">
            <ThemeIcon
              size={42}
              radius="xl"
              variant="light"
              color={index === 0 ? "lime" : index === 1 ? "blue" : "orange"}
            >
              {item.icon}
            </ThemeIcon>
            <Title order={4} mt="md">
              {item.title}
            </Title>
            <Text c="dimmed" mt="xs" lh={1.7}>
              {item.desc}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      <Divider my="xl" />

      <Stack ref={targetRef} align="center" my={64} gap="md">
        <Title ta="center" order={2}>
          Features that cover the basics well
        </Title>

        <Text ta="center" c="dimmed" maw={640}>
          Enough surface area to understand your finances, without turning the
          landing page or the app into a mess.
        </Text>
      </Stack>

      <Grid gutter={20}>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <Feature
            icon={<IoCalendarOutline />}
            color="green"
            title="Income & Expense Tracking"
            desc="Log all your income sources and expenses in one place. See your financial flow clearly."
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <Feature
            icon={<IoAppsOutline size={20} />}
            color="orange"
            title="Category-Based Organization"
            desc="Group transactions into categories so patterns are easier to spot and review."
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <Feature
            icon={<IoTrendingUpOutline size={20} />}
            color="pink"
            title="Monthly & Yearly Reports"
            desc="Generate branded monthly or yearly reports with charts, budgets, activity, and transaction history ready for export."
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <Feature
            icon={<IoBarChartOutline size={20} />}
            color="gray"
            title="Interactive Visualizations"
            desc="Charts and comparisons make spending distribution and changes easier to understand."
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <Feature
            icon={<IoCashOutline size={20} />}
            color="red"
            title="Account-Aware Tracking"
            desc="Keep balances visible across cash, bank, and credit accounts while you log activity."
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <Feature
            icon={<IoSparklesOutline size={20} />}
            color="blue"
            title="AI-Powered Insights"
            desc="Get prompts about overspending, budget pressure, and unusual patterns worth checking."
          />
        </Grid.Col>
      </Grid>

      <Divider my="xl" />

      <Grid my={64} gutter={28} align="stretch">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="md">
            <Title order={2}>A quick look at the product</Title>
            <Text c="dimmed" lh={1.7}>
              This section uses placeholder UI panels for now, but it gives the
              landing page a clearer sense of what the app actually looks like
              and what people can expect inside it.
            </Text>
            <Text c="dimmed" lh={1.7}>
              If you later want real screenshots, these blocks can be replaced
              one-for-one with image assets without reworking the layout.
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {[
              ["Dashboard", "Preview monthly totals, trends, and cards."],
              ["Logs", "Review recent entries and transaction history."],
              ["Budgets", "Watch category limits and remaining balances."],
              [
                "Reports",
                "Export monthly or yearly summaries as polished printable reports.",
              ],
            ].map(([title, desc]) => (
              <Paper key={title} withBorder radius="lg" p="md">
                <Stack h="100%">
                  <Box>
                    <Title order={4} mt="xs">
                      {title}
                    </Title>
                    <Text c="dimmed" size="sm" mt="xs" lh={1.6}>
                      {desc}
                    </Text>
                  </Box>

                  <Paper withBorder radius="lg" p="sm">
                    <Flex gap={8} mb="sm">
                      <Box
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: "#b9f27c",
                        }}
                      />
                      <Box
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.24)",
                        }}
                      />
                      <Box
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.24)",
                        }}
                      />
                    </Flex>

                    {title === "Dashboard" && (
                      <Stack gap="sm">
                        <Group justify="space-between" align="flex-start">
                          <Box>
                            <Text size="xs" c="dimmed">
                              Monthly Overview
                            </Text>
                            <Text fw={700} size="lg">
                              $4,820
                            </Text>
                          </Box>

                          <Text size="xs" c="lime" fw={700}>
                            +12.4%
                          </Text>
                        </Group>

                        <Group
                          justify="space-between"
                          align="center"
                          wrap="nowrap"
                        >
                          <RingProgress
                            size={90}
                            thickness={12}
                            roundCaps
                            sections={[
                              { value: 38, color: "lime" },
                              { value: 27, color: "blue" },
                              { value: 20, color: "grape" },
                            ]}
                          />

                          <Stack gap={6} style={{ flex: 1 }}>
                            <Group justify="space-between" wrap="nowrap">
                              <Group gap={6}>
                                <Box
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 999,
                                    background: "var(--mantine-color-lime-5)",
                                  }}
                                />
                                <Text size="xs">Needs</Text>
                              </Group>
                              <Text size="xs" fw={700}>
                                38%
                              </Text>
                            </Group>

                            <Group justify="space-between" wrap="nowrap">
                              <Group gap={6}>
                                <Box
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 999,
                                    background: "var(--mantine-color-blue-5)",
                                  }}
                                />
                                <Text size="xs">Savings</Text>
                              </Group>
                              <Text size="xs" fw={700}>
                                27%
                              </Text>
                            </Group>

                            <Group justify="space-between" wrap="nowrap">
                              <Group gap={6}>
                                <Box
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 999,
                                    background: "var(--mantine-color-grape-5)",
                                  }}
                                />
                                <Text size="xs">Wants</Text>
                              </Group>
                              <Text size="xs" fw={700}>
                                20%
                              </Text>
                            </Group>
                          </Stack>
                        </Group>
                      </Stack>
                    )}

                    {title === "Logs" && (
                      <Stack gap="xs">
                        {[
                          ["Groceries", "-$82.40"],
                          ["Salary", "+$2,400"],
                          ["Transport", "-$19.00"],
                        ].map(([item, amount]) => (
                          <Paper key={item} radius="md" withBorder>
                            <Group
                              key={item}
                              justify="space-between"
                              wrap="nowrap"
                              p="xs"
                            >
                              <Text size="sm" fw={600}>
                                {item}
                              </Text>
                              <Text
                                size="sm"
                                fw={700}
                                c={amount.startsWith("+") ? "lime" : "red"}
                              >
                                {amount}
                              </Text>
                            </Group>
                          </Paper>
                        ))}
                      </Stack>
                    )}

                    {title === "Budgets" && (
                      <Stack gap="sm">
                        {[
                          ["Food", 72, "#3b5bdb"],
                          ["Travel", 45, "#ff6b6b"],
                          ["Shopping", 88, "#ffa94d"],
                        ].map(([label, value, color]) => (
                          <Box key={label}>
                            <Group justify="space-between" mb={4}>
                              <Text size="xs" c="dimmed">
                                {label}
                              </Text>
                              <Text size="xs" fw={700}>
                                {value}%
                              </Text>
                            </Group>
                            <Box
                              style={{
                                height: 10,
                                borderRadius: 999,
                                background: "rgba(255,255,255,0.08)",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                style={{
                                  width: `${value}%`,
                                  height: "100%",
                                  borderRadius: 999,
                                  background: color,
                                }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    )}

                    {title === "Reports" && (
                      <Stack gap="xs">
                        <Paper p="sm" withBorder radius="lg">
                          <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                            Export preview
                          </Text>
                          <Text size="sm" fw={700} mt={4}>
                            March 2026 Financial Report
                          </Text>
                          <Text size="xs" c="dimmed" mt={4}>
                            Includes charts, budgets, spending activity, and
                            transaction history.
                          </Text>
                        </Paper>

                        <Group grow>
                          <Paper p="sm" withBorder radius="lg">
                            <Text size="xs" c="dimmed">
                              Type
                            </Text>
                            <Text size="sm" fw={700} mt={4}>
                              Monthly / Yearly
                            </Text>
                          </Paper>
                          <Paper p="sm" withBorder radius="lg">
                            <Text size="xs" c="dimmed">
                              Output
                            </Text>
                            <Text size="sm" fw={700} mt={4}>
                              PDF-ready
                            </Text>
                          </Paper>
                        </Group>
                      </Stack>
                    )}
                  </Paper>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </Grid.Col>
      </Grid>

      <Divider my="xl" />

      <Stack align="center" my={64} gap="md">
        <Title ta="center" order={2}>
          Get started in a few simple steps
        </Title>

        <Text ta="center" c="dimmed" maw={600}>
          Set up accounts, log transactions, and review summaries in minutes.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" my="xl">
        {[
          {
            step: "Step 1",
            title: "Add your accounts",
            desc: "Create cash, bank, or credit accounts so balances and logs stay connected.",
          },
          {
            step: "Step 2",
            title: "Track transactions",
            desc: "Capture income and expenses with category, date, and account details.",
          },
          {
            step: "Step 3",
            title: "Review and adjust",
            desc: "Use the dashboard, budgets, and insights to notice trends and react earlier.",
          },
        ].map((item) => (
          <Card key={item.step} withBorder radius="xl" p="lg">
            <Stack gap="xs">
              <Text size="xs" fw={700} c="lime" tt="uppercase">
                {item.step}
              </Text>

              <Title order={4} fw={600}>
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
