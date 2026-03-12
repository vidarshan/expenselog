import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { IoCheckmark, IoGridOutline, IoTextOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  createCategory,
  updateCategory,
} from "../../store/slices/categorySlice";
import { ColorInput } from "@mantine/core";
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
    initialValues: { name: "", color: "blue" },
    validate: {
      name: isNotEmpty("Name cannot be empty"),
      color: isNotEmpty("Color cannot be empty"),
    },
  });

  useEffect(() => {
    if (!opened) return;

    if (mode === "edit" && category) {
      form.setValues({
        name: category?.name ?? "",
        color: category?.color ?? "",
      });
      form.resetDirty();
    } else {
      form.setValues({ name: "", color: "blue" });
      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, mode, category]);

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const payload = { name: values.name?.trim(), color: values?.color };

      if (mode === "create") {
        await dispatch(createCategory(payload)).unwrap();
      } else {
        await dispatch(
          updateCategory({
            id: category?._id,
            name: payload.name,
            color: payload.color,
          }),
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
          <Text size="sm">Category Color</Text>
          <Group mb="sm">
            <ActionIcon
              color="gray"
              onClick={() => form.setValues({ color: "gray" })}
            >
              {form.values.color === "gray" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="red"
              onClick={() => form.setValues({ color: "red" })}
            >
              {" "}
              {form.values.color === "red" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="pink"
              onClick={() => form.setValues({ color: "pink" })}
            >
              {" "}
              {form.values.color === "pink" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="grape"
              onClick={() => form.setValues({ color: "grape" })}
            >
              {" "}
              {form.values.color === "grape" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="violet"
              onClick={() => form.setValues({ color: "violet" })}
            >
              {" "}
              {form.values.color === "violet" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="indigo"
              onClick={() => form.setValues({ color: "indigo" })}
            >
              {form.values.color === "indigo" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="blue"
              onClick={() => form.setValues({ color: "blue" })}
            >
              {form.values.color === "blue" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="cyan"
              onClick={() => form.setValues({ color: "cyan" })}
            >
              {form.values.color === "cyan" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="teal"
              onClick={() => form.setValues({ color: "teal" })}
            >
              {form.values.color === "teal" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="green"
              onClick={() => form.setValues({ color: "green" })}
            >
              {form.values.color === "green" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="lime"
              onClick={() => form.setValues({ color: "lime" })}
            >
              {form.values.color === "lime" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="yellow"
              onClick={() => form.setValues({ color: "yellow" })}
            >
              {form.values.color === "yellow" && <IoCheckmark />}
            </ActionIcon>
            <ActionIcon
              color="orange"
              onClick={() => form.setValues({ color: "orange" })}
            >
              {form.values.color === "orange" && <IoCheckmark />}
            </ActionIcon>
          </Group>

          <Button type="submit" loading={saving}>
            {mode === "create" ? "Create Category" : "Save Changes"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddCategory;
