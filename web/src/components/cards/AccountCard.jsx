import {
  Card,
  Group,
  Text,
  Badge,
  Stack,
  Button,
  Divider,
  ThemeIcon,
  Flex,
  Box,
  Modal,
} from "@mantine/core";
import {
  IoCashOutline,
  IoBusinessOutline,
  IoCardOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";
import MoreOptions from "../popups/MoreOptions";

function money(n) {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getTypeMeta(type) {
  if (type === "cash")
    return { label: "CASH", color: "teal", icon: <IoCashOutline size={18} /> };
  if (type === "credit")
    return {
      label: "CREDIT",
      color: "grape",
      icon: <IoCardOutline size={18} />,
    };
  return {
    label: "BANK",
    color: "blue",
    icon: <IoBusinessOutline size={18} />,
  };
}

export default function AccountCard({
  account,
  onSelect,
  onEdit,
  accountOpened,
  close,
}) {
  const name = account?.name || "Unnamed";
  const type = account?.type || "bank";

  const initialBalance = Number(account?.initialBalance || 0);
  const currentBalance = Number(account?.currentBalance || 0);
  const creditLimit = Number(account?.creditLimit || 0);

  const isCredit = type === "credit";
  const available = isCredit ? Math.max(0, creditLimit - currentBalance) : 0;

  const meta = getTypeMeta(type);

  return (
    <Modal opened={accountOpened} onClose={close} title="Authentication">
      <Card withBorder p="lg" onClick={onSelect}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="sm" align="flex-start" wrap="nowrap">
            <ThemeIcon
              color={
                type === "cash" ? "lime" : type === "credit" ? "grape" : "blue"
              }
              size={44}
              radius="xl"
              variant="light"
            >
              {meta.icon}
            </ThemeIcon>

            <Stack gap={4}>
              <Text fw={800} size="xl" lh={1.1}>
                {name}
              </Text>

              <Group gap="sm">
                <Badge color={meta.color} variant="light" radius="xl">
                  {meta.label}
                </Badge>

                <Text size="sm" c="dimmed">
                  Initial: ${money(initialBalance)}
                </Text>
              </Group>
            </Stack>
          </Group>
          <Flex gap="sm" align="center">
            <Stack gap={2} align="flex-end">
              <Text size="sm" c="dimmed">
                {isCredit ? "Owed" : "Balance"}
              </Text>
              <Text fw={900} size="xl">
                ${money(currentBalance)}
              </Text>
            </Stack>
            <MoreOptions
              options={({ close }) => (
                <Stack>
                  <Button
                    color="red"
                    variant="light"
                    leftSection={<IoPencilOutline />}
                    onClick={(e) => {
                      e.stopPropagation();
                      close();
                      onEdit && onEdit();
                    }}
                  >
                    Edit Account
                  </Button>

                  {/* <Button
                    color="red"
                    variant="light"
                    leftSection={<IoTrashOutline />}
                    onClick={(e) => {
                      e.stopPropagation();
                      close();
                      onDelete && onDelete(account);
                    }}
                  >
                    Delete Account
                  </Button> */}
                </Stack>
              )}
            />
          </Flex>
        </Group>
        {isCredit && (
          <>
            <Divider my="md" />
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Limit: ${money(creditLimit)}
              </Text>
              <Text size="sm" c="dimmed">
                Available: ${money(available)}
              </Text>
            </Group>
          </>
        )}
      </Card>
    </Modal>
  );
}
