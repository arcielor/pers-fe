"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, AlertTriangle, TrendingDown, TrendingUp, Smile, Search, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { getEmployees, getDashboardStats, getRiskDistribution, getTopContributingFactors, getTopRiskEmployees } from "@/lib/data/store";
import { Employee } from "@/lib/data/types";

const RISK_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

const trendData = [
  { month: "Sep", high: 5, medium: 12, low: 83 },
  { month: "Oct", high: 7, medium: 15, low: 78 },
  { month: "Nov", high: 6, medium: 14, low: 80 },
  { month: "Dec", high: 8, medium: 16, low: 76 },
  { month: "Jan", high: 9, medium: 14, low: 77 },
  { month: "Feb", high: 8, medium: 15, low: 77 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  iconBgColor: string;
}

function StatCard({ title, value, subtitle, icon, trend, iconBgColor }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {trend && (
                <span className={`flex items-center text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                  {trend.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {trend.value}%
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState({ totalEmployees: 0, highRiskCount: 0, avgSatisfaction: 0, turnoverRate: 0 });
  const [distribution, setDistribution] = useState({ high: 0, medium: 0, low: 0 });
  const [contributingFactors, setContributingFactors] = useState<{ name: string; value: number; label: string; total: number }[]>([]);
  const [topRiskEmployees, setTopRiskEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  useEffect(() => {
    setEmployees(getEmployees());
    setStats(getDashboardStats());
    setDistribution(getRiskDistribution());
    setContributingFactors(getTopContributingFactors());
    setTopRiskEmployees(getTopRiskEmployees(5));
  }, []);

  const pieData = [
    { name: "High Risk", value: distribution.high, color: RISK_COLORS.high },
    { name: "Medium Risk", value: distribution.medium, color: RISK_COLORS.medium },
    { name: "Low Risk", value: distribution.low, color: RISK_COLORS.low },
  ];

  const departments = [...new Set(employees.map((e) => e.department))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "all" || emp.riskLevel === riskFilter;
    const matchesDept = departmentFilter === "all" || emp.department === departmentFilter;
    return matchesSearch && matchesRisk && matchesDept;
  });

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" description="Employee retention analytics overview" />

      <div className="flex-1 p-4 lg:p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            subtitle="Active workforce"
            icon={<Users className="h-6 w-6 text-white" />}
            iconBgColor="bg-gradient-to-br from-primary to-primary/80"
            trend={{ value: 2.5, isPositive: true }}
          />
          <StatCard
            title="High Risk"
            value={stats.highRiskCount}
            subtitle="Require immediate attention"
            icon={<AlertTriangle className="h-6 w-6 text-white" />}
            iconBgColor="bg-gradient-to-br from-red-500 to-red-600"
            trend={{ value: 4.2, isPositive: false }}
          />
          <StatCard
            title="Avg. Satisfaction"
            value={`${stats.avgSatisfaction}%`}
            subtitle="Based on recent surveys"
            icon={<Smile className="h-6 w-6 text-white" />}
            iconBgColor="bg-gradient-to-br from-green-500 to-green-600"
            trend={{ value: 1.8, isPositive: true }}
          />
          <StatCard
            title="Turnover Rate"
            value={`${stats.turnoverRate}%`}
            subtitle="Last 12 months"
            icon={<TrendingDown className="h-6 w-6 text-white" />}
            iconBgColor="bg-gradient-to-br from-amber-500 to-amber-600"
            trend={{ value: 0.5, isPositive: false }}
          />
        </div>

        {/* Top 5 High-Risk Employees & Contributing Factors Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top 5 High-Risk Employees */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold">Top 5 High-Risk Employees</CardTitle>
                  <CardDescription>Employees with highest attrition risk</CardDescription>
                </div>
                <Link href="/employees?risk=high">
                  <Button variant="outline" size="sm" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topRiskEmployees.map((employee, index) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-gradient-to-r from-red-500/5 to-transparent hover:from-red-500/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-7 w-7 rounded-full bg-red-100 text-red-600 text-sm font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-9 w-9 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/10 text-red-600 text-xs font-semibold">
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-red-600">{employee.riskScore}%</p>
                      <Link href={`/employees/${employee.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Contributing Factors Chart */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Top 5 Contributing Factors</CardTitle>
              <CardDescription>Employees with concerning risk scores (≥50%) by factor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contributingFactors}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={true} vertical={false} />
                    <XAxis
                      type="number"
                      domain={[0, contributingFactors[0]?.total || 10]}
                      className="text-xs"
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      className="text-xs"
                      axisLine={false}
                      tickLine={false}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value, name, props) => {
                        const total = props.payload?.total || 0;
                        return [`${value} of ${total} employees`, 'Affected'];
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#f59e0b"
                      radius={[0, 8, 8, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row - Risk Distribution & Trends */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Risk Distribution</CardTitle>
              <CardDescription>Current employee attrition risk breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Risk Trends</CardTitle>
              <CardDescription>Attrition risk levels over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={RISK_COLORS.high} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={RISK_COLORS.high} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={RISK_COLORS.medium} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={RISK_COLORS.medium} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={RISK_COLORS.low} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={RISK_COLORS.low} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} />
                    <YAxis className="text-xs" axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="high" stroke={RISK_COLORS.high} strokeWidth={2} fillOpacity={1} fill="url(#highGradient)" name="High Risk %" />
                    <Area type="monotone" dataKey="medium" stroke={RISK_COLORS.medium} strokeWidth={2} fillOpacity={1} fill="url(#mediumGradient)" name="Medium Risk %" />
                    <Area type="monotone" dataKey="low" stroke={RISK_COLORS.low} strokeWidth={2} fillOpacity={1} fill="url(#lowGradient)" name="Low Risk %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
