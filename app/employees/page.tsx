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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getEmployees, addEmployee } from "@/lib/data/store";
import { Employee, RiskLevel, JobLevel } from "@/lib/data/types";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [riskFilter, setRiskFilter] = useState<string>("all");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        position: "",
        jobLevel: "mid" as JobLevel,
        salary: "",
        hireDate: "",
        totalWorkingHours: "",
        previousCompanies: "",
    });

    useEffect(() => {
        setEmployees(getEmployees());
    }, []);

    const refreshEmployees = () => {
        setEmployees(getEmployees());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Generate random risk data for demo
        const riskScore = Math.floor(Math.random() * 100);
        const riskLevel: RiskLevel = riskScore > 65 ? "high" : riskScore > 35 ? "medium" : "low";

        addEmployee({
            name: formData.name,
            email: formData.email,
            department: formData.department,
            position: formData.position,
            jobLevel: formData.jobLevel,
            salary: parseInt(formData.salary) || 50000,
            hireDate: formData.hireDate || new Date().toISOString().split("T")[0],
            riskScore,
            riskLevel,
            satisfactionScore: Math.floor(Math.random() * 40) + 60,
            overtimeHours: Math.floor(Math.random() * 20),
            totalWorkingHours: parseInt(formData.totalWorkingHours) || 160,
            previousCompanies: parseInt(formData.previousCompanies) || 0,
            lastPromotionDate: null,
            performanceRating: 3.5 + Math.random() * 1.5,
            avatar: "",
            riskFactors: {
                overtime: Math.floor(Math.random() * 100),
                compensation: Math.floor(Math.random() * 100),
                satisfaction: Math.floor(Math.random() * 100),
                growth: Math.floor(Math.random() * 100),
                workLifeBalance: Math.floor(Math.random() * 100),
            },
        });

        // Reset form and close dialog
        setFormData({
            name: "",
            email: "",
            department: "",
            position: "",
            jobLevel: "mid" as JobLevel,
            salary: "",
            hireDate: "",
            totalWorkingHours: "",
            previousCompanies: "",
        });
        setIsDialogOpen(false);
        refreshEmployees();
    };

    const departments = [...new Set(employees.map((e) => e.department))];

    const filteredEmployees = employees.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRisk = riskFilter === "all" || emp.riskLevel === riskFilter;
        const matchesDept = departmentFilter === "all" || emp.department === departmentFilter;
        return matchesSearch && matchesRisk && matchesDept;
    });

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    const handleFilterChange = (setter: (value: string) => void, value: string) => {
        setter(value);
        setCurrentPage(1);
    };

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

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Employees" description="Manage and monitor employee attrition risks" />

            <div className="flex-1 p-4 lg:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>All Employees</CardTitle>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Employee
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Add New Employee</DialogTitle>
                                        <DialogDescription>
                                            Enter the employee details below. Risk scores will be generated automatically.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Full Name *</label>
                                                <Input
                                                    required
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Email *</label>
                                                <Input
                                                    required
                                                    type="email"
                                                    placeholder="john.doe@company.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Department *</label>
                                                <Input
                                                    required
                                                    placeholder="Engineering"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Position *</label>
                                                <Input
                                                    required
                                                    placeholder="Software Engineer"
                                                    value={formData.position}
                                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Job Level</label>
                                                <select
                                                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                    value={formData.jobLevel}
                                                    onChange={(e) => setFormData({ ...formData, jobLevel: e.target.value as JobLevel })}
                                                >
                                                    <option value="entry">Entry</option>
                                                    <option value="junior">Junior</option>
                                                    <option value="mid">Mid</option>
                                                    <option value="senior">Senior</option>
                                                    <option value="lead">Lead</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="director">Director</option>
                                                    <option value="executive">Executive</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Salary</label>
                                                <Input
                                                    type="number"
                                                    placeholder="75000"
                                                    value={formData.salary}
                                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Hire Date</label>
                                                <Input
                                                    type="date"
                                                    value={formData.hireDate}
                                                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Total Working Hours (monthly)</label>
                                                <Input
                                                    type="number"
                                                    placeholder="160"
                                                    value={formData.totalWorkingHours}
                                                    onChange={(e) => setFormData({ ...formData, totalWorkingHours: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Previous Companies</label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    min="0"
                                                    value={formData.previousCompanies}
                                                    onChange={(e) => setFormData({ ...formData, previousCompanies: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="gap-2">
                                                <Plus className="h-4 w-4" />
                                                Add Employee
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or ID..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={riskFilter} onValueChange={(value) => handleFilterChange(setRiskFilter, value)}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Risk Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Risks</SelectItem>
                                    <SelectItem value="high">High Risk</SelectItem>
                                    <SelectItem value="medium">Medium Risk</SelectItem>
                                    <SelectItem value="low">Low Risk</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={departmentFilter} onValueChange={(value) => handleFilterChange(setDepartmentFilter, value)}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Employee</TableHead>
                                        <TableHead className="hidden md:table-cell">Department</TableHead>
                                        <TableHead className="hidden lg:table-cell">Position</TableHead>
                                        <TableHead>Risk Level</TableHead>
                                        <TableHead className="hidden sm:table-cell">Risk Score</TableHead>
                                        <TableHead className="hidden lg:table-cell">Satisfaction</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedEmployees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell className="font-mono text-sm">{employee.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs">
                                                            {employee.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{employee.name}</p>
                                                        <p className="text-xs text-muted-foreground hidden sm:block">
                                                            {employee.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{employee.position}</TableCell>
                                            <TableCell>
                                                <Badge variant={getRiskBadgeVariant(employee.riskLevel)}>
                                                    {employee.riskLevel.charAt(0).toUpperCase() + employee.riskLevel.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Progress value={employee.riskScore} className="w-16 h-2" />
                                                    <span className="text-sm">{employee.riskScore}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Progress value={employee.satisfactionScore} className="w-16 h-2" />
                                                    <span className="text-sm">{employee.satisfactionScore}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/employees/${employee.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredEmployees.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No employees found matching your criteria.
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredEmployees.length > 0 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredEmployees.length)} of {filteredEmployees.length} employees
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <span className="text-sm font-medium px-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="gap-1"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
