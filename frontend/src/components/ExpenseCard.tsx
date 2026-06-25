import { FaEdit, FaTrash } from "react-icons/fa";

type ExpenseCardProps = {
  expense: any;
  onDelete: (id: number) => void;
  onEdit: (expense: any) => void;
  darkMode: boolean;
};

function ExpenseCard({
  expense,
  onDelete,
  onEdit,
  darkMode,
}: ExpenseCardProps) {
  return (
    <div
      className={`border rounded-2xl p-4 mb-4 shadow transition ${
        darkMode
          ? "bg-slate-800 border-slate-700 text-white"
          : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">
            {expense.title}
          </h3>

          <p
            className={
              darkMode
                ? "text-slate-300"
                : "text-gray-500"
            }
          >
            {expense.category}
          </p>
        </div>

        <div className="text-2xl font-bold text-green-600">
          ₹ {expense.amount}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(expense)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
        >
          <FaEdit />
          Edit
        </button>

        <button
          onClick={() => onDelete(expense.id)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          <FaTrash />
          Delete
        </button>
      </div>
    </div>
  );
}

export default ExpenseCard;