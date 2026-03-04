import {
  Box,
  Container,
  Flex,
  Grid,
  Group,
  Select,
  Title,
} from "@mantine/core";
import React from "react";
import { IoCalendarOutline } from "react-icons/io5";

const InsightsPage = () => {
  return (
    <Container size="xl">
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Group my="sm" align="center" justify="space-between">
            <Title>AI Insights</Title>
            <Flex gap="sm">
              <Select
                leftSection={<IoCalendarOutline />}
                placeholder="Month"
                data={[
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
                ]}
              />
              <Select
                leftSection={<IoCalendarOutline />}
                placeholder="Year"
                data={[
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
                ]}
              />
            </Flex>
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default InsightsPage;
