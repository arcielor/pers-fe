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
import { Search, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { getEmployees } from "@/lib/data/store";
import { Employee } from "@/lib/data/types";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [riskFilter, setRiskFilter] = useState<string>("all");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");

    useEffect(() => {
        setEmployees(getEmployees());
    }, []);

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

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Employees" description="Manage and monitor employee attrition risks" />

            <div className="flex-1 p-4 lg:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>All Employees</CardTitle>
                                <CardDescription>
                                    {filteredEmployees.length} of {employees.length} employees shown
                                </CardDescription>
                            </div>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Employee
                            </Button>
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
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={riskFilter} onValueChange={setRiskFilter}>
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
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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
                                    {filteredEmployees.map((employee) => (
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
