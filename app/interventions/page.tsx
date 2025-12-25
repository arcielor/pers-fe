"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Scale, TrendingUp, MessageSquare, CheckCircle, Clock, Calendar, Target } from "lucide-react";
import { getInterventions, getEmployees, addIntervention, updateIntervention } from "@/lib/data/store";
import { Intervention, Employee, InterventionType, InterventionStatus } from "@/lib/data/types";

const interventionTypes: { value: InterventionType; label: string; icon: React.ReactNode }[] = [
    { value: "training", label: "Training", icon: <BookOpen className="h-4 w-4" /> },
    { value: "workload_adjustment", label: "Workload Adjustment", icon: <Scale className="h-4 w-4" /> },
    { value: "career_development", label: "Career Development", icon: <TrendingUp className="h-4 w-4" /> },
    { value: "compensation", label: "Compensation Review", icon: <Target className="h-4 w-4" /> },
    { value: "other", label: "Other", icon: <MessageSquare className="h-4 w-4" /> },
];

export default function InterventionsPage() {
    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Form state
    const [formEmployee, setFormEmployee] = useState("");
    const [formType, setFormType] = useState<InterventionType>("training");
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");

    useEffect(() => {
        setInterventions(getInterventions());
        setEmployees(getEmployees());
    }, []);

    const refreshData = () => {
        setInterventions(getInterventions());
    };

    const handleSubmit = () => {
        if (!formEmployee || !formTitle || !formDescription) return;

        addIntervention({
            employeeId: formEmployee,
            type: formType,
            title: formTitle,
            description: formDescription,
            status: "planned",
            createdAt: new Date().toISOString().split("T")[0],
            completedAt: null,
            outcome: null,
        });

        // Reset form
        setFormEmployee("");
        setFormType("training");
        setFormTitle("");
        setFormDescription("");
        setDialogOpen(false);
        refreshData();
    };

    const handleStatusChange = (intervention: Intervention, newStatus: InterventionStatus) => {
        const updated = {
            ...intervention,
            status: newStatus,
            completedAt: newStatus === "completed" ? new Date().toISOString().split("T")[0] : null,
        };
        updateIntervention(updated);
        refreshData();
    };

    const getEmployeeName = (employeeId: string) => {
        const emp = employees.find((e) => e.id === employeeId);
        return emp?.name || employeeId;
    };

    const getEmployeeInitials = (employeeId: string) => {
        const emp = employees.find((e) => e.id === employeeId);
        return emp?.name
            .split(" ")
            .map((n) => n[0])
            .join("") || "?";
    };

    const getStatusBadge = (status: InterventionStatus) => {
        switch (status) {
            case "completed":
                return <Badge variant="success">Completed</Badge>;
            case "in_progress":
                return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
            case "planned":
                return <Badge variant="outline">Planned</Badge>;
            case "cancelled":
                return <Badge variant="secondary">Cancelled</Badge>;
        }
    };

    const getTypeIcon = (type: InterventionType) => {
        const found = interventionTypes.find((t) => t.value === type);
        return found?.icon || <MessageSquare className="h-4 w-4" />;
    };

    const filteredInterventions = interventions.filter(
        (i) => statusFilter === "all" || i.status === statusFilter
    );

    const stats = {
        total: interventions.length,
        completed: interventions.filter((i) => i.status === "completed").length,
        inProgress: interventions.filter((i) => i.status === "in_progress").length,
        planned: interventions.filter((i) => i.status === "planned").length,
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Interventions" description="Plan and manage employee retention strategies" />

            <div className="flex-1 p-4 lg:p-8 space-y-8">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Interventions</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Planned</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.planned}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Intervention Types Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Intervention Types</CardTitle>
                        <CardDescription>Select an intervention type to create a new plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            {interventionTypes.map((type) => (
                                <Button
                                    key={type.value}
                                    variant="outline"
                                    className="h-auto py-4 flex flex-col gap-2"
                                    onClick={() => {
                                        setFormType(type.value);
                                        setDialogOpen(true);
                                    }}
                                >
                                    {type.icon}
                                    <span className="text-xs">{type.label}</span>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Interventions List */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>All Interventions</CardTitle>
                                <CardDescription>Manage and track retention strategies</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="planned">Planned</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            New Intervention
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create New Intervention</DialogTitle>
                                            <DialogDescription>Plan a retention strategy for an employee</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Employee</label>
                                                <Select value={formEmployee} onValueChange={setFormEmployee}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select employee" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {employees.map((emp) => (
                                                            <SelectItem key={emp.id} value={emp.id}>
                                                                {emp.name} - {emp.department}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Type</label>
                                                <Select value={formType} onValueChange={(v) => setFormType(v as InterventionType)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {interventionTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Title</label>
                                                <Input
                                                    placeholder="e.g., Career Development Discussion"
                                                    value={formTitle}
                                                    onChange={(e) => setFormTitle(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Description</label>
                                                <Input
                                                    placeholder="Describe the intervention plan..."
                                                    value={formDescription}
                                                    onChange={(e) => setFormDescription(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSubmit}>Create Intervention</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="hidden md:table-cell">Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden sm:table-cell">Created</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInterventions.map((intervention) => (
                                        <TableRow key={intervention.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs">
                                                            {getEmployeeInitials(intervention.employeeId)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{getEmployeeName(intervention.employeeId)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(intervention.type)}
                                                    <span className="hidden sm:inline capitalize">
                                                        {intervention.type.replace(/_/g, " ")}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{intervention.title}</TableCell>
                                            <TableCell>{getStatusBadge(intervention.status)}</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {new Date(intervention.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={intervention.status}
                                                    onValueChange={(v) => handleStatusChange(intervention, v as InterventionStatus)}
                                                >
                                                    <SelectTrigger className="w-[130px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="planned">Planned</SelectItem>
                                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredInterventions.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No interventions found. Create one to get started.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
