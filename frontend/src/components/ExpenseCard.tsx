type ExpenseCardProps = {
  expense: any;
  onDelete: (id: number) => void;
};

function ExpenseCard({
  expense,
  onDelete,
}: ExpenseCardProps) {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow bg-white">
      <h3 className="text-xl font-semibold">
        {expense.title}
      </h3>

      <p>₹ {expense.amount}</p>

      <p>{expense.category}</p>

      <button
        className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
        onClick={() => onDelete(expense.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default ExpenseCard;