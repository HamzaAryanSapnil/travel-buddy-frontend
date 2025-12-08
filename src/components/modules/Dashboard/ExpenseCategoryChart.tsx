"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ExpenseCategoryData } from "@/types/dashboard.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseCategoryChartProps {
  data: ExpenseCategoryData[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
];

const categoryLabels: Record<string, string> = {
  FOOD: "Food",
  TRANSPORT: "Transport",
  ACCOMMODATION: "Accommodation",
  ACTIVITY: "Activity",
  SHOPPING: "Shopping",
  OTHER: "Other",
};

const ExpenseCategoryChart = ({ data }: ExpenseCategoryChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No expense data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  const chartData = data.map((item) => ({
    name: categoryLabels[item.category] || item.category,
    value: item.amount,
    percentage: item.percentage,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => {
                const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0";
                return `${entry.name}: ${percentage}%`;
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value),
                "Amount",
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseCategoryChart;

