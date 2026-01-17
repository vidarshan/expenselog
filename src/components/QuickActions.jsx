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
  Text,
} from "@mantine/core";
import { useState } from "react";
import {
  IoAppsOutline,
  IoCloseOutline,
  IoDocumentOutline,
  IoEllipsisVerticalOutline,
  IoTextOutline,
  IoTrashOutline,
} from "react-icons/io5";

const QuickActions = ({ withActions, title }) => {
  const [categoryOpened, setCategoryOpened] = useState(false);
  const [closeReportOpened, setCloseReportOpened] = useState(false);

  return (
    <Group justify="space-between" mb="sm">
      <Modal
        opened={closeReportOpened}
        onClose={() => setCloseReportOpened(false)}
        title="Close Report"
        centered
        closeOnClickOutside={false}
      >
        <Text>
          Closing will archive this report which is an irreversible action. Do
          you wish to continue?
        </Text>
        <Flex justify="flex-end" mt="md">
          <Button leftSection={<IoCloseOutline />} variant="light" mr="xs">
            Cancel
          </Button>
          <Button leftSection={<IoTrashOutline />} color="red">
            Close
          </Button>
        </Flex>
      </Modal>
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
          leftSection={<IoTextOutline />}
          placeholder="Enter Category Name"
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
              onClick={() => setCloseReportOpened(true)}
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
