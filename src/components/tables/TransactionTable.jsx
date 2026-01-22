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

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      type: "expense",
      amount: 0,
      name: "",
      category: "",
      date: null,
      time: "",
      method: "",
      notes: "",
    },
    validate: {
      name: isNotEmpty("Name cannot be empty"),
      amount: isInRange({ min: 1 }, "Enter a value more than 0"),
      date: isNotEmpty("Date cannot be empty"),
      method: (value, values) =>
        values.type === "income"
          ? null
          : isNotEmpty("Method cannot be empty")(value),
      time: (value, values) =>
        values.type === "income"
          ? null
          : isNotEmpty("Time cannot be empty")(value),
      category: (value, values) =>
        values.type === "income"
          ? null
          : isNotEmpty("Category cannot be empty")(value),
    },
  });

  // useEffect(() => {
  //   setTransactions(mockTransactions);
  // }, []);

  const addOrEditTransaction = (type, values) => {
    console.log(type);
    const newTransaction = {
      title: values?.name,
      amount: values?.amount,
      category: values?.category,
      date: values?.date,
      paymentMethod: values?.method,
      notes: values?.notes,
      type: values?.type,
    };
    if (selectedIndex === null) {
      console.log(values);
      transactions.push(newTransaction);
      form.reset();
    } else {
      console.log(selectedIndex);
      const updatedTransactions = transactions.map((item, i) =>
        i === selectedIndex ? { ...item, ...newTransaction } : item,
      );
      setTransactions(updatedTransactions);
    }
    setExpenseOpened(false);
  };

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
            <Badge variant="light" size="xs">
              Income
            </Badge>
          ) : (
            <Badge color="red" variant="light" size="xs">
              Expense
            </Badge>
          )}
        </Table.Td>
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
        <Table.Td>
          <Button
            leftSection={<IoTrashOutline />}
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              deleteTransaction(index);
            }}
            variant="light"
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
      <Modal
        opened={expenseOpened}
        onClose={() => setExpenseOpened(false)}
        title="Add Record"
        centered
        closeOnClickOutside={false}
      >
        <form
          onSubmit={form.onSubmit((values) =>
            addOrEditTransaction("add", values),
          )}
        >
          <Tabs
            mt="xs"
            variant="pills"
            key={form.key("type")}
            {...form.getInputProps("type")}
            defaultValue="expense"
          >
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
                leftSection={<IoTextOutline />}
                mt="md"
                label="Name"
                placeholder="Enter Name"
                key={form.key("name")}
                {...form.getInputProps("name")}
              />
              <NumberInput
                leftSection={<IoCashOutline />}
                mt="md"
                min={1}
                label="Amount"
                placeholder="Enter Amount"
                key={form.key("amount")}
                {...form.getInputProps("amount")}
              />
              <Select
                mt="sm"
                label="Category"
                leftSection={<IoAppsOutline />}
                placeholder="Select Category"
                data={["Food", "Transport", "Shopping", "Bills"]}
                key={form.key("category")}
                {...form.getInputProps("category")}
              />
              <DatePickerInput
                mt="sm"
                label="Date"
                leftSection={<IoCalendarOutline />}
                placeholder="Select Date"
                key={form.key("date")}
                {...form.getInputProps("date")}
              />
              <TimePicker
                mt="sm"
                label="Time"
                leftSection={<IoTimeOutline />}
                placeholder="Select Time"
                format="24h"
                key={form.key("time")}
                {...form.getInputProps("time")}
              />
              <Select
                mt="sm"
                label="Payment Method"
                leftSection={<IoCardOutline />}
                placeholder="Select Method"
                data={["Cash", "Card", "Bank", "Other"]}
                key={form.key("method")}
                {...form.getInputProps("method")}
              />
              <Textarea
                mt="sm"
                leftSection={<IoBrushOutline />}
                label="Notes"
                placeholder="Add any notes here..."
                key={form.key("notes")}
                {...form.getInputProps("notes")}
              />
            </Tabs.Panel>

            <Tabs.Panel value="income">
              <TextInput
                leftSection={<IoTextOutline />}
                mt="md"
                label="Name"
                placeholder="Enter Name"
                key={form.key("name")}
                {...form.getInputProps("name")}
              />
              <NumberInput
                leftSection={<IoCashOutline />}
                mt="md"
                min={1}
                label="Amount"
                placeholder="Enter Amount"
                key={form.key("amount")}
                {...form.getInputProps("amount")}
              />
              <DatePickerInput
                mt="sm"
                label="Date"
                leftSection={<IoCalendarOutline />}
                placeholder="Select Date"
                key={form.key("date")}
                {...form.getInputProps("date")}
              />
              <Textarea
                mt="sm"
                leftSection={<IoBrushOutline />}
                label="Notes"
                placeholder="Add any notes here..."
                key={form.key("notes")}
                {...form.getInputProps("notes")}
              />
            </Tabs.Panel>
          </Tabs>
          <Flex justify="flex-end" mt="md">
            <Button
              onClick={() => setExpenseOpened(false)}
              variant="light"
              mr="xs"
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </Flex>
        </form>
      </Modal>
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
