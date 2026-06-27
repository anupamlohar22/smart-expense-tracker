import { FaFileCsv } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";

import { FaMoon, FaSun } from "react-icons/fa";
import toast from "react-hot-toast";
import { FaWallet, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import ExpenseForm from "../components/ExpenseForm";
import ExpenseCard from "../components/ExpenseCard";
import ExpensePieChart from "../components/ExpensePieChart";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";

function Dashboard() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
const [monthlyBudget, setMonthlyBudget] = useState(() => {
  const savedBudget = localStorage.getItem("monthlyBudget");

  return savedBudget ? Number(savedBudget) : 10000;
});

const [monthlyIncome, setMonthlyIncome] = useState(() => {
  const savedIncome = localStorage.getItem("monthlyIncome");

  return savedIncome ? Number(savedIncome) : 50000;
});

const [savingsGoal, setSavingsGoal] = useState(() => {
  const savedGoal = localStorage.getItem("savingsGoal");

  return savedGoal ? Number(savedGoal) : 20000;
});

const formRef = useRef<HTMLDivElement>(null);

const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

  useEffect(() => {
  localStorage.setItem(
    "monthlyBudget",
    monthlyBudget.toString()
  );
}, [monthlyBudget]);

useEffect(() => {
  localStorage.setItem(
    "monthlyIncome",
    monthlyIncome.toString()
  );
}, [monthlyIncome]);

useEffect(() => {
  localStorage.setItem(
    "savingsGoal",
    savingsGoal.toString()
  );
}, [savingsGoal]);

  type TokenData = {
  sub: string;
  name?: string;
};

const userName = useMemo(() => {
  const token = localStorage.getItem("token");

  if (!token) return "User";

  try {
    const decoded = jwtDecode<TokenData>(token);
    return decoded.name || "User";
  } catch {
    return "User";
  }
}, []);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/expenses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addExpense = async () => {
    try {
      if (!title.trim()) {
        toast.error("Please enter a title.");;
        return;
      }

      if (!category.trim()) {
        toast.error("Please enter a category.");;
        return;
      }

      if (Number(amount) <= 0) {
        toast.error("Amount must be greater than 0.");;
        return;
      }

      const token = localStorage.getItem("token");

      if (editingExpense) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/expenses/${editingExpense.id}`,
          {
            title,
            amount: Number(amount),
            category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEditingExpense(null);
toast.success("Expense updated!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/expenses`,
          {
            title,
            amount: Number(amount),
            category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      toast.success("Expense added!");
      }

      setTitle("");
      setAmount("");
      setCategory("");

      fetchExpenses();
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.reload();
      }
    }
  };

  const deleteExpense = async (expenseId: number) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/expenses/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
