"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Target,
    TrendingUp,
    Activity,
    RefreshCw,
    CheckCircle,
    Clock,
    BarChart3,
    GitBranch,
    Zap,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from "recharts";
import { getModelMetrics, saveModelMetrics } from "@/lib/data/store";
import { ModelMetrics } from "@/lib/data/types";

export default function ModelMonitoringPage() {
    const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
    const [isRetraining, setIsRetraining] = useState(false);

    useEffect(() => {
        setMetrics(getModelMetrics());
    }, []);

    const handleRetrain = () => {
        setIsRetraining(true);

        // Simulate retraining process
        setTimeout(() => {
            if (metrics) {
                const newMetrics: ModelMetrics = {
                    ...metrics,
                    accuracy: Math.min(metrics.accuracy + Math.random() * 2, 99),
                    precision: Math.min(metrics.precision + Math.random() * 2, 99),
                    recall: Math.min(metrics.recall + Math.random() * 2, 99),
                    f1Score: Math.min(metrics.f1Score + Math.random() * 2, 99),
                    lastUpdated: new Date().toISOString().split("T")[0],
                    version: `2.${parseInt(metrics.version.split(".")[1]) + 1}.0`,
                    trainingDataSize: metrics.trainingDataSize + Math.floor(Math.random() * 500),
                    history: [
                        ...metrics.history,
                        {
                            date: new Date().toISOString().split("T")[0],
                            accuracy: Math.min(metrics.accuracy + Math.random() * 2, 99),
                            precision: Math.min(metrics.precision + Math.random() * 2, 99),
                            recall: Math.min(metrics.recall + Math.random() * 2, 99),
                            f1Score: Math.min(metrics.f1Score + Math.random() * 2, 99),
                        },
                    ],
                };
                saveModelMetrics(newMetrics);
                setMetrics(newMetrics);
            }
            setIsRetraining(false);
        }, 3000);
    };

    if (!metrics) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header title="Model Monitoring" />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading metrics...</p>
                </div>
            </div>
        );
    }

    const getMetricColor = (value: number) => {
        if (value >= 85) return "text-green-600";
        if (value >= 70) return "text-amber-600";
        return "text-red-600";
    };

    const metricCards = [
        { name: "Accuracy", value: metrics.accuracy, icon: Target, color: "violet" },
        { name: "Precision", value: metrics.precision, icon: Zap, color: "blue" },
        { name: "Recall", value: metrics.recall, icon: TrendingUp, color: "green" },
        { name: "F1 Score", value: metrics.f1Score, icon: Activity, color: "amber" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Model Monitoring" description="Track ML model performance and feedback loop" />

            <div className="flex-1 p-4 lg:p-8 space-y-8">
                {/* Model Status Banner */}
                <Card className="bg-gradient-to-r from-violet-500/10 to-purple-600/10 border-violet-500/20">
                    <CardContent>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Attrition Prediction Model</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant="outline" className="gap-1">
                                            <GitBranch className="h-3 w-3" />
                                            v{metrics.version}
                                        </Badge>
                                        <span>•</span>
                                        <span>Updated: {new Date(metrics.lastUpdated).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{metrics.trainingDataSize.toLocaleString()} training samples</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium">Model Healthy</span>
                                </div>
                                <Button onClick={handleRetrain} disabled={isRetraining} className="gap-2">
                                    <RefreshCw className={`h-4 w-4 ${isRetraining ? "animate-spin" : ""}`} />
                                    {isRetraining ? "Retraining..." : "Retrain Model"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metric Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {metricCards.map((metric) => (
                        <Card key={metric.name}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                                <metric.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-bold ${getMetricColor(metric.value)}`}>
                                    {metric.value.toFixed(1)}%
                                </div>
                                <Progress value={metric.value} className="mt-2 h-2" />
                                <p className="text-xs text-muted-foreground mt-2">
                                    {metric.value >= 85 ? "Excellent" : metric.value >= 70 ? "Good" : "Needs attention"}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="trends" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="trends" className="gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Performance Trends
                        </TabsTrigger>
                        <TabsTrigger value="comparison" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Metric Comparison
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <Clock className="h-4 w-4" />
                            Version History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="trends" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Over Time</CardTitle>
                                <CardDescription>Model metrics trend across training iterations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={metrics.history}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis dataKey="date" className="text-xs" />
                                            <YAxis domain={[70, 100]} className="text-xs" />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="accuracy"
                                                stroke="#8b5cf6"
                                                strokeWidth={2}
                                                name="Accuracy"
                                                dot={{ fill: "#8b5cf6" }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="precision"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                name="Precision"
                                                dot={{ fill: "#3b82f6" }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="recall"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                                name="Recall"
                                                dot={{ fill: "#22c55e" }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="f1Score"
                                                stroke="#f59e0b"
                                                strokeWidth={2}
                                                name="F1 Score"
                                                dot={{ fill: "#f59e0b" }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="comparison" className="space-y-4">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Metrics Comparison</CardTitle>
                                    <CardDescription>Side-by-side metric analysis</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={[
                                                    { name: "Accuracy", value: metrics.accuracy, fill: "#8b5cf6" },
                                                    { name: "Precision", value: metrics.precision, fill: "#3b82f6" },
                                                    { name: "Recall", value: metrics.recall, fill: "#22c55e" },
                                                    { name: "F1 Score", value: metrics.f1Score, fill: "#f59e0b" },
                                                ]}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Accuracy Trend</CardTitle>
                                    <CardDescription>Model accuracy over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={metrics.history}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis domain={[70, 100]} />
                                                <Tooltip />
                                                <Area
                                                    type="monotone"
                                                    dataKey="accuracy"
                                                    stroke="#8b5cf6"
                                                    fill="#8b5cf6"
                                                    fillOpacity={0.3}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Training History</CardTitle>
                                <CardDescription>Historical model versions and performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Accuracy</TableHead>
                                                <TableHead>Precision</TableHead>
                                                <TableHead>Recall</TableHead>
                                                <TableHead>F1 Score</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[...metrics.history].reverse().map((record, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">
                                                        {new Date(record.date).toLocaleDateString()}
                                                        {index === 0 && (
                                                            <Badge variant="success" className="ml-2">Latest</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className={getMetricColor(record.accuracy)}>
                                                        {record.accuracy.toFixed(1)}%
                                                    </TableCell>
                                                    <TableCell className={getMetricColor(record.precision)}>
                                                        {record.precision.toFixed(1)}%
                                                    </TableCell>
                                                    <TableCell className={getMetricColor(record.recall)}>
                                                        {record.recall.toFixed(1)}%
                                                    </TableCell>
                                                    <TableCell className={getMetricColor(record.f1Score)}>
                                                        {record.f1Score.toFixed(1)}%
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Feedback Loop Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Continuous Learning Status</CardTitle>
                                <CardDescription>Feedback loop and model improvement tracking</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Data Collection</p>
                                                <p className="text-sm text-muted-foreground">Actively collecting employee metrics</p>
                                            </div>
                                        </div>
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium">HR Feedback Integration</p>
                                                <p className="text-sm text-muted-foreground">Incorporating intervention outcomes</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-500">Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <Clock className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Automated Retraining</p>
                                                <p className="text-sm text-muted-foreground">Scheduled for next quarter</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline">Scheduled</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
