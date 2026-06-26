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