toast.success("Expense deleted!");
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const editExpense = (expense: any) => {
  setEditingExpense(expense);

  setTitle(expense.title);
  setAmount(expense.amount.toString());
  setCategory(expense.category);

  formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const remainingBudget = monthlyBudget - totalExpenses;
  const isOverBudget = remainingBudget < 0;

  const budgetPercentage = Math.min(
  (totalExpenses / monthlyBudget) * 100,
  100
);
  
  const amountOverBudget = Math.max(
  totalExpenses - monthlyBudget,
  0
);
  const remainingPercentage =
  (remainingBudget / monthlyBudget) * 100;

  const budgetMessage = isOverBudget
  ? "🚨 Budget exceeded! Time to cut back."
  : remainingPercentage > 50
  ? "🏆 Excellent! More than 50% of your budget remains."
  : remainingPercentage > 20
  ? "👍 Good job! You're staying within your budget."
  : "⚠️ Careful! You're close to your budget limit.";

const totalSavings = monthlyIncome - totalExpenses;

const savingsRate =
  monthlyIncome > 0
    ? (totalSavings / monthlyIncome) * 100
    : 0;

const savingsMessage =
  savingsRate >= 50
    ? "🚀 Outstanding saver!"
    : savingsRate >= 20
    ? "👍 Healthy savings habit"
    : savingsRate >= 0
    ? "⚠️ Try to save more"
    : "🚨 Spending exceeds income";

  const goalProgress = Math.min(
  (totalSavings / savingsGoal) * 100,
  100
);

  const goalAchieved = totalSavings >= savingsGoal;

  const netWorth = totalSavings;

const financialHealthScore = Math.max(
  0,
  Math.min(
    Math.round(
      savingsRate * 0.7 +
      (goalProgress >= 100 ? 30 : goalProgress * 0.3)
    ),
    100
  )
);

  const totalTransactions = expenses.length;

  const filteredExpenses = expenses.filter(
    (expense) => {
      const matchesSearch = expense.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        expense.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }
  );

  const categories = [
    "All",
    ...new Set(
      expenses.map((expense) => expense.category)
    ),
  ];

  const logout = () => {
  localStorage.removeItem("token");
  setShowLogoutModal(false);
  window.location.reload();
};

const exportToCSV = () => {
  const headers = ["Title", "Amount", "Category", "Date"];

  const rows = expenses.map((expense) => [
    expense.title,
    expense.amount,
    expense.category,
    new Date(expense.created_at).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "expenses.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const toggleDarkMode = () => {
  const newMode = !darkMode;

  setDarkMode(newMode);

  localStorage.setItem(
    "theme",
    newMode ? "dark" : "light"
  );
};

  return (
    <div
  className={`min-h-screen p-10 transition-colors duration-300 ${
    darkMode
      ? "bg-slate-900 text-white"
      : "bg-slate-100 text-black"
  }`}
>
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white">
              <FaWallet size={28} />
            </div>

            <div>
<div>
<div>
  <h1
    className={`text-4xl font-bold ${
      darkMode ? "text-white" : "text-slate-800"
    }`}
  >
  Welcome back, {userName}!
  </h1>

  <p
    className={`mt-2 ${
      darkMode ? "text-slate-300" : "text-slate-600"
    }`}
  >
  
  </p>
</div>

  <p
    className={`mt-2 ${
      darkMode ? "text-slate-300" : "text-slate-600"
    }`}
  >
  </p>
</div>

<p
  className={`${
    darkMode ? "text-slate-300" : "text-slate-500"
  }`}
>
  Manage your daily expenses
</p>
            </div>
          </div>

          <div className="flex gap-3">
  <button
    onClick={toggleDarkMode}
    className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-3 rounded-lg transition"
  >
    {darkMode ? <FaSun /> : <FaMoon />}
  </button>

  <button
  onClick={exportToCSV}
  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg transition"
>
  <FaFileCsv />
  Export CSV
</button>

  <button
  onClick={() => setShowLogoutModal(true)}
  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg transition"
>
  <FaSignOutAlt />
  Logout
</button>
</div>
        </div>
<div className="grid md:grid-cols-2 gap-6 mb-6">
<div
  className={`mb-6 p-4 rounded-2xl shadow ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-slate-800"
  }`}
>
  <label className="block mb-2 font-semibold">
    Monthly Income (₹)
  </label>

  <input
    type="number"
    value={monthlyIncome}
    onChange={(e) =>
      setMonthlyIncome(Number(e.target.value))
    }
    className={`w-full rounded-xl px-4 py-3 border ${
      darkMode
        ? "bg-slate-700 border-slate-600 text-white"
        : "bg-white border-slate-300"
    }`}
  />
</div>
        <div
  className={`mb-6 p-4 rounded-2xl shadow ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-slate-800"
  }`}
>
  <label className="block mb-2 font-semibold">
    Monthly Budget (₹)
  </label>

  <input
    type="number"
    value={monthlyBudget}
    onChange={(e) =>
      setMonthlyBudget(Number(e.target.value))
    }
    className={`w-full rounded-xl px-4 py-3 border ${
      darkMode
        ? "bg-slate-700 border-slate-600 text-white"
        : "bg-white border-slate-300"
    }`}
  />
</div>

<div
  className={`p-4 rounded-2xl shadow ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-slate-800"
  }`}
>
  <label className="block mb-2 font-semibold">
    Savings Goal (₹)
  </label>

  <input
    type="number"
    value={savingsGoal}
    onChange={(e) =>
      setSavingsGoal(Number(e.target.value))
    }
    className={`w-full rounded-xl px-4 py-3 border ${
      darkMode
        ? "bg-slate-700 border-slate-600 text-white"
        : "bg-white border-slate-300"
    }`}
  />
</div>

</div>

<div className="mb-6">
  <div
    className={`w-full h-4 rounded-full overflow-hidden ${
      darkMode ? "bg-slate-700" : "bg-slate-200"
    }`}
  >
    <div
      className={`h-full transition-all duration-500 ${
        isOverBudget ? "bg-red-500" : "bg-green-500"
      }`}
      style={{
        width: `${budgetPercentage}%`,
      }}
    />
  </div>

  <p
  className={`mt-2 text-sm ${
    darkMode ? "text-slate-300" : "text-slate-600"
  }`}
>
  ₹ {totalExpenses} spent of ₹ {monthlyBudget} (
  {budgetPercentage.toFixed(0)}%)
</p>

{isOverBudget ? (
  <p className="mt-1 text-sm text-red-500 font-semibold">
    ⚠️ Over budget by ₹ {amountOverBudget}
  </p>
) : (
  <p className="mt-1 text-sm text-green-500 font-semibold">
    ✅ Within budget
  </p>
)}

<p
  className={`mt-3 text-center font-semibold ${
    isOverBudget
      ? "text-red-500"
      : darkMode
      ? "text-yellow-300"
      : "text-indigo-700"
  }`}
>
  {budgetMessage}
</p>

<div className="mt-6">
  <h3 className="font-semibold mb-2">
    🎯 Savings Goal Progress
  </h3>

  <div
    className={`w-full h-4 rounded-full overflow-hidden ${
      darkMode ? "bg-slate-700" : "bg-slate-200"
    }`}
  >
    <div
      className={`h-full transition-all duration-500 ${
        goalAchieved
          ? "bg-emerald-500"
          : "bg-blue-500"
      }`}
      style={{
        width: `${goalProgress}%`,
      }}
    />
  </div>

  <p
    className={`mt-2 text-sm ${
      darkMode ? "text-slate-300" : "text-slate-600"
    }`}
  >
    ₹ {Math.abs(totalSavings)} saved of ₹ {savingsGoal}
    ({goalProgress.toFixed(0)}%)
  </p>

  <p
    className={`mt-1 font-semibold ${
      goalAchieved
        ? "text-emerald-500"
        : "text-amber-500"
    }`}
  >
    {goalAchieved
      ? "🎉 Savings goal achieved!"
      : `₹ ${Math.max(
          savingsGoal - totalSavings,
          0
        )} more to reach your goal`}
  </p>
</div>

</div>

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-6 mb-6"></div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-medium opacity-90">
              Total Expenses
            </h2>

            <p className="text-5xl font-bold mt-3">
              ₹ {totalExpenses}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-medium opacity-90">
              Total Transactions
            </h2>

            <p className="text-5xl font-bold mt-3">
              {totalTransactions}
            </p>
          </div>
          
<div className="grid md:grid-cols-2 gap-6 mb-6">

  <div
    className={`rounded-2xl shadow-lg p-6 text-white ${
      isOverBudget
        ? "bg-gradient-to-r from-red-600 to-red-800"
        : "bg-gradient-to-r from-green-600 to-green-800"
    }`}
  >
    <h2 className="text-xl font-medium opacity-90">
      Remaining Budget
    </h2>

    <p className="text-5xl font-bold mt-3">
      ₹ {Math.abs(remainingBudget)}
    </p>

    <p className="mt-2">
      {isOverBudget
        ? "⚠️ You are over budget!"
        : "✅ Within budget"}
    </p>
  </div>
<div
  className={`rounded-2xl shadow-lg p-6 text-white ${
    totalSavings >= 0
      ? "bg-gradient-to-r from-emerald-600 to-emerald-800"
      : "bg-gradient-to-r from-red-600 to-red-800"
  }`}
>
  <h2 className="text-xl font-medium opacity-90">
    Total Savings
  </h2>

  <p className="text-5xl font-bold mt-3">
    ₹ {Math.abs(totalSavings)}
  </p>

<p className="mt-2">
  {savingsRate.toFixed(0)}% savings rate
</p>

<p className="mt-1 text-sm font-medium opacity-90">
  {savingsMessage}
</p>
</div>

<div
  className={`rounded-2xl shadow-lg p-6 text-white ${
    netWorth >= 0
      ? "bg-gradient-to-r from-cyan-600 to-cyan-800"
      : "bg-gradient-to-r from-red-600 to-red-800"
  }`}
>
  <h2 className="text-xl font-medium opacity-90">
    Net Worth
  </h2>

  <p className="text-5xl font-bold mt-3">
    ₹ {Math.abs(netWorth)}
  </p>

<p className="mt-2">
  {netWorth >= 0
    ? `📈 ${savingsRate.toFixed(0)}% savings efficiency`
    : "⚠️ Negative net worth"}
</p>
</div>

<div
  className={`rounded-2xl shadow-lg p-6 text-white ${
    financialHealthScore >= 80
      ? "bg-gradient-to-r from-green-600 to-green-800"
      : financialHealthScore >= 50
      ? "bg-gradient-to-r from-yellow-500 to-yellow-700"
      : "bg-gradient-to-r from-red-600 to-red-800"
  }`}
>
  <h2 className="text-xl font-medium opacity-90">
    Financial Health
  </h2>

  <p className="text-5xl font-bold mt-3">
    {financialHealthScore}/100
  </p>

  <p className="mt-2">
    {financialHealthScore >= 80
      ? "🟢 Excellent"
      : financialHealthScore >= 50
      ? "🟡 Good"
      : "🔴 Needs Improvement"}
  </p>
</div>


</div>
        </div>

        <div ref={formRef}>
  <ExpenseForm
    title={title}
    amount={amount}
    category={category}
    setTitle={setTitle}
    setAmount={setAmount}
    setCategory={setCategory}
    onAddExpense={addExpense}
    editingExpense={editingExpense}
    darkMode={darkMode}
  />
</div>

       <ExpensePieChart
          expenses={expenses}
          darkMode={darkMode}
        />

        <MonthlyExpenseChart
          expenses={expenses}
          darkMode={darkMode}
        />

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className={`flex-1 rounded-xl px-4 py-3 border ${
  darkMode
    ? "bg-slate-800 text-white border-slate-700 placeholder-slate-400"
    : "bg-white text-black border-slate-300"
}`}
          />

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className={`rounded-xl px-4 py-3 border ${
  darkMode
    ? "bg-slate-800 text-white border-slate-700"
    : "bg-white text-black border-slate-300"
}`}
          >
            {categories.map((category) => (
              <option key={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-2xl font-bold mb-4">
          My Expenses
        </h2>

        {filteredExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onDelete={deleteExpense}
            onEdit={editExpense}
            darkMode={darkMode}
          />
        ))}

        {showLogoutModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-80">
      <h2 className="text-xl font-bold mb-3">
        🚪 Logout
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to sign out?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          Cancel
        </button>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default Dashboard;