import {
  // Finance / Money
  IoWalletOutline,
  IoCardOutline,
  IoReceiptOutline,
  IoPricetagOutline,
  IoPricetagsOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline,

  // Income / Work
  IoBusinessOutline,
  IoLaptopOutline,

  // Food & Drink
  IoRestaurantOutline,
  IoPizzaOutline,
  IoCafeOutline,
  IoIceCreamOutline,
  IoWineOutline,
  IoNutritionOutline,

  // Shopping
  IoBagOutline,
  IoBagAddOutline,
  IoBasketOutline,
  IoShirtOutline,
  IoStorefrontOutline,

  // Transport
  IoCarOutline,
  IoBusOutline,
  IoBicycleOutline,
  IoAirplaneOutline,
  IoBoatOutline,

  // Home & Utilities
  IoFlashOutline,
  IoWaterOutline,
  IoFlameOutline,
  IoBuildOutline,
  IoConstructOutline,

  // Bills & Subscriptions
  IoDocumentTextOutline,
  IoCalendarOutline,
  IoRepeatOutline,

  // Health
  IoMedicalOutline,
  IoFitnessOutline,
  IoHeartOutline,

  // Entertainment
  IoGameControllerOutline,
  IoMusicalNotesOutline,
  IoFilmOutline,
  IoHeadsetOutline,

  // Education
  IoSchoolOutline,
  IoBookOutline,
  IoLibraryOutline,

  // Travel
  IoMapOutline,
  IoNavigateOutline,
  IoCompassOutline,
  IoTrailSignOutline,

  // Personal
  IoPersonOutline,
  IoPeopleOutline,
  IoGiftOutline,

  // Savings / Goals
  IoSaveOutline,
  IoTrophyOutline,
  IoTimeOutline,
  IoSearch,
  IoHomeOutline,
  IoTrainOutline,
  IoBagHandleOutline,
  IoFastFoodOutline,
  IoBriefcaseOutline,
  IoCashOutline,
} from "react-icons/io5";

export const categoryTabs = [
  {
    value: "finance",
    label: "Finance",
    Icon: IoCashOutline,
  },
  {
    value: "income",
    label: "Income",
    Icon: IoBriefcaseOutline,
  },
  {
    value: "food",
    label: "Food & Drink",
    Icon: IoFastFoodOutline,
  },
  {
    value: "shopping",
    label: "Shopping",
    Icon: IoBagHandleOutline,
  },
  {
    value: "transport",
    label: "Transport",
    Icon: IoTrainOutline,
  },
  {
    value: "home",
    label: "Home & Utilities",
    Icon: IoHomeOutline,
  },
  {
    value: "time",
    label: "Time & Bills",
    Icon: IoTimeOutline,
  },
  {
    value: "general",
    label: "General & System",
    Icon: IoSearch,
  },
];

