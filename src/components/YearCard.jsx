import { Card, Flex, Group, Modal, Text } from "@mantine/core";
import React, { useState } from "react";
import { IoRemoveOutline, IoTriangle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const YearCard = ({ year, isCurrent }) => {
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
        onClick={() => navigate(`/reports/${year}`)}
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
            <Text weight={500}>{year}</Text>
            {isCurrent && (
              <Badge color="green" variant="filled">
                Current
              </Badge>
            )}
          </Flex>

          {/* Amount */}
          <Text weight={600} style={{ minWidth: 100 }}>
            ${0}
          </Text>

          {/* Trend Icons */}
          <Group spacing="xs">
            <IoTriangle color="#66A80F" size={18} /> {/* Up */}
            <IoTriangle color="#FF8787" size={18} rotate="35" /> {/* Down */}
            <IoRemoveOutline color="#adb5bd" size={18} /> {/* Neutral */}
          </Group>

          {/* Number of Logs */}
          <Text color="dimmed" size="sm" style={{ minWidth: 80 }}>
            {/* {logs} transaction{logs !== 1 ? "s" : ""} */}
          </Text>
        </Flex>
      </Card>
    </>
  );
};

export default YearCard;
