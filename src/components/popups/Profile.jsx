import {
  ActionIcon,
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  Radio,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import {
  IoAddSharp,
  IoBriefcaseOutline,
  IoCashOutline,
  IoInformationCircleSharp,
  IoLockClosedOutline,
  IoMailOpenOutline,
  IoTextOutline,
  IoTrashOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/slices/authSlice";
import Loading from "../Loading";

const Profile = ({ opened, setOpened, handleLogout }) => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const [info, setInfo] = useState(false);
  const dispatch = useDispatch();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      salary: {
        type: user?.salary?.type || "fixed",
        fixed: {
          amount: user?.salary?.fixed?.amount || 0,
        },
        variable:
          user?.salary?.variable?.length > 0
            ? user.salary.variable.map((item) => ({
                id: nanoid(),
                name: item.name || "",
                amount: item.amount || 0,
              }))
            : [
                {
                  id: nanoid(),
                  name: "",
                  amount: 0,
                },
              ],
      },
    },

    validate: {
      username: (value) => (value.trim() ? null : "Name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      salary: {
        fixed: {
          amount: (value, values) =>
            values.salary.type === "fixed" && Number(value) < 0
              ? "Amount cannot be negative"
              : null,
        },
      },
    },
  });

  const addIncomeSource = () => {
    form.insertListItem("salary.variable", {
      id: nanoid(),
      name: "",
      amount: 0,
    });
  };

  const removeIncomeSource = (index) => {
    if (form.values.salary.variable.length > 1) {
      form.removeListItem("salary.variable", index);
    }
  };

  const handleSubmit = (values) => {
    const payload = {
      username: values.username,
      email: values.email,
      password: values.password || undefined,
      salary: {
        type: values.salary.type,
        fixed:
          values.salary.type === "fixed"
            ? {
                amount: Number(values.salary.fixed.amount) || 0,
              }
            : {},
        variable:
          values.salary.type === "variable"
            ? values.salary.variable
                .map((item) => ({
                  name: item.name.trim(),
                  amount: Number(item.amount) || 0,
                }))
                .filter((item) => item.name && item.amount > 0)
            : [],
      },
    };

    dispatch(updateUser(payload));
    setOpened(false);
  };

  useEffect(() => {
    if (!opened || !user) return;
    form.setValues({
      username: user.username ?? "",
      email: user.email ?? "",
      password: "",
      salary: {
        type: user.salary?.type ?? "fixed",
        fixed: {
          amount: user.salary?.fixed?.amount ?? 0,
        },
        variable:
          user.salary?.type === "variable" && user.salary?.variable?.length
            ? user.salary.variable.map((item) => ({
                id: nanoid(),
                name: item.name ?? "",
                amount: item.amount ?? 0,
              }))
            : [
                {
                  id: nanoid(),
                  name: "",
                  amount: 0,
                },
              ],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, user]);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      closeOnClickOutside={false}
      centered
      size="lg"
    >
      {error && (
        <Alert
          icon={<IoWarningOutline />}
          my="lg"
          variant="filled"
          color="red"
          title={error}
        />
      )}
      {loading ? (
        <Loading title="Updating your data..." />
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group justify="space-between">
            <Flex gap="xs">
              <Avatar size="lg" color="indigo" variant="filled" radius="xl">
                {user?.username?.[0] || "U"}
              </Avatar>

              <Box>
                <Title order={3}>{user?.username || "User"}</Title>
                <Text>{user?.email || ""}</Text>
              </Box>
            </Flex>

            <Button color="red" variant="filled" onClick={handleLogout}>
              Logout
            </Button>
          </Group>

          <Divider label="Profile Information" my="sm" />

          <TextInput
            leftSection={<IoMailOpenOutline />}
            label="Email"
            placeholder="Type in your email"
            {...form.getInputProps("email")}
          />

          <TextInput
            leftSection={<IoTextOutline />}
            mt="md"
            label="Name"
            placeholder="Type in your name"
            {...form.getInputProps("username")}
          />

          <PasswordInput
            leftSection={<IoLockClosedOutline />}
            mt="md"
            label="Password"
            description="Leave blank to keep current password"
            {...form.getInputProps("password")}
          />

          <Divider label="Financial Information" mt="md" />
          <Group justify="flex-end">
            <Button
              mb="sm"
              size="xs"
              variant="transparent"
              onClick={() => setInfo(!info)}
            >
              {!info ? "Show More Info" : "Collapse Info"}
            </Button>
          </Group>

          <Alert
            icon={<IoInformationCircleSharp />}
            variant="filled"
            color="gray"
            title="Fixed income"
          >
            {info &&
              ` You earn the same amount every month (like a salary). ExpenseLog
            will automatically use this amount as your monthly income baseline
            when calculating your monthly log, balance, and spending insights.`}
          </Alert>
          <Alert
            icon={<IoInformationCircleSharp />}
            my="xs"
            color="gray"
            variant="filled"
            title="Variable income"
          >
            {info &&
              `Your earnings change from month to month (like freelance or hourly
            work). ExpenseLog will let you define multiple income sources, and
            you can record the actual income each month so your monthly log
            reflects real earnings.`}
          </Alert>
          <Radio.Group
            label="Income Type"
            {...form.getInputProps("salary.type")}
          >
            <Group mt="xs">
              <Radio
                value="fixed"
                label="Fixed salary (same amount every month)"
              />
              <Radio
                value="variable"
                label="Variable income (freelance / hourly / tips)"
              />
            </Group>
          </Radio.Group>

          {form.values.salary.type === "fixed" ? (
            <NumberInput
              mt="sm"
              leftSection={<IoCashOutline />}
              label="Monthly Salary"
              placeholder="Enter your salary"
              min={0}
              {...form.getInputProps("salary.fixed.amount")}
            />
          ) : (
            <Card withBorder mt="sm" p="md">
              {form.values.salary.variable.map((item, index) => (
                <Flex key={item.id} mb="sm" align="flex-end" gap="sm">
                  <TextInput
                    w="100%"
                    leftSection={<IoBriefcaseOutline />}
                    label={index === 0 ? "Source Name" : undefined}
                    placeholder="Source name"
                    {...form.getInputProps(`salary.variable.${index}.name`)}
                  />

                  <NumberInput
                    w="100%"
                    leftSection={<IoCashOutline />}
                    label={index === 0 ? "Amount" : undefined}
                    placeholder="Income amount"
                    min={0}
                    {...form.getInputProps(`salary.variable.${index}.amount`)}
                  />

                  <ActionIcon
                    color="red"
                    variant="filled"
                    onClick={() => removeIncomeSource(index)}
                    disabled={form.values.salary.variable.length === 1}
                  >
                    <IoTrashOutline />
                  </ActionIcon>
                </Flex>
              ))}

              <Button
                mt="xs"
                leftSection={<IoAddSharp />}
                variant="filled"
                onClick={addIncomeSource}
                fullWidth
                type="button"
              >
                Add Source
              </Button>
            </Card>
          )}

          {/* <Divider label="Account Actions" my="md" /> */}

          <Group justify="flex-end" mt="md">
            {/* <Button color="red" type="button">
              Delete Account
            </Button> */}
            <Button type="submit">Update Information</Button>
          </Group>
        </form>
      )}
    </Modal>
  );
};

export default Profile;
