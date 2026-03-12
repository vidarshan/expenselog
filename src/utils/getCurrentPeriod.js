export const getMonthOptions = (periods = [], selectedYear) => {
  const yearEntry = periods.find((p) => p.year === Number(selectedYear));

  if (!yearEntry) return [];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return yearEntry.months.map((m) => ({
    value: String(m),
    label: monthNames[m - 1],
  }));
};
export const months = () => {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
};

export const getYearOptions = (periods = []) => {
  return periods.map((p) => ({
    value: String(p.year),
    label: String(p.year),
  }));
};
