type ExpenseFormProps = {
  title: string;
  amount: string;
  category: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  onAddExpense: () => void;
};

function ExpenseForm({
  title,
  amount,
  category,
  setTitle,
  setAmount,
  setCategory,
  onAddExpense,
}: ExpenseFormProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <h2 className="text-2xl font-semibold mb-4">
        Add Expense
      </h2>

      <div className="flex gap-3">
        <input
          className="border rounded p-2 flex-1"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border rounded p-2"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          className="border rounded p-2"
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          onClick={onAddExpense}
          className="bg-blue-600 text-white px-5 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default ExpenseForm;