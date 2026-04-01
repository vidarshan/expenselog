import {
  Badge,
  Box,
  Group,
  MantineProvider,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";

const theme = {
  defaultRadius: "lg",
  primaryColor: "lime",
};

function HtmlBlock({ html, className }) {
  if (!html) return null;

  return (
    <Box
      className={className}
      w="100%"
      style={{ display: "block" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function StatCard({ label, value }) {
  return (
    <Paper withBorder radius="lg" p="sm" className="report-stat-card">
      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
        {label}
      </Text>
      <Text fw={800} mt={4} size="md">
        {value}
      </Text>
    </Paper>
  );
}

function InsightCard({ item }) {
  const { label, count, behavioral, risk, forecast, nextMove } = item;

  return (
    <Paper withBorder radius="lg" p="md" className="report-insight-card">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {label}
          </Text>
          <Text size="sm" fw={700}>
            {count} signals
          </Text>
        </Group>

        {behavioral ? (
          <Box>
            <Text fw={700} size="sm">
              {behavioral.title || "Behavioral insight"}
            </Text>
            <Text size="sm" c="dimmed">
              {behavioral.message || ""}
            </Text>
          </Box>
        ) : null}

        {risk ? (
          <Box>
            <Text fw={700} size="sm">
              Risk signal
            </Text>
            <Text size="sm" c="dimmed">
              {risk.title || "Risk"} {risk.message ? `• ${risk.message}` : ""}
            </Text>
          </Box>
        ) : null}

        {forecast ? (
          <Box>
            <Text fw={700} size="sm">
              {forecast.title || "Forecast"}
            </Text>
            <Text size="sm" c="dimmed">
              {forecast.message || ""}
            </Text>
          </Box>
        ) : null}

        {nextMove ? (
          <Paper withBorder radius="md" p="sm" bg="rgba(255,255,255,0.85)">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Next best move
            </Text>
            <Text fw={700} size="sm" mt={4}>
              {nextMove.title || "Recommendation"}
            </Text>
            <Text size="sm" c="dimmed">
              {nextMove.message || ""}
            </Text>
          </Paper>
        ) : null}
      </Stack>
    </Paper>
  );
}

function SectionTable({ rows }) {
  return (
    <Table
      withTableBorder
      withColumnBorders={false}
      highlightOnHover={false}
      striped={false}
      className="report-table"
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Time</Table.Th>
          <Table.Th ta="right">Amount</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.length ? (
          rows.map((row, index) => (
            <Table.Tr key={`${row.name}-${row.date}-${index}`}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.category}</Table.Td>
              <Table.Td>{row.type}</Table.Td>
              <Table.Td>{row.date}</Table.Td>
              <Table.Td>{row.time}</Table.Td>
              <Table.Td ta="right" fw={700}>
                {row.amount}
              </Table.Td>
            </Table.Tr>
          ))
        ) : (
          <Table.Tr>
            <Table.Td colSpan={6} ta="center" c="dimmed">
              No transactions recorded for this period.
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}

function BudgetStatusBadge({ status }) {
  const color =
    status === "Over" ? "red" : status === "Warning" ? "yellow" : "green";

  return <Badge color={color}>{status}</Badge>;
}

function BudgetSection({ budgets }) {
  const hasBudgetContent =
    (budgets.items?.length || 0) > 0 ||
    (budgets.unbudgeted?.length || 0) > 0 ||
    Number(budgets.summary?.totalLimit || 0) > 0 ||
    Number(budgets.summary?.totalSpentAll || 0) > 0;

  if (!hasBudgetContent) {
    return null;
  }

  return (
    <Stack gap="md">
      <Box>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          Budget details
        </Text>
        <Title order={5}>Budgeted categories and unbudgeted spending</Title>
      </Box>

      <SimpleGrid cols={4} spacing="sm">
        <StatCard label="Total Budget" value={budgets.summary.totalLimit} />
        <StatCard
          label="Budgeted Spent"
          value={budgets.summary.totalSpentBudgeted}
        />
        <StatCard label="Total Spent" value={budgets.summary.totalSpentAll} />
        <StatCard
          label="Over Budget"
          value={String(budgets.summary.overBudgetCount)}
        />
      </SimpleGrid>

      <Paper withBorder radius="lg" p="md">
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Budgeted categories
              </Text>
              <Title order={5}>Tracked categories</Title>
            </Box>
            <Badge variant="light">{budgets.items.length}</Badge>
          </Group>

          {budgets.items.length ? (
            <SimpleGrid cols={2} spacing="md">
              {budgets.items.map((item) => (
                <Paper
                  key={item.categoryId || item.categoryName}
                  withBorder
                  radius="lg"
                  p="sm"
                >
                  <Stack gap="xs">
                    <Group justify="space-between" align="flex-start">
                      <Box>
                        <Text fw={700} size="sm">
                          {item.categoryName}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {item.spent} spent of {item.limit}
                        </Text>
                      </Box>
                      <BudgetStatusBadge status={item.status} />
                    </Group>

                    <Text size="sm" c="dimmed">
                      {item.percent}
                    </Text>
                    <Text
                      size="sm"
                      c={item.status === "Over" ? "red" : "dimmed"}
                    >
                      {item.remainingLabel}: {item.remaining}
                    </Text>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          ) : (
            <Text c="dimmed" size="sm">
              No budgeted categories found.
            </Text>
          )}
        </Stack>
      </Paper>

      <Paper withBorder radius="lg" p="md">
        <Stack gap="sm">
          <Title order={5}>Unbudgeted Spending</Title>
          <Table className="report-table" withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Category</Table.Th>
                <Table.Th ta="right">Spent</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {budgets.unbudgeted.length ? (
                budgets.unbudgeted.map((item) => (
                  <Table.Tr key={item.categoryId || item.categoryName}>
                    <Table.Td>{item.categoryName}</Table.Td>
                    <Table.Td ta="right" fw={700}>
                      {item.spent}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={2} c="dimmed">
                    No unbudgeted spending found.
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Stack>
      </Paper>
    </Stack>
  );
}

const PrintableReport = ({ report }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Box className="report-root" data-mantine-color-scheme="light">
        <Paper withBorder radius="xl" p="md" mb="md" className="report-cover">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Financial report
                </Text>
                <Title order={2} mt={4}>
                  {report.periodLabel}
                </Title>
                <Text size="sm" c="dimmed" mt={6}>
                  A compact print summary with charts, budgets, activity, and
                  available insights.
                </Text>
              </Box>
              <Paper
                withBorder
                radius="lg"
                p="sm"
                bg="rgba(255,255,255,0.9)"
                miw={150}
              >
                <Title order={3} c="lime.8">
                  ExpenseLog
                </Title>
              </Paper>
            </Group>

            <SimpleGrid cols={3} spacing="sm">
              <StatCard label="Income" value={report.totals.income} />
              <StatCard label="Expenses" value={report.totals.expenses} />
              <StatCard
                label="Transactions"
                value={String(report.totals.count)}
              />
            </SimpleGrid>
          </Stack>
        </Paper>

        {report.insights.length ? (
          <Paper withBorder radius="xl" p="md" mb="md">
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Insights
                  </Text>
                  <Title order={4}>{report.insightsTitle}</Title>
                  <Text size="sm" c="dimmed">
                    {report.insightsSubtitle}
                  </Text>
                </Box>
                <Badge variant="light">
                  {report.insights.length} period
                  {report.insights.length > 1 ? "s" : ""}
                </Badge>
              </Group>
              <SimpleGrid cols={1} spacing="md">
                {report.insights.map((item) => (
                  <InsightCard key={item.label} item={item} />
                ))}
              </SimpleGrid>
            </Stack>
          </Paper>
        ) : null}

        <Paper withBorder radius="xl" p="md" mb="md">
          <Stack gap="md">
            <SimpleGrid cols={2} spacing="md">
              <HtmlBlock html={report.overview.primaryLeft} />
              <HtmlBlock html={report.overview.primaryRight} />
            </SimpleGrid>
            <HtmlBlock html={report.overview.secondaryLeft} />
            <HtmlBlock html={report.overview.secondaryRight} />
          </Stack>
        </Paper>

        <Stack gap="md">
          {report.sections.map((section) => (
            <Paper
              key={section.label}
              withBorder
              radius="xl"
              p="md"
              className="report-section"
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Period
                    </Text>
                    <Title order={4}>{section.label}</Title>
                  </Box>
                  <Badge variant="light">{section.summary.count} records</Badge>
                </Group>

                <SimpleGrid cols={4} spacing="sm">
                  <StatCard label="Income" value={section.summary.income} />
                  <StatCard label="Expenses" value={section.summary.expenses} />
                  <StatCard label="Net" value={section.summary.net} />
                  <StatCard
                    label="Transactions"
                    value={String(section.summary.count)}
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} spacing="md">
                  <HtmlBlock html={section.charts.topLeft} />
                  <HtmlBlock html={section.charts.topRight} />
                </SimpleGrid>

                <HtmlBlock html={section.charts.bottomLeft} />
                <HtmlBlock html={section.charts.bottomRight} />

                <BudgetSection budgets={section.budgets} />

                <SectionTable rows={section.rows} />
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </MantineProvider>
  );
};

export default PrintableReport;
