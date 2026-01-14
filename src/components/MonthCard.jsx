import {
  Card,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Modal,
} from "@mantine/core";
import React, { useState } from "react";
import { IoRemoveOutline, IoTriangle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const MonthCard = ({ month, amount, logs, isCurrent }) => {
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
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/month/${month.toLowerCase()}`)}
      >
        <Flex
          align="center"
          justify="space-between"
          withBorder
          sx={{
            borderRadius: 8,
            backgroundColor: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Month and Badge */}
          <Flex align="center" gap="xs" style={{ minWidth: 120 }}>
            <Text weight={500}>{month}</Text>
            {isCurrent && (
              <Badge color="green" variant="light">
                Current
              </Badge>
            )}
          </Flex>

          {/* Amount */}
          <Text weight={600} style={{ minWidth: 100 }}>
            ${amount}
          </Text>

          {/* Trend Icons */}
          <Group spacing="xs">
            <IoTriangle color="#66A80F" size={18} /> {/* Up */}
            <IoTriangle color="#FF8787" size={18} /> {/* Down */}
            <IoRemoveOutline color="#adb5bd" size={18} /> {/* Neutral */}
          </Group>

          {/* Number of Logs */}
          <Text color="dimmed" size="sm" style={{ minWidth: 80 }}>
            {logs} transaction{logs !== 1 ? "s" : ""}
          </Text>
        </Flex>
      </Card>
    </>
  );
};

export default MonthCard;
