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
    Gauge,
    TreeDeciduous,
    Trees,
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
    Cell,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts";
import { getModelMetrics, saveModelMetrics, getEmployees } from "@/lib/data/store";
import { ModelMetrics, AttritionModelInfo } from "@/lib/data/types";
import { trainModels, setTrainedModels, getBestModelName } from "@/lib/ml/attrition-predictor";

// Colors for feature importance chart
const FEATURE_COLORS = {
    overtime: "#ef4444",
    compensation: "#22c55e",
    satisfaction: "#3b82f6",
    growth: "#a855f7",
    workLifeBalance: "#f59e0b",
};

const FEATURE_LABELS = {
    overtime: "Overtime",
    compensation: "Compensation",
    satisfaction: "Satisfaction",
    growth: "Growth",
    workLifeBalance: "Work-Life Balance",
};

export default function ModelMonitoringPage() {
    const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
    const [isRetraining, setIsRetraining] = useState(false);
    const [selectedModel, setSelectedModel] = useState<"rf" | "etc">("rf");
    const [rfModel, setRfModel] = useState<AttritionModelInfo | null>(null);
    const [etcModel, setEtcModel] = useState<AttritionModelInfo | null>(null);

    useEffect(() => {
        const storedMetrics = getModelMetrics();
        setMetrics(storedMetrics);

        // Initialize models if they exist in metrics
        if (storedMetrics?.models) {
            const rf = storedMetrics.models.find(m => m.name === "Random Forest");
            const etc = storedMetrics.models.find(m => m.name === "Extra Trees");
            if (rf) setRfModel(rf);
            if (etc) setEtcModel(etc);
        } else {
            // Train initial models
            handleRetrain();
        }
    }, []);

    const handleRetrain = () => {
        setIsRetraining(true);

        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                const employees = getEmployees();
                const { randomForest, extraTrees, rfModel: trainedRF, etcModel: trainedETC } = trainModels(employees);

                // Store trained models for predictions (with F1 scores to determine winner)
                setTrainedModels(trainedRF, trainedETC, { f1Score: randomForest.f1Score }, { f1Score: extraTrees.f1Score });

                setRfModel(randomForest);
                setEtcModel(extraTrees);

                // Calculate combined metrics (average of both models)
                const combinedAccuracy = (randomForest.accuracy + extraTrees.accuracy) / 2;
                const combinedPrecision = (randomForest.precision + extraTrees.precision) / 2;
                const combinedRecall = (randomForest.recall + extraTrees.recall) / 2;
                const combinedF1 = (randomForest.f1Score + extraTrees.f1Score) / 2;
                const combinedRocAuc = (randomForest.rocAuc + extraTrees.rocAuc) / 2;

                const newMetrics: ModelMetrics = {
                    accuracy: combinedAccuracy,
                    precision: combinedPrecision,
                    recall: combinedRecall,
                    f1Score: combinedF1,
                    rocAuc: combinedRocAuc,
                    lastUpdated: new Date().toISOString().split("T")[0],
                    version: metrics ? `2.${parseInt(metrics.version.split(".")[1]) + 1}.0` : "2.1.0",
                    trainingDataSize: employees.length,
                    history: metrics?.history ? [
                        ...metrics.history,
                        {
                            date: new Date().toISOString().split("T")[0],
                            accuracy: combinedAccuracy,
                            precision: combinedPrecision,
                            recall: combinedRecall,
                            f1Score: combinedF1,
                            rocAuc: combinedRocAuc,
                        },
                    ] : [{
                        date: new Date().toISOString().split("T")[0],
                        accuracy: combinedAccuracy,
                        precision: combinedPrecision,
                        recall: combinedRecall,
                        f1Score: combinedF1,
                        rocAuc: combinedRocAuc,
                    }],
                    models: [randomForest, extraTrees],
                    activeModel: selectedModel === "rf" ? "Random Forest" : "Extra Trees",
                };

                saveModelMetrics(newMetrics);
                setMetrics(newMetrics);
            } catch (error) {
                console.error("Error training models:", error);
            }
            setIsRetraining(false);
        }, 500);
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

    const currentModel = selectedModel === "rf" ? rfModel : etcModel;

    const metricCards = currentModel ? [
        { name: "Accuracy", value: currentModel.accuracy, icon: Target, color: "violet" },
        { name: "Precision", value: currentModel.precision, icon: Zap, color: "blue" },
        { name: "Recall", value: currentModel.recall, icon: TrendingUp, color: "green" },
        { name: "F1 Score", value: currentModel.f1Score, icon: Activity, color: "amber" },
        { name: "ROC-AUC", value: currentModel.rocAuc, icon: Gauge, color: "rose" },
    ] : [
        { name: "Accuracy", value: metrics.accuracy || 0, icon: Target, color: "violet" },
        { name: "Precision", value: metrics.precision || 0, icon: Zap, color: "blue" },
        { name: "Recall", value: metrics.recall || 0, icon: TrendingUp, color: "green" },
        { name: "F1 Score", value: metrics.f1Score || 0, icon: Activity, color: "amber" },
        { name: "ROC-AUC", value: metrics.rocAuc || 0, icon: Gauge, color: "rose" },
    ];

    // Prepare feature importance data
    const featureImportanceData = currentModel ? Object.entries(currentModel.featureImportances).map(([key, value]) => ({
        name: FEATURE_LABELS[key as keyof typeof FEATURE_LABELS] || key,
        value: value * 100,
        fill: FEATURE_COLORS[key as keyof typeof FEATURE_COLORS] || "#8884d8",
    })).sort((a, b) => b.value - a.value) : [];

    // Prepare model comparison data
    const modelComparisonData = rfModel && etcModel ? [
        { metric: "Accuracy", "Random Forest": rfModel.accuracy, "Extra Trees": etcModel.accuracy },
        { metric: "Precision", "Random Forest": rfModel.precision, "Extra Trees": etcModel.precision },
        { metric: "Recall", "Random Forest": rfModel.recall, "Extra Trees": etcModel.recall },
        { metric: "F1 Score", "Random Forest": rfModel.f1Score, "Extra Trees": etcModel.f1Score },
        { metric: "ROC-AUC", "Random Forest": rfModel.rocAuc, "Extra Trees": etcModel.rocAuc },
    ] : [];

    // Prepare radar chart data for feature importance comparison
    const radarData = rfModel && etcModel ? [
        { feature: "Overtime", rf: rfModel.featureImportances.overtime * 100, etc: etcModel.featureImportances.overtime * 100 },
        { feature: "Compensation", rf: rfModel.featureImportances.compensation * 100, etc: etcModel.featureImportances.compensation * 100 },
        { feature: "Satisfaction", rf: rfModel.featureImportances.satisfaction * 100, etc: etcModel.featureImportances.satisfaction * 100 },
        { feature: "Growth", rf: rfModel.featureImportances.growth * 100, etc: etcModel.featureImportances.growth * 100 },
        { feature: "Work-Life", rf: rfModel.featureImportances.workLifeBalance * 100, etc: etcModel.featureImportances.workLifeBalance * 100 },
    ] : [];

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Model Monitoring" description="Track ML model performance and feedback loop" />

            <div className="flex-1 p-4 lg:p-8 space-y-8">
                {/* Model Selection Tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex gap-2">
                        <Button
                            variant={selectedModel === "rf" ? "default" : "outline"}
                            onClick={() => setSelectedModel("rf")}
                            className="gap-2"
                        >
                            <TreeDeciduous className="h-4 w-4" />
                            Random Forest
                        </Button>
                        <Button
                            variant={selectedModel === "etc" ? "default" : "outline"}
                            onClick={() => setSelectedModel("etc")}
                            className="gap-2"
                        >
                            <Trees className="h-4 w-4" />
                            Extra Trees
                        </Button>
                    </div>
                    <Button onClick={handleRetrain} disabled={isRetraining} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${isRetraining ? "animate-spin" : ""}`} />
                        {isRetraining ? "Training Models..." : "Retrain Both Models"}
                    </Button>
                </div>

                {/* Model Status Banner */}
                <Card className={`bg-gradient-to-r ${selectedModel === "rf"
                    ? "from-emerald-500/10 to-green-600/10 border-emerald-500/20"
                    : "from-violet-500/10 to-purple-600/10 border-violet-500/20"}`}>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${selectedModel === "rf"
                                    ? "bg-gradient-to-br from-emerald-500 to-green-600"
                                    : "bg-gradient-to-br from-violet-500 to-purple-600"
                                    }`}>
                                    {selectedModel === "rf"
                                        ? <TreeDeciduous className="h-6 w-6 text-white" />
                                        : <Trees className="h-6 w-6 text-white" />
                                    }
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {selectedModel === "rf" ? "Random Forest Classifier" : "Extra Trees Classifier"}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant="outline" className="gap-1">
                                            <GitBranch className="h-3 w-3" />
                                            v{metrics.version}
                                        </Badge>
                                        <span>•</span>
                                        <span>{currentModel?.nEstimators || 15} trees</span>
                                        <span>•</span>
                                        <span>Max depth: {currentModel?.maxDepth || 8}</span>
                                        <span>•</span>
                                        <span>{metrics.trainingDataSize.toLocaleString()} samples</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium">Model Healthy</span>
                                </div>
                                <Badge variant={selectedModel === "rf" ? "success" : "default"}>
                                    {selectedModel === "rf" ? "Bootstrap Sampling" : "Random Splits"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metric Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

                <Tabs defaultValue="features" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="features" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Feature Importance
                        </TabsTrigger>
                        <TabsTrigger value="comparison" className="gap-2">
                            <Activity className="h-4 w-4" />
                            Model Comparison
                        </TabsTrigger>
                        <TabsTrigger value="trends" className="gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Performance Trends
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <Clock className="h-4 w-4" />
                            Version History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="features" className="space-y-4">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Feature Importance - {selectedModel === "rf" ? "Random Forest" : "Extra Trees"}</CardTitle>
                                    <CardDescription>Which factors most influence attrition predictions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={featureImportanceData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis type="category" dataKey="name" width={100} />
                                                <Tooltip formatter={(value) => `${typeof value === 'number' ? value.toFixed(1) : value}%`} />
                                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                                    {featureImportanceData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Feature Importance Comparison</CardTitle>
                                    <CardDescription>Random Forest vs Extra Trees feature weights</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart data={radarData}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="feature" />
                                                <PolarRadiusAxis domain={[0, 50]} />
                                                <Radar
                                                    name="Random Forest"
                                                    dataKey="rf"
                                                    stroke="#22c55e"
                                                    fill="#22c55e"
                                                    fillOpacity={0.3}
                                                />
                                                <Radar
                                                    name="Extra Trees"
                                                    dataKey="etc"
                                                    stroke="#8b5cf6"
                                                    fill="#8b5cf6"
                                                    fillOpacity={0.3}
                                                />
                                                <Legend />
                                                <Tooltip />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Feature Importance Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Feature Ranking</CardTitle>
                                <CardDescription>Detailed breakdown of feature importances for both models</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Rank</TableHead>
                                                <TableHead>Feature</TableHead>
                                                <TableHead>Random Forest</TableHead>
                                                <TableHead>Extra Trees</TableHead>
                                                <TableHead>Difference</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rfModel && etcModel && Object.keys(FEATURE_LABELS).map((key, index) => {
                                                const rfValue = rfModel.featureImportances[key as keyof typeof rfModel.featureImportances] * 100;
                                                const etcValue = etcModel.featureImportances[key as keyof typeof etcModel.featureImportances] * 100;
                                                const diff = rfValue - etcValue;
                                                return (
                                                    <TableRow key={key}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-3 h-3 rounded-full"
                                                                    style={{ backgroundColor: FEATURE_COLORS[key as keyof typeof FEATURE_COLORS] }}
                                                                />
                                                                {FEATURE_LABELS[key as keyof typeof FEATURE_LABELS]}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{rfValue.toFixed(1)}%</TableCell>
                                                        <TableCell>{etcValue.toFixed(1)}%</TableCell>
                                                        <TableCell className={diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : ""}>
                                                            {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="comparison" className="space-y-4">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Model Performance Comparison</CardTitle>
                                    <CardDescription>Side-by-side metric analysis</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={modelComparisonData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="metric" />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="Random Forest" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="Extra Trees" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Model Details</CardTitle>
                                    <CardDescription>Configuration and hyperparameters</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TreeDeciduous className="h-5 w-5 text-emerald-600" />
                                                    <span className="font-semibold">Random Forest</span>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <p>Estimators: <span className="font-medium">{rfModel?.nEstimators || 15}</span></p>
                                                    <p>Max Depth: <span className="font-medium">{rfModel?.maxDepth || 8}</span></p>
                                                    <p>Bootstrap: <span className="font-medium">Yes</span></p>
                                                    <p>Split: <span className="font-medium">Optimal (Gini)</span></p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Trees className="h-5 w-5 text-violet-600" />
                                                    <span className="font-semibold">Extra Trees</span>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <p>Estimators: <span className="font-medium">{etcModel?.nEstimators || 15}</span></p>
                                                    <p>Max Depth: <span className="font-medium">{etcModel?.maxDepth || 8}</span></p>
                                                    <p>Bootstrap: <span className="font-medium">No</span></p>
                                                    <p>Split: <span className="font-medium">Random</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Key Difference:</strong> Random Forest uses bootstrap sampling and finds optimal splits,
                                                while Extra Trees uses all training data with random split thresholds for faster training and potentially better generalization.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Winner Badge - Active Prediction Model */}
                        {rfModel && etcModel && (
                            <Card className="border-2 border-dashed border-primary/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        Active Prediction Model
                                    </CardTitle>
                                    <CardDescription>
                                        This model is automatically selected based on highest F1 Score and used for all attrition predictions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center gap-4 p-6">
                                        {rfModel.f1Score >= etcModel.f1Score ? (
                                            <>
                                                <TreeDeciduous className="h-12 w-12 text-emerald-600" />
                                                <div>
                                                    <Badge variant="success" className="mb-2">Winner - Used for Predictions</Badge>
                                                    <h3 className="text-2xl font-bold">Random Forest</h3>
                                                    <p className="text-muted-foreground">F1 Score: {rfModel.f1Score.toFixed(1)}%</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Trees className="h-12 w-12 text-violet-600" />
                                                <div>
                                                    <Badge variant="default" className="mb-2">Winner - Used for Predictions</Badge>
                                                    <h3 className="text-2xl font-bold">Extra Trees</h3>
                                                    <p className="text-muted-foreground">F1 Score: {etcModel.f1Score.toFixed(1)}%</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-sm text-center text-muted-foreground mt-2">
                                        All employee attrition risk calculations use this model
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Trends</CardTitle>
                                <CardDescription>Model metrics trend across training iterations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={metrics.history}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis dataKey="date" className="text-xs" />
                                            <YAxis domain={[0, 100]} className="text-xs" />
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
                                            <Line
                                                type="monotone"
                                                dataKey="rocAuc"
                                                stroke="#f43f5e"
                                                strokeWidth={2}
                                                name="ROC-AUC"
                                                dot={{ fill: "#f43f5e" }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
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
                                                <TableHead>ROC-AUC</TableHead>
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
                                                    <TableCell className={getMetricColor(record.rocAuc)}>
                                                        {record.rocAuc.toFixed(1)}%
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
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                <TreeDeciduous className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Random Forest Model</p>
                                                <p className="text-sm text-muted-foreground">Bootstrap sampling with optimal splits</p>
                                            </div>
                                        </div>
                                        <Badge variant="success">Trained</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                                                <Trees className="h-5 w-5 text-violet-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Extra Trees Model</p>
                                                <p className="text-sm text-muted-foreground">Random splits for faster training</p>
                                            </div>
                                        </div>
                                        <Badge variant="success">Trained</Badge>
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
