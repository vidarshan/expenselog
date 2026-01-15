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

export const expenseData = [
  { name: "Food & Drink", value: 450, color: "red.6" },
  { name: "Shopping", value: 320, color: "pink.6" },
  { name: "Transport", value: 180, color: "blue.6" },
  { name: "Home & Utilities", value: 250, color: "yellow.6" },
  { name: "Bills & Subscriptions", value: 150, color: "green.6" },
  { name: "Health", value: 120, color: "teal.6" },
  { name: "Entertainment", value: 200, color: "orange.6" },
  { name: "Education", value: 100, color: "violet.6" },
  { name: "Travel", value: 180, color: "cyan.6" },
  { name: "Personal", value: 90, color: "grape.6" },
  { name: "Savings & Goals", value: 300, color: "lime.6" },
];

export const summaryData = [
  { income: 4200 },
  { expenses: 3800 },
  { netGainLoss: 400 },
  { transactionCount: 18 },
];

export const categoryMonthlyComparison = [
  {
    category: "Food & Drink",
    January: 450,
    February: 500,
    March: 400,
    April: 480,
    May: 520,
    June: 450,
    December: 550,
  },
  {
    category: "Shopping",
    January: 320,
    February: 280,
    March: 350,
    April: 300,
    May: 400,
    June: 350,
    December: 420,
  },
  {
    category: "Transport",
    January: 180,
    February: 220,
    March: 200,
    April: 190,
    May: 210,
    June: 200,
    December: 230,
  },
  {
    category: "Home & Utilities",
    January: 250,
    February: 240,
    March: 260,
    April: 280,
    May: 300,
    June: 320,
    December: 350,
  },
  {
    category: "Bills",
    January: 150,
    February: 170,
    March: 160,
    April: 140,
    May: 180,
    June: 160,
    December: 200,
  },
  {
    category: "Health",
    January: 120,
    February: 100,
    March: 130,
    April: 150,
    May: 120,
    June: 140,
    December: 160,
  },
  {
    category: "Entertainment",
    January: 200,
    February: 150,
    March: 180,
    April: 220,
    May: 240,
    June: 260,
    December: 280,
  },
];

export const transactions = [
  {
    title: "Lunch at Cafe",
    amount: 45.5,
    category: "Food & Drink",
    date: "2025-01-03",
    paymentMethod: "Card",
    notes: "Had sandwich and coffee",
  },
  {
    title: "Clothes Purchase",
    amount: 120,
    category: "Shopping",
    date: "2025-01-05",
    paymentMethod: "Online",
    notes: "Bought a jacket and t-shirt",
  },
  {
    title: "Taxi Fare",
    amount: 60,
    category: "Transport",
    date: "2025-01-07",
    paymentMethod: "Cash",
    notes: "Ride to office",
  },
  {
    title: "Electricity Bill",
    amount: 250,
    category: "Home & Utilities",
    date: "2025-01-10",
    paymentMethod: "Card",
    notes: "Monthly electricity payment",
  },
  {
    title: "Movie Ticket",
    amount: 30,
    category: "Entertainment",
    date: "2025-01-12",
    paymentMethod: "Online",
    notes: "Watched a new release",
  },
  {
    title: "Groceries",
    amount: 50,
    category: "Food & Drink",
    date: "2025-01-15",
    paymentMethod: "Cash",
    notes: "Weekly grocery shopping",
  },
  {
    title: "Gym Membership",
    amount: 100,
    category: "Health",
    date: "2025-01-18",
    paymentMethod: "Card",
    notes: "Monthly membership fee",
  },
  {
    title: "Online Accessories",
    amount: 150,
    category: "Shopping",
    date: "2025-01-20",
    paymentMethod: "Card",
    notes: "Bought phone case and charger",
  },
  {
    title: "Bus Pass",
    amount: 75,
    category: "Transport",
    date: "2025-01-22",
    paymentMethod: "Cash",
    notes: "Monthly bus pass",
  },
  {
    title: "Water Bill",
    amount: 180,
    category: "Home & Utilities",
    date: "2025-01-25",
    paymentMethod: "Card",
    notes: "Monthly water bill",
  },
];
