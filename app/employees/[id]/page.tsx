"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    ClipboardCheck,
    UserX,
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
import { getEmployeeById, getInterventionsByEmployeeId, updateEmployee, getAssessmentsByEmployee, getResignationByEmployee, addManagerAssessment, addResignation } from "@/lib/data/store";
import { Employee, Intervention, JobLevel, ManagerAssessment, ResignationRecord, RiskLevel, ResignationReason } from "@/lib/data/types";

export default function EmployeeProfilePage() {
    const params = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [assessments, setAssessments] = useState<ManagerAssessment[]>([]);
    const [resignation, setResignation] = useState<ResignationRecord | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Employee | null>(null);
    const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
    const [showResignationDialog, setShowResignationDialog] = useState(false);

    // Assessment form state
    const [assessmentForm, setAssessmentForm] = useState({
        assessorName: "",
        assessorRole: "",
        overallRating: 3,
        riskConcerns: "",
        strengths: "",
        areasForImprovement: "",
        retentionRisk: "medium" as RiskLevel,
        recommendedActions: "",
    });

    // Resignation form state
    const [resignationForm, setResignationForm] = useState({
        resignationDate: new Date().toISOString().split("T")[0],
        lastWorkingDate: "",
        reasons: [] as ResignationReason[],
        feedback: "",
        exitInterviewNotes: "",
    });

    const resignationReasonLabels: Record<ResignationReason, string> = {
        better_opportunity: "Better Opportunity",
        compensation: "Compensation Issues",
        work_life_balance: "Work-Life Balance",
        career_growth: "Career Growth",
        management: "Management Issues",
        relocation: "Relocation",
        personal: "Personal Reasons",
        retirement: "Retirement",
        health: "Health Reasons",
        other: "Other",
    };

    const loadData = () => {
        const emp = getEmployeeById(params.id as string);
        if (emp) {
            setEmployee(emp);
            setEditForm(emp);
            setInterventions(getInterventionsByEmployeeId(emp.id));
            setAssessments(getAssessmentsByEmployee(emp.id));
            setResignation(getResignationByEmployee(emp.id) || null);
        }
    };

    useEffect(() => {
        loadData();
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

    const handleAddAssessment = () => {
        if (!assessmentForm.assessorName || !assessmentForm.assessorRole) return;

        addManagerAssessment({
            employeeId: params.id as string,
            ...assessmentForm,
            date: new Date().toISOString().split("T")[0],
        });

        setShowAssessmentDialog(false);
        setAssessmentForm({
            assessorName: "",
            assessorRole: "",
            overallRating: 3,
            riskConcerns: "",
            strengths: "",
            areasForImprovement: "",
            retentionRisk: "medium",
            recommendedActions: "",
        });
        loadData();
    };

    const handleRecordResignation = () => {
        if (!resignationForm.lastWorkingDate || resignationForm.reasons.length === 0) return;

        addResignation({
            employeeId: params.id as string,
            ...resignationForm,
            wasHighRisk: employee?.riskLevel === "high",
            hadIntervention: interventions.length > 0,
        });

        setShowResignationDialog(false);
        loadData();
    };

    const toggleResignationReason = (reason: ResignationReason) => {
        setResignationForm(prev => ({
            ...prev,
            reasons: prev.reasons.includes(reason)
                ? prev.reasons.filter(r => r !== reason)
                : [...prev.reasons, reason],
        }));
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
                                    <div className="text-xl font-bold">RM{displayData.salary.toLocaleString()}</div>
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
                        <TabsTrigger value="assessments" className="gap-2">
                            <ClipboardCheck className="h-4 w-4" />
                            Assessments ({assessments.length})
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

                    {/* Assessments Tab */}
                    <TabsContent value="assessments" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Manager Assessments</h3>
                                <p className="text-sm text-muted-foreground">Track manager and HR observations about this employee</p>
                            </div>
                            <div className="flex gap-2">
                                {!employee.hasResigned && (
                                    <>
                                        <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="gap-2">
                                                    <ClipboardCheck className="h-4 w-4" />
                                                    Add Assessment
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Manager Assessment</DialogTitle>
                                                    <DialogDescription>
                                                        Record your assessment of {displayData.name}&apos;s retention risk
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Your Name</label>
                                                            <Input
                                                                value={assessmentForm.assessorName}
                                                                onChange={e => setAssessmentForm(prev => ({ ...prev, assessorName: e.target.value }))}
                                                                placeholder="Enter your name"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Your Role</label>
                                                            <Input
                                                                value={assessmentForm.assessorRole}
                                                                onChange={e => setAssessmentForm(prev => ({ ...prev, assessorRole: e.target.value }))}
                                                                placeholder="e.g., Direct Manager"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Overall Rating (1-5)</label>
                                                            <Select
                                                                value={String(assessmentForm.overallRating)}
                                                                onValueChange={v => setAssessmentForm(prev => ({ ...prev, overallRating: parseInt(v) }))}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {[1, 2, 3, 4, 5].map(n => (
                                                                        <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "(Low)" : n === 5 ? "(High)" : ""}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Retention Risk</label>
                                                            <Select
                                                                value={assessmentForm.retentionRisk}
                                                                onValueChange={v => setAssessmentForm(prev => ({ ...prev, retentionRisk: v as RiskLevel }))}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="low">Low</SelectItem>
                                                                    <SelectItem value="medium">Medium</SelectItem>
                                                                    <SelectItem value="high">High</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Risk Concerns</label>
                                                        <Textarea
                                                            value={assessmentForm.riskConcerns}
                                                            onChange={e => setAssessmentForm(prev => ({ ...prev, riskConcerns: e.target.value }))}
                                                            placeholder="What concerns do you have about this employee's retention?"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Strengths</label>
                                                        <Textarea
                                                            value={assessmentForm.strengths}
                                                            onChange={e => setAssessmentForm(prev => ({ ...prev, strengths: e.target.value }))}
                                                            placeholder="What are this employee's key strengths?"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Recommended Actions</label>
                                                        <Textarea
                                                            value={assessmentForm.recommendedActions}
                                                            onChange={e => setAssessmentForm(prev => ({ ...prev, recommendedActions: e.target.value }))}
                                                            placeholder="What actions would you recommend?"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setShowAssessmentDialog(false)}>Cancel</Button>
                                                    <Button onClick={handleAddAssessment}>Submit Assessment</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={showResignationDialog} onOpenChange={setShowResignationDialog}>
                                            <DialogTrigger asChild>
                                                <Button variant="destructive" className="gap-2">
                                                    <UserX className="h-4 w-4" />
                                                    Record Resignation
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Record Resignation</DialogTitle>
                                                    <DialogDescription>
                                                        Record the resignation details for {displayData.name}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Resignation Date</label>
                                                            <Input
                                                                type="date"
                                                                value={resignationForm.resignationDate}
                                                                onChange={e => setResignationForm(prev => ({ ...prev, resignationDate: e.target.value }))}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Last Working Date</label>
                                                            <Input
                                                                type="date"
                                                                value={resignationForm.lastWorkingDate}
                                                                onChange={e => setResignationForm(prev => ({ ...prev, lastWorkingDate: e.target.value }))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Resignation Reasons (select all that apply)</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {(Object.entries(resignationReasonLabels) as [ResignationReason, string][]).map(([key, label]) => (
                                                                <Button
                                                                    key={key}
                                                                    type="button"
                                                                    variant={resignationForm.reasons.includes(key) ? "default" : "outline"}
                                                                    size="sm"
                                                                    className="justify-start text-xs"
                                                                    onClick={() => toggleResignationReason(key)}
                                                                >
                                                                    {label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Employee Feedback</label>
                                                        <Textarea
                                                            value={resignationForm.feedback}
                                                            onChange={e => setResignationForm(prev => ({ ...prev, feedback: e.target.value }))}
                                                            placeholder="Any feedback provided by the employee"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Exit Interview Notes</label>
                                                        <Textarea
                                                            value={resignationForm.exitInterviewNotes}
                                                            onChange={e => setResignationForm(prev => ({ ...prev, exitInterviewNotes: e.target.value }))}
                                                            placeholder="Notes from exit interview"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setShowResignationDialog(false)}>Cancel</Button>
                                                    <Button variant="destructive" onClick={handleRecordResignation}>Record Resignation</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Resignation Info (if applicable) */}
                        {resignation && (
                            <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                        <UserX className="h-5 w-5" />
                                        Resignation Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Resignation Date</p>
                                            <p className="font-medium">{new Date(resignation.resignationDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Last Working Date</p>
                                            <p className="font-medium">{new Date(resignation.lastWorkingDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Was High Risk</p>
                                            <Badge variant={resignation.wasHighRisk ? "destructive" : "success"}>
                                                {resignation.wasHighRisk ? "Yes" : "No"}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Had Intervention</p>
                                            <Badge variant={resignation.hadIntervention ? "default" : "outline"}>
                                                {resignation.hadIntervention ? "Yes" : "No"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Reasons</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resignation.reasons.map(reason => (
                                                <Badge key={reason} variant="outline">{resignationReasonLabels[reason]}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    {resignation.feedback && (
                                        <div className="mt-4">
                                            <p className="text-sm text-muted-foreground mb-1">Feedback</p>
                                            <p className="text-sm">{resignation.feedback}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Assessment List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Assessment History</CardTitle>
                                <CardDescription>Historical assessments from managers and HR</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {assessments.length > 0 ? (
                                    <div className="space-y-4">
                                        {assessments.map(assessment => (
                                            <div key={assessment.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">{assessment.assessorName}</p>
                                                        <p className="text-sm text-muted-foreground">{assessment.assessorRole}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-muted-foreground">{new Date(assessment.date).toLocaleDateString()}</p>
                                                        <Badge variant={getRiskBadgeVariant(assessment.retentionRisk)}>
                                                            {assessment.retentionRisk} risk
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map(n => (
                                                        <Star
                                                            key={n}
                                                            className={`h-4 w-4 ${n <= assessment.overallRating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                                {assessment.riskConcerns && (
                                                    <div>
                                                        <p className="text-sm font-medium">Concerns</p>
                                                        <p className="text-sm text-muted-foreground">{assessment.riskConcerns}</p>
                                                    </div>
                                                )}
                                                {assessment.recommendedActions && (
                                                    <div>
                                                        <p className="text-sm font-medium">Recommended Actions</p>
                                                        <p className="text-sm text-muted-foreground">{assessment.recommendedActions}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>No assessments recorded for this employee yet.</p>
                                        {!employee.hasResigned && (
                                            <Button variant="outline" className="mt-4" onClick={() => setShowAssessmentDialog(true)}>
                                                Add First Assessment
                                            </Button>
                                        )}
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
