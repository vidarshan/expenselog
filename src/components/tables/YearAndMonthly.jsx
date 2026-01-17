import { Table } from "@mantine/core";
import React from "react";

const YearAndMonthly = ({ rows }) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Year</Table.Th>
          <Table.Th>Month</Table.Th>
          <Table.Th>Income</Table.Th>
          <Table.Th>Expenses</Table.Th>
          <Table.Th>Outcome</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Transactions</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

export default YearAndMonthly;
