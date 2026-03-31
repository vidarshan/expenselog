import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getCategories } from "../store/slices/categorySlice";
import { IoAddOutline, IoColorPaletteOutline } from "react-icons/io5";
import AddCategory from "../components/popups/AddCategory";
import moment from "moment";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector((state) => state.categories);

  const [opened, setOpened] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setOpened(true);
  };

  const openEdit = (cat) => {
    setMode("edit");
    setSelected(cat);
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
    setMode("create");
    setSelected(null);
  };

  const handleDelete = async (cat) => {
    await dispatch(deleteCategory(cat._id)).unwrap();
    await dispatch(getCategories());
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const rows = (categories || []).map((element) => (
    <Table.Tr key={element._id}>
      <Table.Td>
        <Text fw={700}>{element.name}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ThemeIcon color={element.color} radius="xl" />
          <Text size="sm" c="dimmed">
            {element.color}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {moment(element.createdAt).format("MMM D, YYYY hh:mm A")}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Button size="xs" radius="xl" variant="light" onClick={() => openEdit(element)}>
            Edit
          </Button>
          <Button
            color="red"
            size="xs"
            radius="xl"
            variant="light"
            onClick={() => handleDelete(element)}
          >
            Delete
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="md">
      <Helmet>
        <title>Categories | ExpenseLog</title>
      </Helmet>
      <AddCategory
        opened={opened}
        mode={mode}
        category={selected}
        onClose={handleClose}
        onSave={async () => {
          handleClose();
          await dispatch(getCategories());
        }}
      />

      <Stack gap="lg">
        <Paper
          withBorder
          radius="1.75rem"
          p="lg"
          style={{
            background:
              "linear-gradient(160deg, rgba(96, 165, 250, 0.12), rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.01))",
          }}
        >
          <Group justify="space-between" align="end">
            <Box>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Transaction organization
              </Text>
              <Title order={2}>Categories</Title>
              <Text c="dimmed" size="sm" mt={4}>
                Manage the labels and colors that keep your logs readable.
              </Text>
            </Box>
            <Button leftSection={<IoAddOutline />} radius="xl" size="md" onClick={openCreate}>
              Create Category
            </Button>
          </Group>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Paper withBorder radius="xl" p="md">
            <Text size="xs" c="dimmed">
              Total categories
            </Text>
            <Text fw={700} mt={4}>
              {categories.length}
            </Text>
          </Paper>
          <Paper withBorder radius="xl" p="md">
            <Text size="xs" c="dimmed">
              Color-coded
            </Text>
            <Text fw={700} mt={4}>
              Yes
            </Text>
          </Paper>
          <Paper withBorder radius="xl" p="md">
            <Text size="xs" c="dimmed">
              Last updated
            </Text>
            <Text fw={700} mt={4}>
              {categories[0]?.createdAt
                ? moment(categories[0].createdAt).format("MMM D")
                : "No data"}
            </Text>
          </Paper>
        </SimpleGrid>

        {loading ? (
          <Loading title="Loading Categories..." />
        ) : (
          <Paper withBorder radius="1.5rem" p="md">
            <Group justify="space-between" mb="md">
              <Group>
                <IoColorPaletteOutline size={20} />
                <Box>
                  <Text fw={700}>Category Library</Text>
                  <Text size="sm" c="dimmed">
                    Edit names, keep colors consistent, and remove categories you no longer use.
                  </Text>
                </Box>
              </Group>
              <Badge variant="light">{categories.length} total</Badge>
            </Group>

            <ScrollArea>
              <Table highlightOnHover verticalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Color</Table.Th>
                    <Table.Th>Created</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default CategoriesPage;
