"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    Layers,
    Users,
    Pencil,
    Save,
    X,
    Lightbulb,
    CheckCircle2,
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
import { getEmployeeById, getInterventionsByEmployeeId, updateEmployee } from "@/lib/data/store";
import { Employee, Intervention, JobLevel } from "@/lib/data/types";

export default function EmployeeProfilePage() {
    const params = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Employee | null>(null);

    useEffect(() => {
        const emp = getEmployeeById(params.id as string);
        if (emp) {
            setEmployee(emp);
            setEditForm(emp);
            setInterventions(getInterventionsByEmployeeId(emp.id));
        }
    }, [params.id]);

    const handleEdit = () => {
        setEditForm(employee);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditForm(employee);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (editForm) {
            updateEmployee(editForm);
            setEmployee(editForm);
            setIsEditing(false);
        }
    };

    const handleInputChange = (field: keyof Employee, value: string | number) => {
        if (editForm) {
            setEditForm({ ...editForm, [field]: value });
        }
    };

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
                return "warning";
            default:
                return "success";
        }
    };

    const displayData = isEditing ? editForm! : employee;

    const radarData = [
        { factor: "Overtime", value: displayData.riskFactors.overtime, fullMark: 100 },
        { factor: "Compensation", value: displayData.riskFactors.compensation, fullMark: 100 },
        { factor: "Satisfaction", value: displayData.riskFactors.satisfaction, fullMark: 100 },
        { factor: "Growth", value: displayData.riskFactors.growth, fullMark: 100 },
        { factor: "Work-Life", value: displayData.riskFactors.workLifeBalance, fullMark: 100 },
    ];

    const barData = [
        { name: "Overtime", value: displayData.riskFactors.overtime, fill: "#ef4444" },
        { name: "Compensation", value: displayData.riskFactors.compensation, fill: "#f59e0b" },
        { name: "Satisfaction", value: 100 - displayData.riskFactors.satisfaction, fill: "#8b5cf6" },
        { name: "Growth Needs", value: displayData.riskFactors.growth, fill: "#3b82f6" },
        { name: "Work-Life", value: 100 - displayData.riskFactors.workLifeBalance, fill: "#22c55e" },
    ];

    // Generate personalized risk reduction recommendations
    const getRecommendations = () => {
        const recommendations: {
            factor: string;
            severity: "critical" | "high" | "medium" | "low";
            title: string;
            description: string;
            actions: string[];
        }[] = [];

        const { overtime, compensation, satisfaction, growth, workLifeBalance } = displayData.riskFactors;

        // Overtime recommendations
        if (overtime >= 70) {
            recommendations.push({
                factor: "Overtime",
                severity: "critical",
                title: "Reduce Excessive Overtime",
                description: `${displayData.name} is working ${displayData.overtimeHours} hours of overtime weekly, which is significantly impacting work-life balance and increasing burnout risk.`,
                actions: [
                    "Conduct immediate workload assessment and redistribute tasks",
                    "Consider hiring additional team members or contractors",
                    "Implement strict overtime limits with manager approval requirements",
                    "Schedule mandatory rest days after high-intensity periods",
                ],
            });
        } else if (overtime >= 50) {
            recommendations.push({
                factor: "Overtime",
                severity: "high",
                title: "Monitor and Reduce Overtime",
                description: `Current overtime levels require attention to prevent further escalation.`,
                actions: [
                    "Review project deadlines and adjust timelines where possible",
                    "Identify and eliminate inefficient processes",
                    "Encourage use of time management tools and techniques",
                ],
            });
        }

        // Compensation recommendations
        if (compensation >= 70) {
            recommendations.push({
                factor: "Compensation",
                severity: "critical",
                title: "Urgent Compensation Review Required",
                description: `Compensation concerns are a major driver of attrition risk. Market analysis suggests salary may be below competitive rates.`,
                actions: [
                    "Conduct immediate market salary benchmark analysis",
                    "Schedule compensation review meeting with HR and management",
                    "Consider performance-based bonus or equity compensation",
                    "Explore non-monetary benefits (additional PTO, flexible work arrangements)",
                ],
            });
        } else if (compensation >= 50) {
            recommendations.push({
                factor: "Compensation",
                severity: "high",
                title: "Review Compensation Package",
                description: `Employee may feel undervalued. Proactive compensation discussion recommended.`,
                actions: [
                    "Schedule one-on-one discussion about career and compensation expectations",
                    "Review total compensation including benefits and perks",
                    "Create clear path to salary increases with measurable milestones",
                ],
            });
        }

        // Job Satisfaction recommendations (satisfaction score = higher is better, so LOW score = problem)
        if (satisfaction <= 30) {
            recommendations.push({
                factor: "Satisfaction",
                severity: "critical",
                title: "Address Job Satisfaction Issues",
                description: `Low job satisfaction is a primary attrition driver. Immediate intervention needed to understand and address concerns.`,
                actions: [
                    "Schedule in-depth stay interview to understand pain points",
                    "Identify sources of frustration (workload, management, environment)",
                    "Consider role adjustment or project reassignment",
                    "Implement quick wins to demonstrate responsiveness to feedback",
                ],
            });
        } else if (satisfaction <= 50) {
            recommendations.push({
                factor: "Satisfaction",
                severity: "high",
                title: "Improve Job Satisfaction",
                description: `Satisfaction levels indicate room for improvement in engagement and fulfillment.`,
                actions: [
                    "Increase recognition and appreciation for contributions",
                    "Provide more autonomy and ownership over projects",
                    "Create opportunities for meaningful work and impact visibility",
                ],
            });
        }

        // Career Growth recommendations
        if (growth >= 70) {
            recommendations.push({
                factor: "Growth",
                severity: "critical",
                title: "Create Clear Career Development Path",
                description: `Limited growth opportunities are a significant risk factor. ${displayData.lastPromotionDate ? `Last promotion was ${new Date(displayData.lastPromotionDate).toLocaleDateString()}.` : "No promotion recorded."}`,
                actions: [
                    "Develop individualized career development plan with timeline",
                    "Identify specific skills needed for next role and provide training",
                    "Assign stretch projects and leadership opportunities",
                    "Consider promotion or title change if qualifications are met",
                    "Establish mentorship with senior leadership",
                ],
            });
        } else if (growth >= 50) {
            recommendations.push({
                factor: "Growth",
                severity: "high",
                title: "Enhance Growth Opportunities",
                description: `Employee may feel stagnant in current role. Proactive development discussion recommended.`,
                actions: [
                    "Schedule career development conversation",
                    "Identify and fund relevant training or certifications",
                    "Create cross-functional project opportunities",
                ],
            });
        }

        // Work-Life Balance recommendations
        if (workLifeBalance <= 30) {
            recommendations.push({
                factor: "Work-Life Balance",
                severity: "critical",
                title: "Restore Work-Life Balance",
                description: `Poor work-life balance is causing significant strain. Immediate action required to prevent burnout.`,
                actions: [
                    "Review and adjust workload distribution immediately",
                    "Implement flexible work arrangements or remote work options",
                    "Discourage after-hours communication expectations",
                    "Consider temporary workload reduction or sabbatical",
                    "Provide access to wellness programs and mental health resources",
                ],
            });
        } else if (workLifeBalance <= 50) {
            recommendations.push({
                factor: "Work-Life Balance",
                severity: "high",
                title: "Improve Work-Life Balance",
                description: `Work-life balance needs attention to maintain long-term engagement.`,
                actions: [
                    "Encourage use of all vacation days",
                    "Set boundaries around meeting times and availability",
                    "Review if work distribution is equitable across team",
                ],
            });
        }

        // Sort by severity
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return recommendations.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    };

    const recommendations = getRecommendations();

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical":
                return "bg-red-500";
            case "high":
                return "bg-orange-500";
            case "medium":
                return "bg-yellow-500";
            default:
                return "bg-blue-500";
        }
    };

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

    const jobLevels: JobLevel[] = ["entry", "junior", "mid", "senior", "lead", "manager", "director", "executive"];

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Employee Profile" description={`Risk analysis for ${displayData.name}`} />

            <div className="flex-1 p-4 lg:p-6 space-y-6">
                {/* Back button and Edit controls */}
                <div className="flex items-center justify-between">
                    <Link href="/employees">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Employees
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={handleCancel} className="gap-2">
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button onClick={handleEdit} className="gap-2">
                                <Pencil className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                {/* Employee Header Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="text-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                                        {displayData.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        {isEditing ? (
                                            <Input
                                                value={editForm?.name || ""}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="text-2xl font-bold h-auto py-1"
                                            />
                                        ) : (
                                            <h2 className="text-2xl font-bold">{displayData.name}</h2>
                                        )}
                                        <Badge variant={getRiskBadgeVariant(displayData.riskLevel)} className="text-sm">
                                            {displayData.riskLevel.charAt(0).toUpperCase() + displayData.riskLevel.slice(1)} Risk
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground">{displayData.id}</p>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            {isEditing ? (
                                                <Input
                                                    value={editForm?.email || ""}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    className="h-7 w-48"
                                                />
                                            ) : (
                                                displayData.email
                                            )}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Building2 className="h-4 w-4" />
                                            {isEditing ? (
                                                <Input
                                                    value={editForm?.department || ""}
                                                    onChange={(e) => handleInputChange("department", e.target.value)}
                                                    className="h-7 w-32"
                                                />
                                            ) : (
                                                displayData.department
                                            )}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="h-4 w-4" />
                                            {isEditing ? (
                                                <Input
                                                    value={editForm?.position || ""}
                                                    onChange={(e) => handleInputChange("position", e.target.value)}
                                                    className="h-7 w-40"
                                                />
                                            ) : (
                                                displayData.position
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:ml-auto flex flex-col items-center lg:items-end gap-2">
                                <div className="text-center lg:text-right">
                                    <p className="text-sm text-muted-foreground">Risk Score</p>
                                    <p className="text-4xl font-bold">{displayData.riskScore}%</p>
                                </div>
                                <Progress value={displayData.riskScore} className="w-32 h-3" />
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
                            {isEditing ? (
                                <Input
                                    type="date"
                                    value={editForm?.hireDate || ""}
                                    onChange={(e) => handleInputChange("hireDate", e.target.value)}
                                    className="h-8"
                                />
                            ) : (
                                <>
                                    <div className="text-xl font-bold">
                                        {new Date(displayData.hireDate).toLocaleDateString()}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {Math.floor(
                                            (Date.now() - new Date(displayData.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
                                        )}{" "}
                                        years tenure
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Salary</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    value={editForm?.salary || 0}
                                    onChange={(e) => handleInputChange("salary", parseInt(e.target.value) || 0)}
                                    className="h-8"
                                />
                            ) : (
                                <>
                                    <div className="text-xl font-bold">${displayData.salary.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">Annual compensation</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Job Level</CardTitle>
                            <Layers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <select
                                    className="flex h-8 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    value={editForm?.jobLevel || "mid"}
                                    onChange={(e) => handleInputChange("jobLevel", e.target.value as JobLevel)}
                                >
                                    {jobLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <>
                                    <div className="text-xl font-bold capitalize">{displayData.jobLevel}</div>
                                    <p className="text-xs text-muted-foreground">Current position level</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Performance</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={editForm?.performanceRating || 0}
                                    onChange={(e) => handleInputChange("performanceRating", parseFloat(e.target.value) || 0)}
                                    className="h-8"
                                />
                            ) : (
                                <>
                                    <div className="text-xl font-bold">{displayData.performanceRating}/5.0</div>
                                    <p className="text-xs text-muted-foreground">Latest review rating</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Details Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    value={editForm?.overtimeHours || 0}
                                    onChange={(e) => handleInputChange("overtimeHours", parseInt(e.target.value) || 0)}
                                    className="h-8"
                                />
                            ) : (
                                <>
                                    <div className="text-xl font-bold">{displayData.overtimeHours} hrs/week</div>
                                    <p className="text-xs text-muted-foreground">
                                        {displayData.overtimeHours > 15 ? "Above average" : "Normal range"}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Working Hours</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    value={editForm?.totalWorkingHours || 0}
                                    onChange={(e) => handleInputChange("totalWorkingHours", parseInt(e.target.value) || 0)}
                                    className="h-8"
                                />
                            ) : (
                                <>
                                    <div className="text-xl font-bold">{displayData.totalWorkingHours} hrs/month</div>
                                    <p className="text-xs text-muted-foreground">
                                        {displayData.totalWorkingHours > 176 ? "Above standard" : "Standard hours"}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Previous Companies</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    min="0"
                                    value={editForm?.previousCompanies || 0}
                                    onChange={(e) => handleInputChange("previousCompanies", parseInt(e.target.value) || 0)}
                                    className="h-8"
                                />
                            ) : (
                                <>
                                    <div className="text-xl font-bold">{displayData.previousCompanies}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {displayData.previousCompanies > 3 ? "Experienced professional" : "Career history"}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Satisfaction Score Card (editable) */}
                {isEditing && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={editForm?.satisfactionScore || 0}
                                onChange={(e) => handleInputChange("satisfactionScore", parseInt(e.target.value) || 0)}
                                className="h-8 w-32"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Current: {displayData.satisfactionScore}%</p>
                        </CardContent>
                    </Card>
                )}

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
                                {Object.entries(displayData.riskFactors).map(([key, value]) => (
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

                        {/* Risk Reduction Recommendations */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                                    Risk Reduction Recommendations for {displayData.name}
                                </CardTitle>
                                <CardDescription>
                                    Personalized action items to reduce attrition risk based on current risk factors
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recommendations.length > 0 ? (
                                    <div className="space-y-6">
                                        {recommendations.map((rec, index) => (
                                            <div key={index} className="border rounded-lg p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <Badge className={`${getSeverityColor(rec.severity)} text-white`}>
                                                            {rec.severity.toUpperCase()}
                                                        </Badge>
                                                        <h4 className="font-semibold">{rec.title}</h4>
                                                    </div>
                                                    <Badge variant="outline">{rec.factor}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{rec.description}</p>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Recommended Actions:</p>
                                                    <ul className="space-y-1.5">
                                                        {rec.actions.map((action, actionIndex) => (
                                                            <li key={actionIndex} className="flex items-start gap-2 text-sm">
                                                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                                <span>{action}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                                        <p className="font-medium text-foreground">No Critical Risk Factors Identified</p>
                                        <p className="text-sm mt-1">
                                            {displayData.name}'s risk factors are within acceptable ranges. Continue monitoring and maintaining current practices.
                                        </p>
                                    </div>
                                )}
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
