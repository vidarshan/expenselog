import {
  Card,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Modal,
  ActionIcon,
} from "@mantine/core";
import React, { useState } from "react";
import {
  IoRemoveOutline,
  IoTrendingDown,
  IoTrendingUp,
  IoTriangle,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const MonthCard = ({ month, year, amount, logs, isCurrent, trend = "up" }) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(!opened)}
        title="Authentication"
        centered
      >
        sddfddf
      </Modal>
      <Card
        withBorder
        mb="xs"
        className="card"
        onClick={() => navigate(`/reports/${year}/${month.toLowerCase()}`)}
      >
        <Flex align="center" justify="space-between">
          {/* Left: Month + badge */}
          <Flex direction="column" gap={4}>
            <Group gap="xs">
              <Text fw={600}>{month}</Text>
              {isCurrent && (
                <Badge size="xs" color="green" variant="light">
                  Current
                </Badge>
              )}
            </Group>
            <Text size="xs" c="dimmed">
              {logs} transaction{logs !== 1 ? "s" : ""}
            </Text>
          </Flex>

          {/* Middle: Amount */}
          <Flex direction="column" align="flex-end">
            <Text fw={700} size="lg">
              ${amount}
            </Text>
            <Text
              size="xs"
              c={trend === "up" ? "green" : trend === "down" ? "red" : "dimmed"}
            >
              {trend === "up" && "↑ Gain"}
              {trend === "down" && "↓ Loss"}
              {trend === "neutral" && "No change"}
            </Text>
          </Flex>

          {/* Right: Trend icon */}
          <ActionIcon
            variant="light"
            color={trend === "up" ? "green" : trend === "down" ? "red" : "gray"}
            radius="xl"
            size="lg"
          >
            {trend === "up" && <IoTrendingUp />}
            {trend === "down" && <IoTrendingDown />}
            {trend === "neutral" && <IoRemoveOutline />}
          </ActionIcon>
        </Flex>
      </Card>
    </>
  );
};

export default MonthCard;
