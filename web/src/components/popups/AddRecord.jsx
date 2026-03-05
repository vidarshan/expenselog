import {
  Button,
  Flex,
  Modal,
  NumberInput,
  Select,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePickerInput, TimePicker } from "@mantine/dates";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";
import React, { useEffect } from "react";
import {
  IoAppsOutline,
  IoArrowDown,
  IoArrowUp,
  IoBrushOutline,
  IoCalendarOutline,
  IoCardOutline,
  IoCashOutline,
  IoTextOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/slices/categorySlice";
import { editAccount, getAccounts } from "../../store/slices/accountsSlice";
import { createTransaction } from "../../store/slices/transactionsSlice";

const AddRecord = ({ expenseOpened, setExpenseOpened }) => {
  const dispatch = useDispatch();
  const { loading, error, categories } = useSelector(
    (state) => state.categories,
  );

  const { accounts } = useSelector((state) => state.accounts);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      type: "expense",
      amount: 0,
      name: "",
      category: "",
      date: null,
      time: "",
      notes: "",
      accountId: "",
    },
    validate: {
      name: isNotEmpty("Name cannot be empty"),
      amount: isInRange({ min: 1 }, "Enter a value more than 0"),
      date: isNotEmpty("Date cannot be empty"),
      accountId: isNotEmpty("Account cannot be empty"),
      category: (value, values) =>
        values.type === "expense"
          ? isNotEmpty("Category cannot be empty")(value)
          : null,
    },
  });

  const addOrEditTransaction = async (_type, values) => {
    const payload = {
      name: values.name,
      amount: Number(values.amount) || 0,
      type: values.type,
      accountId: values.accountId,
      categoryId: values.type === "expense" ? values.category : undefined,
      date: values.date,
      source: values.type === "income" ? values.source : undefined,
    };

    await dispatch(createTransaction(payload)).unwrap();

    await dispatch(getAccounts()); // balances updated by backend

    form.reset();
    setExpenseOpened(false);
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
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
              data={(categories || [])?.map((c) => {
                return {
                  value: c._id,
                  label: c.name,
                };
              })}
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
              label="Account"
              leftSection={<IoCardOutline />}
              placeholder="Select account"
              data={(accounts || []).map((a) => ({
                value: a._id,
                label: `${a.name} (${a.type})`,
              }))}
              key={form.key("accountId")}
              {...form.getInputProps("accountId")}
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
            <Select
              mt="sm"
              label="Account"
              leftSection={<IoCardOutline />}
              placeholder="Select account"
              data={(accounts || []).map((a) => ({
                value: a._id,
                label: `${a.name} (${a.type})`,
              }))}
              key={form.key("accountId")}
              {...form.getInputProps("accountId")}
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
  );
};

export default AddRecord;
