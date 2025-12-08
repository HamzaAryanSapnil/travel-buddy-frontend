"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PlansByTravelTypeData } from "@/types/dashboard.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlansByTravelTypeChartProps {
  data: PlansByTravelTypeData[];
}

const travelTypeLabels: Record<string, string> = {
  SOLO: "Solo",
  COUPLE: "Couple",
  FAMILY: "Family",
  FRIENDS: "Friends",
  GROUP: "Group",
};

const PlansByTravelTypeChart = ({ data }: PlansByTravelTypeChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plans by Travel Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No travel type data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    type: travelTypeLabels[item.type] || item.type,
    count: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plans by Travel Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="type"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="count"
              fill="hsl(var(--chart-2))"
              name="Number of Plans"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PlansByTravelTypeChart;

