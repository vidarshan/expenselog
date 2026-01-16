import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Popover,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import {
  IoAppsOutline,
  IoDocumentOutline,
  IoEllipsisVerticalOutline,
  IoTrashOutline,
} from "react-icons/io5";

const QuickActions = ({ withActions, title }) => {
  const [categoryOpened, setCategoryOpened] = useState(false);

  return (
    <Group justify="space-between" mb="sm">
      <Modal
        opened={categoryOpened}
        onClose={() => setCategoryOpened(false)}
        title="Add Category"
        centered
        closeOnClickOutside={false}
      >
        <TextInput
          mt="md"
          label="Category Name"
          placeholder="Enter Cateogory Name"
        />
        <Flex justify="flex-end" mt="md">
          <Button variant="light" mr="xs">
            Cancel
          </Button>
          <Button>Create</Button>
        </Flex>
      </Modal>
      <Box>
        <Title order={2}>{title}</Title>
        <Badge>Open</Badge>
      </Box>
      {withActions && (
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon variant="light" size="lg">
              <IoEllipsisVerticalOutline />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Button
              leftSection={<IoAppsOutline />}
              onClick={() => setCategoryOpened(true)}
              fullWidth
            >
              Create category
            </Button>
            <Button mt="sm" leftSection={<IoDocumentOutline />} fullWidth>
              Export as PDF
            </Button>
            <Button
              color="red"
              mt="sm"
              leftSection={<IoTrashOutline />}
              fullWidth
            >
              Close Report
            </Button>
          </Popover.Dropdown>
        </Popover>
      )}
    </Group>
  );
};

export default QuickActions;
