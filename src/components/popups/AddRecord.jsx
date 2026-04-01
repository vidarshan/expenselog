import {
  Alert,
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
import { useEffect, useState } from "react";
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
import { getAccounts } from "../../store/slices/accountsSlice";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
} from "../../store/slices/transactionsSlice";
import { getDashboard } from "../../store/slices/dashboardSlice";
import { getBudgets } from "../../store/slices/budgetsSlice";

const AddRecord = ({
  expenseOpened,
  setExpenseOpened,
  mode = "create",
  transaction,
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { currentYear, currentMonth } = useSelector((state) => state.app);
  const { accounts } = useSelector((state) => state.accounts);
  const transactionsPagination = useSelector(
    (state) => state.transactions.transactions.pagination,
  );
  const [saving, setSaving] = useState(false);

  function ymdToLocalDate(value) {
    if (!value) return null;

    const datePart = String(value).slice(0, 10);
    const [y, m, d] = datePart.split("-").map(Number);

    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }

  function getCurrentTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDefaultValues = () => ({
    type: "expense",
    amount: 0,
    name: "",
    category: "",
    date: today,
    time: getCurrentTime(),
    notes: "",
    accountId: "",
  });

  const form = useForm({
    mode: "controlled",
    initialValues: getDefaultValues(),
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

  const addOrEditTransaction = async (values) => {
    try {
      setSaving(true);

      const payload = {
        name: values.name,
        amount: Number(values.amount) || 0,
        type: values.type,
        accountId: values.accountId,
        categoryId: values.type === "expense" ? values.category : undefined,
        date: values.date,
        notes: values.notes,
        time: values.time,
      };

      if (mode === "create") {
        await dispatch(createTransaction(payload)).unwrap();
      } else {
        await dispatch(
          updateTransaction({ id: transaction._id, patch: payload }),
        ).unwrap();
      }

      await Promise.all([
        dispatch(
          getTransactions({
            year: currentYear,
            month: currentMonth,
            page: transactionsPagination?.page || 1,
            limit: transactionsPagination?.limit || 20,
          }),
        ),
        dispatch(getDashboard({ year: currentYear, month: currentMonth })),
        dispatch(getAccounts()),
        dispatch(
          getBudgets({
            year: currentYear,
            month: currentMonth,
          }),
        ),
      ]);

      form.reset();
      setExpenseOpened(false);
    } finally {
      setSaving(false);
    }
  };

  const closeRecordModal = () => {
    form.setValues(getDefaultValues());
    form.clearErrors();
    setExpenseOpened(false);
  };

  useEffect(() => {
    if (!expenseOpened) return;

    if (mode === "edit" && transaction) {
      form.setValues({
        type: transaction.type ?? "expense",
        amount: transaction.amount ?? 0,
        name: transaction.name ?? "",
        category: transaction.categoryId ?? "",
        date: ymdToLocalDate(transaction.date),
        time: transaction.time ?? "",
        notes: transaction.notes ?? "",
        accountId: transaction.accountId ?? "",
      });
    } else {
      form.setValues(getDefaultValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseOpened, mode, transaction]);

  useEffect(() => {
    if (!expenseOpened) return;
    if (!categories.length) {
      dispatch(getCategories());
    }
    if (!accounts.length) {
      dispatch(getAccounts());
    }
  }, [accounts.length, categories.length, dispatch, expenseOpened]);

  return (
    <Modal
      opened={expenseOpened}
      onClose={closeRecordModal}
      title={mode === "edit" ? "Edit Record" : "Add Record"}
      centered
      closeOnClickOutside={false}
    >
      <Alert color="gray" mb="md">
        A record represents a financial transaction. Add income to track money
        you receive, or expenses to track money you spend.
      </Alert>
      <form onSubmit={form.onSubmit((values) => addOrEditTransaction(values))}>
        <Tabs
          mt="xs"
          variant="pills"
          key={form.key("type")}
          {...form.getInputProps("type")}
          defaultValue="expense"
          color="gray"
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
              format="12h"
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
            onClick={closeRecordModal}
            variant="light"
            mr="xs"
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default AddRecord;
