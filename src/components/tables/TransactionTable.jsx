import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  NumberInput,
  Popover,
  Select,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { recentTransactions as mockTransactions } from "../../data/mockdata";
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
  IoTextOutline,
  IoTimeOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useEffect, useState } from "react";
import { DatePickerInput, TimePicker } from "@mantine/dates";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";

const TransactionTable = ({ disableAddLog }) => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [expenseOpened, setExpenseOpened] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // useEffect(() => {
  //   setTransactions(mockTransactions);
  // }, []);

  const deleteTransaction = (index) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
    setSelectedIndex(null);
  };

  const rows = transactions.map(
    ({ title, amount, category, date, paymentMethod, notes, type }, index) => (
      <Table.Tr
        style={{ cursor: "pointer" }}
        key={index + "=" + amount}
        onClick={() => {
          setSelectedIndex(index);
          form.setValues({
            type: type,
            amount,
            name: title,
            category,
            date,
            time: "",
            method: paymentMethod,
            notes,
          });
          setExpenseOpened(true);
        }}
      >
        <Table.Td>{title}</Table.Td>
        <Table.Td>${amount}</Table.Td>
        <Table.Td>{category}</Table.Td>
        <Table.Td>{date}</Table.Td>
        <Table.Td>
          {type === "income" ? (
            <Badge variant="filled" size="xs">
              Income
            </Badge>
          ) : (
            <Badge color="red" variant="filled" size="xs">
              Expense
            </Badge>
          )}
        </Table.Td>
        <Table.Td>{paymentMethod}</Table.Td>
        <Table.Td>
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon variant="filled">
                <IoClipboardOutline />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">{notes}</Text>
            </Popover.Dropdown>
          </Popover>
        </Table.Td>
        <Table.Td>
          <Button
            leftSection={<IoTrashOutline />}
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              deleteTransaction(index);
            }}
            variant="filled"
            size="xs"
          >
            Delete
          </Button>
        </Table.Td>
      </Table.Tr>
    ),
  );

  return (
    <Card h="100%" shadow="xl" withBorder>
      <Group justify="space-between" mb="lg">
        <Text fw={700}>Transactions</Text>
        <Flex align="center">
          {!disableAddLog && (
            <Button
              size="sm"
              mr="xs"
              leftSection={<IoAddSharp />}
              onClick={() => {
                form.reset();
                setExpenseOpened(true);
              }}
            >
              Add Log
            </Button>
          )}
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
            <Table.Th>Type</Table.Th>
            <Table.Th>Payment Method</Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Card>
  );
};

export default TransactionTable;
