import {
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";

import {
  IoBusinessOutline,
  IoCardOutline,
  IoCashOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { createAccount } from "../../store/slices/accountsSlice";
import { useDispatch } from "react-redux";

const AddAccount = ({ opened, onClose, onSave }) => {
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      name: "",
      type: "bank",
      initialBalance: 0,
      creditLimit: 0,
    },
    validate: {
      name: isNotEmpty("Account name is required"),
      type: isNotEmpty("Account type is required"),
      initialBalance: isInRange({ min: 0 }, "Must be 0 or more"),
      creditLimit: (value, values) =>
        values.type === "credit"
          ? isInRange({ min: 1 }, "Credit limit must be more than 0")(value)
          : null,
    },
  });

  const [saving, setSaving] = useState(false);

  async function handleSubmit(values) {
    try {
      setSaving(true);

      const payload = {
        name: values.name.trim(),
        type: values.type,
        initialBalance: Number(values.initialBalance) || 0,
        creditLimit:
          values.type === "credit" ? Number(values.creditLimit) || 0 : 0,
      };

      await dispatch(createAccount(payload));
      if (onSave) await onSave();
      form.reset();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IoWalletOutline />
          <Text fw={600}>Create Account</Text>
        </Group>
      }
      centered
      closeOnClickOutside={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Text c="dimmed" size="sm">
            Add an account to track balances (cash, bank, or credit).
          </Text>

          <TextInput
            label="Account name"
            placeholder="e.g. TD Chequing, Cash Wallet, Visa"
            leftSection={<IoBusinessOutline />}
            {...form.getInputProps("name")}
          />

          <Select
            label="Account type"
            leftSection={
              form.values.type === "cash" ? (
                <IoCashOutline />
              ) : form.values.type === "credit" ? (
                <IoCardOutline />
              ) : (
                <IoBusinessOutline />
              )
            }
            data={[
              { value: "cash", label: "Cash" },
              { value: "bank", label: "Bank" },
              { value: "credit", label: "Credit Card" },
            ]}
            {...form.getInputProps("type")}
          />

          <Divider />

          <NumberInput
            label="Initial balance"
            description="Starting amount when you begin tracking."
            min={0}
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            {...form.getInputProps("initialBalance")}
          />

          {form.values.type === "credit" && (
            <NumberInput
              label="Credit limit"
              description="Maximum available credit."
              min={1}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              {...form.getInputProps("creditLimit")}
            />
          )}

          <Group justify="flex-end" mt="xs">
            <Button variant="light" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddAccount;
