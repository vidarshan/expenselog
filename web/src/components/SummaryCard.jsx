import { SimpleGrid, Paper, Text, Stack } from "@mantine/core";

export function SummaryCards({ income, expenses, savingsRate }) {
  const cards = [
    { label: "Income", value: `$${income}`, color: "lime" },
    { label: "Expenses", value: `$${expenses}`, color: "red" },
    { label: "Savings Rate", value: `${savingsRate}%`, color: "violet" },
  ];

  return (
    <SimpleGrid cols={{ base: 1, md: 3 }}>
      {cards.map((card) => (
        <Paper key={card.label} withBorder radius="lg" p="md">
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              {card.label}
            </Text>
            <Text fw={600} size="lg" c={card.color}>
              {card.value}
            </Text>
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
