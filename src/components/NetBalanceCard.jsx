import { Group, Paper, Stack, ThemeIcon, Text } from "@mantine/core";
import { IoWalletOutline } from "react-icons/io5";

export function NetBalanceCard({ net, change }) {
  const positive = change >= 0;

  return (
    <Paper withBorder radius="xl" p="lg">
      <Stack gap={4}>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Net Balance
          </Text>
          <ThemeIcon variant="filled" color="lime">
            <IoWalletOutline size={16} />
          </ThemeIcon>
        </Group>

        <Text size="32px" fw={700}>
          ${net.toLocaleString()}
        </Text>

        <Text size="sm" c={positive ? "lime" : "red"}>
          {positive ? "+" : ""}${change} this month
        </Text>
      </Stack>
    </Paper>
  );
}
