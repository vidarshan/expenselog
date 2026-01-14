export const userLogin = [
  { email: "user@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" },
];

export const yearlyMonthlyReports = [
  {
    year: 2024,
    isCurrent: false,
    months: [
      { month: "January", income: 4200, expenses: 3800, logs: 18 },
      { month: "February", income: 4000, expenses: 4100, logs: 20 }, // loss
      { month: "March", income: 4500, expenses: 3900, logs: 22 },
      { month: "April", income: 4300, expenses: 4300, logs: 19 }, // even
      { month: "May", income: 4700, expenses: 4100, logs: 25 },
      { month: "June", income: 4600, expenses: 4400, logs: 23 },
      { month: "July", income: 4800, expenses: 4500, logs: 26 },
      { month: "August", income: 4700, expenses: 4600, logs: 24 },
      { month: "September", income: 4900, expenses: 4300, logs: 27 },
      { month: "October", income: 5000, expenses: 4700, logs: 29 },
      { month: "November", income: 5200, expenses: 4800, logs: 30 },
      { month: "December", income: 5500, expenses: 5100, logs: 32 },
    ],
  },
  {
    year: 2025,
    isCurrent: true,
    months: [
      { month: "January", income: 6100, expenses: 5900, logs: 31 }, // near even
    ],
  },
];

export const NAVBAR_HEIGHT = 64;
