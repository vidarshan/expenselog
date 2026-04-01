import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";
import { useEffect } from "react";
import {
  IoAppsOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoGridOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { createBudget, getBudgets } from "../../store/slices/budgetsSlice";

const MONTH_OPTIONS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const AddBudget = ({
  opened,
  setOpened,
  mode = "create",
  budget = null,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { currentYear, currentMonth } = useSelector((state) => state.app);
  const currentCalendarYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, index) => {
    const year = currentCalendarYear - 3 + index;
    return { value: String(year), label: String(year) };
  });

  function normalizeCategoryId(categoryId) {
    if (!categoryId) return "";

    if (typeof categoryId === "string") return categoryId;
    if (typeof categoryId === "object" && categoryId._id) {
      return String(categoryId._id);
    }

    return "";
  }

  const form = useForm({
    mode: "controlled",
    initialValues: {
      year: String(currentYear),
      month: String(currentMonth),
      categoryId: "",
      limit: 0,
    },
    validate: {
      year: isNotEmpty("Year is required"),
      month: isNotEmpty("Month is required"),
      categoryId: isNotEmpty("Category is required"),
      limit: isInRange({ min: 1 }, "Limit must be more than 0"),
    },
  });

  useEffect(() => {
    if (!opened) return;

    if (mode === "edit" && budget) {
      form.setValues({
        year: String(budget.year ?? currentYear),
        month: String(budget.month ?? currentMonth),
        categoryId: normalizeCategoryId(budget.categoryId),
        limit: Number(budget.limit ?? 0),
      });
    } else {
      form.setValues({
        year: String(currentYear),
        month: String(currentMonth),
        categoryId: "",
        limit: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, mode, budget, currentYear, currentMonth]);

  async function handleSubmit(values) {
    const payload = {
      year: Number(values.year),
      month: Number(values.month),
      categoryId: values.categoryId,
      limit: Number(values.limit),
    };

    await dispatch(createBudget(payload)).unwrap();

    await dispatch(
      getBudgets({
        year: Number(values.year),
        month: Number(values.month),
      }),
    );

    form.reset();
    setOpened(false);
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IoGridOutline />
          <Text fw={600}>{mode === "create" ? "Create" : "Edit"} Budget</Text>
        </Group>
      }
      centered
      closeOnClickOutside={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Category"
            leftSection={<IoAppsOutline />}
            placeholder="Select Category"
            data={(categories || []).map((c) => ({
              value: String(c._id),
              label: c.name,
            }))}
            {...form.getInputProps("categoryId")}
          />

          <NumberInput
            label="Limit"
            leftSection={<IoCashOutline />}
            placeholder="Enter Limit"
            min={1}
            {...form.getInputProps("limit")}
          />

          <Select
            label="Year"
            leftSection={<IoCalendarOutline />}
            placeholder="Select Year"
            data={yearOptions}
            allowDeselect={false}
            {...form.getInputProps("year")}
          />

          <Select
            label="Month"
            leftSection={<IoCalendarOutline />}
            placeholder="Select Month"
            data={MONTH_OPTIONS}
            allowDeselect={false}
            {...form.getInputProps("month")}
          />

          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddBudget;
