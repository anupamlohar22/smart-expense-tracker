import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  expenses: any[];
  darkMode: boolean;
};

function ExpensePieChart({
  expenses,
  darkMode,
}: Props) {
  const categoryData = expenses.reduce(
    (acc: any, expense: any) => {
      const existing = acc.find(
        (item: any) => item.name === expense.category
      );

      if (existing) {
        existing.value += expense.amount;
      } else {
        acc.push({
          name: expense.category,
          value: expense.amount,
        });
      }

      return acc;
    },
    []
  );

  const COLORS = [
    "#2563eb",
    "#7c3aed",
    "#dc2626",
    "#16a34a",
    "#ea580c",
    "#db2777",
  ];

  return (
    <div
  className={`rounded-2xl shadow-lg p-6 mb-6 transition ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white"
  }`}
>
      <h2 className="text-2xl font-bold mb-4">
        Expenses by Category
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {categoryData.map(
              (_entry: any, index: number) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpensePieChart;