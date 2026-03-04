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

const AddRecord = ({ expenseOpened, setExpenseOpened }) => {
  const dispatch = useDispatch();
  const { loading, error, categories } = useSelector(
    (state) => state.categories,
  );
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

  const addOrEditTransaction = (type, values) => {
    const newTransaction = {
      title: values?.name,
      amount: values?.amount,
      category: values?.category,
      date: values?.date,
      paymentMethod: values?.method,
      notes: values?.notes,
      type: values?.type,
    };
    // if (selectedIndex === null) {
    //   transactions.push(newTransaction);
    //   form.reset();
    // } else {
    //   const updatedTransactions = transactions.map((item, i) =>
    //     i === selectedIndex ? { ...item, ...newTransaction } : item,
    //   );
    //   setTransactions(updatedTransactions);
    // }
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
  );
};

export default AddRecord;
