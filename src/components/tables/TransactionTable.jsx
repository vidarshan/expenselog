import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  Popover,
  Select,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { transactions } from "../../data/mockdata";
import {
  IoAddSharp,
  IoAppsOutline,
  IoArrowDown,
  IoArrowUp,
  IoBrushOutline,
  IoCalendarOutline,
  IoCardOutline,
  IoCashOutline,
  IoClipboardOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useState } from "react";
import { DatePickerInput } from "@mantine/dates";

const TransactionTable = () => {
  const [expenseOpened, setExpenseOpened] = useState(false);
  const [value, setValue] = useState(null);

  const rows = transactions.map(
    ({ title, amount, category, date, paymentMethod, notes }, index) => (
      <Table.Tr key={index + "=" + amount}>
        <Table.Td>{title}</Table.Td>
        <Table.Td>{amount}</Table.Td>
        <Table.Td>{category}</Table.Td>
        <Table.Td>{date}</Table.Td>
        <Table.Td>{paymentMethod}</Table.Td>
        <Table.Td>
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon variant="light">
                <IoClipboardOutline />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">{notes}</Text>
            </Popover.Dropdown>
          </Popover>
        </Table.Td>
      </Table.Tr>
    )
  );

  return (
    <Card h="100%" shadow="xl" withBorder>
      <Modal
        opened={expenseOpened}
        onClose={() => setExpenseOpened(false)}
        title="Add Record"
        centered
        closeOnClickOutside={false}
      >
        <Tabs mt="xs" variant="pills" defaultValue="expense">
          <Tabs.List grow>
            <Tabs.Tab value="expense" leftSection={<IoArrowDown />}>
              Expense
            </Tabs.Tab>
            <Tabs.Tab value="income" leftSection={<IoArrowUp />}>
              Income
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="expense">
            <TextInput
              leftSection={<IoCashOutline />}
              mt="md"
              label="Amount"
              placeholder="Enter Amount"
            />
            <Select
              mt="sm"
              label="Category"
              leftSection={<IoAppsOutline />}
              placeholder="Select Category"
              data={["Food", "Transport", "Shopping", "Bills"]}
            />
            <DatePickerInput
              mt="sm"
              label="Date"
              leftSection={<IoCalendarOutline />}
              placeholder="Select Date"
              value={value}
              onChange={setValue}
            />
            <Select
              mt="sm"
              label="Payment Method"
              leftSection={<IoCardOutline />}
              placeholder="Select Method"
              data={["Cash", "Card", "Bank", "Other"]}
            />
            <Textarea
              mt="sm"
              leftSection={<IoBrushOutline />}
              label="Notes"
              placeholder="Add any notes here..."
            />
          </Tabs.Panel>

          <Tabs.Panel value="income">
            <TextInput
              leftSection={<IoCashOutline />}
              mt="md"
              label="Amount"
              placeholder="Enter Amount"
            />
            <DatePickerInput
              mt="sm"
              label="Date"
              leftSection={<IoCalendarOutline />}
              placeholder="Select Date"
              value={value}
              onChange={setValue}
            />
            <Textarea
              mt="sm"
              leftSection={<IoBrushOutline />}
              label="Notes"
              placeholder="Add any notes here..."
            />
          </Tabs.Panel>
        </Tabs>
        <Flex justify="flex-end" mt="md">
          <Button variant="light" mr="xs">
            Cancel
          </Button>
          <Button>Create</Button>
        </Flex>
      </Modal>
      <Group justify="space-between" mb="lg">
        <Text fw={700}>Transactions</Text>
        <Flex align="center">
          <Button
            size="sm"
            mr="xs"
            leftSection={<IoAddSharp />}
            onClick={() => setExpenseOpened(true)}
          >
            Add Log
          </Button>
          <TextInput
            size="sm"
            leftSection={<IoSearchOutline />}
            placeholder="Search for a transaction"
          />
        </Flex>
      </Group>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Transaction</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Payment Method</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Card>
  );
};

export default TransactionTable;
