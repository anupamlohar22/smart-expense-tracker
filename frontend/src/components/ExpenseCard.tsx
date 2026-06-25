type ExpenseCardProps = {
  expense: any;
  onDelete: (id: number) => void;
  onEdit: (expense: any) => void;
};

function ExpenseCard({
  expense,
  onDelete,
  onEdit,
}: ExpenseCardProps) {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow bg-white">
      <h3 className="text-xl font-semibold">
        {expense.title}
      </h3>

      <p>₹ {expense.amount}</p>

      <p>{expense.category}</p>

      <div className="mt-3 flex gap-2">
  <button
    className="bg-yellow-500 text-white px-3 py-1 rounded"
    onClick={() => onEdit(expense)}
  >
    Edit
  </button>

  <button
    className="bg-red-500 text-white px-3 py-1 rounded"
    onClick={() => onDelete(expense.id)}
  >
    Delete
  </button>
</div>
    </div>
  );
}

export default ExpenseCard;