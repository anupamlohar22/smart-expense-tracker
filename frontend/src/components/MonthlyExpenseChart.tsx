import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  expenses: any[];
  darkMode: boolean;
};

function MonthlyExpenseChart({
  expenses,
  darkMode,
}: Props) {
  const monthlyData = expenses.reduce(
    (acc: any, expense: any) => {
      const month = new Date(
        expense.created_at || Date.now()
      ).toLocaleString("default", {
        month: "short",
      });

      const existing = acc.find(
        (item: any) => item.month === month
      );

      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({
          month,
          amount: expense.amount,
        });
      }

      return acc;
    },
    []
  );

  return (
   <div
  className={`rounded-2xl shadow-lg p-6 mb-6 transition ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white"
  }`}
>
      <h2 className="text-2xl font-bold mb-4">
        Monthly Spending
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="amount" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyExpenseChart;