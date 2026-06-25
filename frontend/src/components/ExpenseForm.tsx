import React from "react";

type ExpenseFormProps = {
  title: string;
  amount: string;
  category: string;

  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;

  onAddExpense: () => void;
  editingExpense: any;
  darkMode: boolean;
};

function ExpenseForm({
  title,
  amount,
  category,
  setTitle,
  setAmount,
  setCategory,
  onAddExpense,
  editingExpense,
  darkMode,
}: ExpenseFormProps) {
  return (
    <div
      className={`rounded-2xl shadow-lg p-6 mb-6 transition ${
        darkMode
          ? "bg-slate-800 text-white"
          : "bg-white"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">
        {editingExpense
          ? "Update Expense"
          : "Add New Expense"}
      </h2>

      <div className="grid md:grid-cols-4 gap-4">
        <input
          className={`border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              : "bg-white text-black border-slate-300"
          }`}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className={`border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              : "bg-white text-black border-slate-300"
          }`}
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          className={`border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              : "bg-white text-black border-slate-300"
          }`}
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          onClick={onAddExpense}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition font-semibold"
        >
          {editingExpense ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default ExpenseForm;