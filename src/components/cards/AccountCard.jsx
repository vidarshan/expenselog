import {
  Badge,
  Card,
  Flex,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IoBusinessOutline,
  IoCardOutline,
  IoCashOutline,
} from "react-icons/io5";

function money(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getTypeMeta(type) {
  if (type === "cash") {
    return {
      label: "CASH",
      color: "lime",
      icon: <IoCashOutline size={18} />,
    };
  }

  if (type === "credit") {
    return {
      label: "CREDIT",
      color: "grape",
      icon: <IoCardOutline size={18} />,
    };
  }

  return {
    label: "BANK",
    color: "blue",
    icon: <IoBusinessOutline size={18} />,
  };
}

const AccountCard = ({ account, onSelect }) => {
  const meta = getTypeMeta(account?.type);
  const isCredit = account?.type === "credit";

  return (
    <Card
      withBorder
      p="md"
      radius="lg"
      onClick={onSelect}
      style={{ cursor: "pointer" }}
    >
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start">
          <ThemeIcon color={meta.color} variant="light" size="lg" radius="md">
            {meta.icon}
          </ThemeIcon>

          <Stack gap={4}>
            <Text fw={700}>{account?.name || "Unnamed"}</Text>

            <Group gap="xs">
              <Badge color={meta.color} variant="filled">
                {meta.label}
              </Badge>

              <Text size="sm" c="dimmed">
                Initial: ${money(account?.initialBalance)}
              </Text>
            </Group>

            {isCredit && (
              <Text size="sm" c="dimmed">
                Limit: ${money(account?.creditLimit)}
              </Text>
            )}
          </Stack>
        </Group>

        <Flex gap="sm" align="flex-start">
          <Stack gap={0} align="flex-end">
            <Text size="sm" c="dimmed">
              {isCredit ? "Owed" : "Balance"}
            </Text>
            <Text fw={700}>${money(account?.currentBalance)}</Text>
          </Stack>
        </Flex>
      </Group>
    </Card>
  );
};

export default AccountCard;
