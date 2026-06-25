import ExpenseForm from "../components/ExpenseForm";
import ExpenseCard from "../components/ExpenseCard";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState<any>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/expenses",
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
    const token = localStorage.getItem("token");

    if (editingExpense) {
      await axios.put(
        `http://127.0.0.1:8000/expenses/${editingExpense.id}`,
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
    } else {
      await axios.post(
        "http://127.0.0.1:8000/expenses",
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
    }

    setTitle("");
    setAmount("");
    setCategory("");

    fetchExpenses();
  } catch (error) {
    console.error(error);
  }
};

  const deleteExpense = async (expenseId: number) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://127.0.0.1:8000/expenses/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">
            Expense Dashboard
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h2 className="text-2xl font-semibold">
            Total Expenses
          </h2>

          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹ {totalExpenses}
          </p>
        </div>

        <ExpenseForm
          title={title}
          amount={amount}
          category={category}
          setTitle={setTitle}
          setAmount={setAmount}
          setCategory={setCategory}
          onAddExpense={addExpense}
          editingExpense={editingExpense}
        />

        <h2 className="text-2xl font-bold mb-4">
          My Expenses
        </h2>

        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onDelete={deleteExpense}
            onEdit={editExpense}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;