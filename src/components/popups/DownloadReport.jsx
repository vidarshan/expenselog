import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Select,
  SegmentedControl,
  Stack,
  Text,
  Group,
} from "@mantine/core";
import { IoDownloadOutline, IoGridOutline } from "react-icons/io5";
import {
  getMonthOptions,
  getYearOptions,
  months,
} from "../../utils/getCurrentPeriod";
import { exportFinancialReport } from "../../utils/reportExport";
import { useSelector } from "react-redux";

const DownloadReport = ({
  opened,
  onClose,
  activePeriods,
  defaultYear,
  defaultMonth,
}) => {
  const [reportType, setReportType] = useState("monthly");
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const [loading, setLoading] = useState(false);
  const { currentYear, currentMonth } = useSelector((state) => state.app);
  const { insights } = useSelector((state) => state.insights);

  useEffect(() => {
    if (!opened) return;
    setReportType("monthly");
    setYear(defaultYear);
    setMonth(defaultMonth);
  }, [defaultMonth, defaultYear, opened]);

  const yearOptions = getYearOptions(activePeriods);
  const monthOptions = getMonthOptions(activePeriods, year);

  useEffect(() => {
    if (!monthOptions.length) return;
    if (!monthOptions.some((item) => item.value === month)) {
      setMonth(monthOptions[0].value);
    }
  }, [month, monthOptions]);

  const handleDownload = async () => {
    const selectedKey = `${year}-${String(month).padStart(2, "0")}`;
    const currentKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    const hasLoadedInsights =
      insights &&
      typeof insights === "object" &&
      Object.keys(insights).length > 0;
    const insightsByPeriod =
      hasLoadedInsights && selectedKey === currentKey
        ? { [currentKey]: insights }
        : {};

    try {
      setLoading(true);
      await exportFinancialReport({
        reportType,
        year,
        month,
        activePeriods,
        insightsByPeriod,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IoGridOutline />
          <Text fw={600}>Download Report</Text>
        </Group>
      }
      centered
      radius="xl"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Generate a PDF-ready report with charts.
        </Text>

        <SegmentedControl
          radius="xl"
          value={reportType}
          onChange={setReportType}
          data={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
        />

        <Select
          label="Year"
          radius="xl"
          value={year}
          onChange={(value) => value && setYear(value)}
          data={yearOptions}
          allowDeselect={false}
        />

        {reportType === "monthly" ? (
          <Select
            label="Month"
            radius="xl"
            value={month}
            onChange={(value) => value && setMonth(value)}
            data={monthOptions}
            placeholder="Select month"
            allowDeselect={false}
          />
        ) : (
          <Text size="sm" c="dimmed">
            The yearly report will include every available month in{" "}
            {year || "the selected year"}.
          </Text>
        )}

        <Button
          leftSection={<IoDownloadOutline />}
          radius="xl"
          onClick={handleDownload}
          loading={loading}
          disabled={!year || (reportType === "monthly" && !month)}
        >
          Download{" "}
          {reportType === "monthly" ? months()[Number(month || 1) - 1] : year}{" "}
          report
        </Button>
      </Stack>
    </Modal>
  );
};

export default DownloadReport;
