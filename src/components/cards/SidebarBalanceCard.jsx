import { ActionIcon, Flex, Group, Paper, Text, Tooltip } from "@mantine/core";
import {
  IoBusinessOutline,
  IoCardOutline,
  IoCashOutline,
} from "react-icons/io5";

const SidebarBalanceCard = ({ title, balance, type }) => {
  function getTypeMeta(type) {
    if (type === "cash") return { icon: <IoCashOutline size={16} /> };
    if (type === "credit") return { icon: <IoCardOutline size={16} /> };

    return { icon: <IoBusinessOutline size={16} /> };
  }

  const meta = getTypeMeta(type);

  return (
    <Paper>
      <Flex align="center" justify="space-between" gap="xs">
        <Group gap={6} style={{ flex: 1, minWidth: 0 }}>
          <ActionIcon
            color={
              type === "cash" ? "lime" : type === "credit" ? "grape" : "blue"
            }
            variant="filled"
            radius="sm"
          >
            {meta.icon}
          </ActionIcon>

          <Tooltip label={title} withArrow>
            <Text size="sm" fw={600} truncate style={{ flex: 1 }}>
              {title}
            </Text>
          </Tooltip>
        </Group>

        <Text size="sm" fw={700} style={{ whiteSpace: "nowrap" }}>
          ${Number(balance || 0).toFixed(2)}
        </Text>
      </Flex>
    </Paper>
  );
};

export default SidebarBalanceCard;