export const categoryIcons = [
  // 💰 Finance
  {
    key: "wallet",
    label: "Wallet",
    Icon: IoWalletOutline,
    category: "finance",
  },
  { key: "cash", label: "Cash", Icon: IoCashOutline, category: "finance" },
  { key: "card", label: "Card", Icon: IoCardOutline, category: "finance" },
  {
    key: "receipt",
    label: "Receipt",
    Icon: IoReceiptOutline,
    category: "finance",
  },
  { key: "tag", label: "Tag", Icon: IoPricetagOutline, category: "finance" },
  { key: "tags", label: "Tags", Icon: IoPricetagsOutline, category: "finance" },
  {
    key: "income-trend",
    label: "Income Trend",
    Icon: IoTrendingUpOutline,
    category: "finance",
  },
  {
    key: "expense-trend",
    label: "Expense Trend",
    Icon: IoTrendingDownOutline,
    category: "finance",
  },

  // 💼 Income
  {
    key: "salary",
    label: "Salary",
    Icon: IoBriefcaseOutline,
    category: "income",
  },
  {
    key: "business",
    label: "Business",
    Icon: IoBusinessOutline,
    category: "income",
  },
  {
    key: "freelance",
    label: "Freelance",
    Icon: IoLaptopOutline,
    category: "income",
  },

  // 🍔 Food & Drink
  {
    key: "restaurant",
    label: "Restaurant",
    Icon: IoRestaurantOutline,
    category: "food",
  },
  { key: "pizza", label: "Pizza", Icon: IoPizzaOutline, category: "food" },
  { key: "cafe", label: "Cafe", Icon: IoCafeOutline, category: "food" },
  {
    key: "fast-food",
    label: "Fast Food",
    Icon: IoFastFoodOutline,
    category: "food",
  },
  {
    key: "ice-cream",
    label: "Ice Cream",
    Icon: IoIceCreamOutline,
    category: "food",
  },
  { key: "alcohol", label: "Alcohol", Icon: IoWineOutline, category: "food" },
  {
    key: "groceries",
    label: "Groceries",
    Icon: IoNutritionOutline,
    category: "food",
  },

  // 🛍️ Shopping
  {
    key: "shopping",
    label: "Shopping",
    Icon: IoBagOutline,
    category: "shopping",
  },
  {
    key: "online-shopping",
    label: "Online Shopping",
    Icon: IoBagAddOutline,
    category: "shopping",
  },
  {
    key: "basket",
    label: "Basket",
    Icon: IoBasketOutline,
    category: "shopping",
  },
  {
    key: "clothing",
    label: "Clothing",
    Icon: IoShirtOutline,
    category: "shopping",
  },
  {
    key: "store",
    label: "Store",
    Icon: IoStorefrontOutline,
    category: "shopping",
  },

  // 🚗 Transport
  { key: "car", label: "Car", Icon: IoCarOutline, category: "transport" },
  { key: "bus", label: "Bus", Icon: IoBusOutline, category: "transport" },
  { key: "train", label: "Train", Icon: IoTrainOutline, category: "transport" },
  { key: "bike", label: "Bike", Icon: IoBicycleOutline, category: "transport" },
  {
    key: "flight",
    label: "Flight",
    Icon: IoAirplaneOutline,
    category: "transport",
  },
  { key: "boat", label: "Boat", Icon: IoBoatOutline, category: "transport" },

  // 🏠 Home & Utilities
  { key: "home", label: "Home", Icon: IoHomeOutline, category: "home" },
  {
    key: "electricity",
    label: "Electricity",
    Icon: IoFlashOutline,
    category: "home",
  },
  { key: "water", label: "Water", Icon: IoWaterOutline, category: "home" },
  { key: "gas", label: "Gas", Icon: IoFlameOutline, category: "home" },
  {
    key: "maintenance",
    label: "Maintenance",
    Icon: IoBuildOutline,
    category: "home",
  },
  {
    key: "repairs",
    label: "Repairs",
    Icon: IoConstructOutline,
    category: "home",
  },

  // 📄 Time & Bills
  {
    key: "bills",
    label: "Bills",
    Icon: IoDocumentTextOutline,
    category: "time",
  },
  {
    key: "subscription",
    label: "Subscription",
    Icon: IoRepeatOutline,
    category: "time",
  },
  {
    key: "calendar",
    label: "Calendar",
    Icon: IoCalendarOutline,
    category: "time",
  },

  // ❤️ Health
  {
    key: "medical",
    label: "Medical",
    Icon: IoMedicalOutline,
    category: "health",
  },
  {
    key: "fitness",
    label: "Fitness",
    Icon: IoFitnessOutline,
    category: "health",
  },
  { key: "health", label: "Health", Icon: IoHeartOutline, category: "health" },

  // 🎮 Entertainment
  {
    key: "games",
    label: "Games",
    Icon: IoGameControllerOutline,
    category: "entertainment",
  },
  {
    key: "music",
    label: "Music",
    Icon: IoMusicalNotesOutline,
    category: "entertainment",
  },
  {
    key: "movies",
    label: "Movies",
    Icon: IoFilmOutline,
    category: "entertainment",
  },
  {
    key: "headphones",
    label: "Headphones",
    Icon: IoHeadsetOutline,
    category: "entertainment",
  },

  // 🎓 Education
  {
    key: "school",
    label: "School",
    Icon: IoSchoolOutline,
    category: "education",
  },
  { key: "books", label: "Books", Icon: IoBookOutline, category: "education" },
  {
    key: "library",
    label: "Library",
    Icon: IoLibraryOutline,
    category: "education",
  },

  // ✈️ Travel
  { key: "map", label: "Map", Icon: IoMapOutline, category: "travel" },
  {
    key: "navigation",
    label: "Navigation",
    Icon: IoNavigateOutline,
    category: "travel",
  },
  {
    key: "compass",
    label: "Compass",
    Icon: IoCompassOutline,
    category: "travel",
  },
  {
    key: "signs",
    label: "Signs",
    Icon: IoTrailSignOutline,
    category: "travel",
  },

  // 👤 Personal
  {
    key: "personal",
    label: "Personal",
    Icon: IoPersonOutline,
    category: "personal",
  },
  {
    key: "family",
    label: "Family",
    Icon: IoPeopleOutline,
    category: "personal",
  },
  { key: "gift", label: "Gift", Icon: IoGiftOutline, category: "personal" },

  // 🏆 Savings & Goals
  {
    key: "savings",
    label: "Savings",
    Icon: IoSaveOutline,
    category: "savings",
  },
  { key: "goals", label: "Goals", Icon: IoTrophyOutline, category: "savings" },
];
