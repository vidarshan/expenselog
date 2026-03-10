import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { IoGridOutline, IoTextOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  createCategory,
  updateCategory,
} from "../../store/slices/categorySlice";

const AddCategory = ({
  opened,
  onClose,
  onSave,
  mode = "create",
  category,
}) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "" },
    validate: { name: isNotEmpty("Name cannot be empty") },
  });

  useEffect(() => {
    if (!opened) return;

    if (mode === "edit" && category) {
      form.setValues({
        name: category?.name ?? "",
      });
      form.resetDirty();
    } else {
      form.setValues({ name: "" });
      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, mode, category]);

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const payload = { name: values.name?.trim() };

      if (mode === "create") {
        await dispatch(createCategory(payload)).unwrap();
      } else {
        await dispatch(
          updateCategory({ id: category?._id, name: payload.name }),
        ).unwrap();
      }

      form.reset();
      if (onSave) await onSave();
      if (onClose) onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IoGridOutline />
          <Text fw={600}>{mode === "create" ? "Create" : "Edit"} Category</Text>
        </Group>
      }
      centered
      closeOnClickOutside={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Category Name"
            placeholder="Enter category name"
            leftSection={<IoTextOutline />}
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <Button type="submit" loading={saving}>
            {mode === "create" ? "Create Category" : "Save Changes"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddCategory;
