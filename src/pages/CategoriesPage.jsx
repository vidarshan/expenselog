import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getCategories } from "../store/slices/categorySlice";
import { IoAddOutline } from "react-icons/io5";
import AddCategory from "../components/popups/AddCategory";
import moment from "moment";
import Loading from "../components/Loading";

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

  const rows = (categories || []).map((element) => (
    <Table.Tr key={element._id}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>
        <ThemeIcon color={element.color} />
      </Table.Td>
      <Table.Td>
        {moment(element.createdAt).format("MMM-DD-YYYY hh:mm A")}
      </Table.Td>
      <Table.Td>
        <Button size="xs" onClick={() => openEdit(element)}>
          Edit
        </Button>
      </Table.Td>
      <Table.Td>
        <Button color="red" size="xs" onClick={() => handleDelete(element)}>
          Delete
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <Container size="xl">
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

      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Group my="sm" align="center" justify="space-between">
            <Box>
              <Title order={2}>Categories</Title>
              <Text c="dimmed" size="sm">
                All categories
              </Text>
            </Box>
            <Button leftSection={<IoAddOutline />} onClick={openCreate}>
              Create Category
            </Button>
          </Group>
        </Grid.Col>
        {loading ? (
          <Loading title="Loading Categories..." />
        ) : (
          <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Deleted</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th></Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
};

export default CategoriesPage;
