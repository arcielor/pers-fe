"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Mail,
    Building2,
    Briefcase,
    Calendar,
    DollarSign,
    Clock,
    TrendingUp,
    Star,
    AlertTriangle,
    HeartHandshake,
} from "lucide-react";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { getEmployeeById, getInterventionsByEmployeeId } from "@/lib/data/store";
import { Employee, Intervention } from "@/lib/data/types";

export default function EmployeeProfilePage() {
    const params = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [interventions, setInterventions] = useState<Intervention[]>([]);

    useEffect(() => {
        const emp = getEmployeeById(params.id as string);
        if (emp) {
            setEmployee(emp);
            setInterventions(getInterventionsByEmployeeId(emp.id));
        }
    }, [params.id]);

    if (!employee) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header title="Employee Profile" />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Employee not found</p>
                </div>
            </div>
        );
    }

    const getRiskBadgeVariant = (level: string) => {
        switch (level) {
            case "high":
                return "destructive";
            case "medium":
                return "secondary";
            default:
                return "outline";
        }
    };

    const radarData = [
        { factor: "Overtime", value: employee.riskFactors.overtime, fullMark: 100 },
        { factor: "Compensation", value: employee.riskFactors.compensation, fullMark: 100 },
        { factor: "Satisfaction", value: employee.riskFactors.satisfaction, fullMark: 100 },
        { factor: "Growth", value: employee.riskFactors.growth, fullMark: 100 },
        { factor: "Work-Life", value: employee.riskFactors.workLifeBalance, fullMark: 100 },
    ];

    const barData = [
        { name: "Overtime", value: employee.riskFactors.overtime, fill: "#ef4444" },
        { name: "Compensation", value: employee.riskFactors.compensation, fill: "#f59e0b" },
        { name: "Satisfaction", value: 100 - employee.riskFactors.satisfaction, fill: "#8b5cf6" },
        { name: "Growth Needs", value: employee.riskFactors.growth, fill: "#3b82f6" },
        { name: "Work-Life", value: 100 - employee.riskFactors.workLifeBalance, fill: "#22c55e" },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-500">Completed</Badge>;
            case "in_progress":
                return <Badge className="bg-blue-500">In Progress</Badge>;
            case "planned":
                return <Badge variant="outline">Planned</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Employee Profile" description={`Risk analysis for ${employee.name}`} />

            <div className="flex-1 p-4 lg:p-6 space-y-6">
                {/* Back button */}
                <Link href="/employees">
                    <Button variant="ghost" className="gap-2 mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Employees
                    </Button>
                </Link>

                {/* Employee Header Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="text-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                                        {employee.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold">{employee.name}</h2>
                                        <Badge variant={getRiskBadgeVariant(employee.riskLevel)} className="text-sm">
                                            {employee.riskLevel.charAt(0).toUpperCase() + employee.riskLevel.slice(1)} Risk
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground">{employee.id}</p>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            {employee.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Building2 className="h-4 w-4" />
                                            {employee.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="h-4 w-4" />
                                            {employee.position}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:ml-auto flex flex-col items-center lg:items-end gap-2">
                                <div className="text-center lg:text-right">
                                    <p className="text-sm text-muted-foreground">Risk Score</p>
                                    <p className="text-4xl font-bold">{employee.riskScore}%</p>
                                </div>
                                <Progress value={employee.riskScore} className="w-32 h-3" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hire Date</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                                {new Date(employee.hireDate).toLocaleDateString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {Math.floor(
                                    (Date.now() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
                                )}{" "}
                                years tenure
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Salary</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">${employee.salary.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Annual compensation</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overtime</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{employee.overtimeHours} hrs/week</div>
                            <p className="text-xs text-muted-foreground">
                                {employee.overtimeHours > 15 ? "Above average" : "Normal range"}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Performance</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{employee.performanceRating}/5.0</div>
                            <p className="text-xs text-muted-foreground">Latest review rating</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for Risk Analysis and Interventions */}
                <Tabs defaultValue="risk" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="risk" className="gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Risk Factors
                        </TabsTrigger>
                        <TabsTrigger value="interventions" className="gap-2">
                            <HeartHandshake className="h-4 w-4" />
                            Interventions
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="risk" className="space-y-4">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Risk Factor Radar</CardTitle>
                                    <CardDescription>Multi-dimensional risk analysis</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart data={radarData}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="factor" className="text-xs" />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                <Radar
                                                    name="Risk Level"
                                                    dataKey="value"
                                                    stroke="#8b5cf6"
                                                    fill="#8b5cf6"
                                                    fillOpacity={0.5}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Contributing Factors</CardTitle>
                                    <CardDescription>Breakdown of risk contributors</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis type="category" dataKey="name" width={100} className="text-xs" />
                                                <Tooltip />
                                                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Risk Factor Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Risk Analysis</CardTitle>
                                <CardDescription>Individual factor breakdown with recommendations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(employee.riskFactors).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium capitalize">
                                                {key.replace(/([A-Z])/g, " $1").trim()}
                                            </span>
                                            <span className="text-sm text-muted-foreground">{value}%</span>
                                        </div>
                                        <Progress value={value} className="h-2" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="interventions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Intervention History</CardTitle>
                                        <CardDescription>Past and planned retention strategies</CardDescription>
                                    </div>
                                    <Link href="/interventions">
                                        <Button className="gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            Plan Intervention
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {interventions.length > 0 ? (
                                    <div className="space-y-4">
                                        {interventions.map((intervention) => (
                                            <div key={intervention.id} className="border rounded-lg p-4 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">{intervention.title}</h4>
                                                    {getStatusBadge(intervention.status)}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{intervention.description}</p>
                                                <div className="flex gap-4 text-xs text-muted-foreground">
                                                    <span>Type: {intervention.type.replace(/_/g, " ")}</span>
                                                    <span>Created: {new Date(intervention.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {intervention.outcome && (
                                                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                                                        <strong>Outcome:</strong> {intervention.outcome}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <HeartHandshake className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>No interventions recorded for this employee yet.</p>
                                        <Link href="/interventions">
                                            <Button variant="outline" className="mt-4">
                                                Plan First Intervention
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
