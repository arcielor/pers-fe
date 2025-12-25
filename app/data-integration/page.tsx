"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Database, Plus, FileUp, Trash2, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImports, addImport, addEmployee, deleteImport } from "@/lib/data/store";
import { HRISImport, Employee, RiskLevel, JobLevel } from "@/lib/data/types";
import { classifyDocument, CATEGORY_LABELS, CATEGORY_COLORS, DocumentCategory } from "@/lib/ml/classifier";

export default function DataIntegrationPage() {
    const [imports, setImports] = useState<HRISImport[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | "all">("all");

    // Manual form state
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
        setImports(getImports());
    }, []);

    const refreshData = () => {
        setImports(getImports());
    };

    const handleDeleteImport = (importId: string) => {
        deleteImport(importId);
        setDeleteConfirmId(null);
        refreshData();
    };



    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        // Classify the document using Naive Bayes algorithm
        const classification = classifyDocument(file.name);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);

                    // Add import record with AI classification
                    addImport({
                        filename: file.name,
                        importedAt: new Date().toISOString().split("T")[0],
                        recordCount: Math.floor(Math.random() * 200) + 50,
                        status: "success",
                        dataCategory: classification.category,
                        categoryConfidence: classification.confidence,
                    });
                    refreshData();
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
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

        // Reset form
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

        alert("Employee added successfully!");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success":
                return (
                    <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Success
                    </Badge>
                );
            case "failed":
                return (
                    <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Failed
                    </Badge>
                );
            case "processing":
                return (
                    <Badge variant="secondary" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Processing
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getCategoryBadge = (category?: DocumentCategory) => {
        if (!category) return <span className="text-muted-foreground text-sm">-</span>;

        const colorClass = CATEGORY_COLORS[category] || "bg-gray-500";
        const label = CATEGORY_LABELS[category] || category;

        return (
            <Badge className={`${colorClass} text-white gap-1`}>
                <Sparkles className="h-3 w-3" />
                {label}
            </Badge>
        );
    };

    const getConfidenceBadge = (confidence?: number) => {
        if (confidence === undefined) return <span className="text-muted-foreground text-sm">-</span>;

        let colorClass = "text-green-600";
        if (confidence < 70) colorClass = "text-orange-500";
        else if (confidence < 85) colorClass = "text-yellow-600";

        return (
            <span className={`font-medium ${colorClass}`}>
                {confidence}%
            </span>
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Data Integration" description="Import and manage HRIS data" />

            <div className="flex-1 p-4 lg:p-8 space-y-8">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Imports</CardTitle>
                            <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{imports.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Records Imported</CardTitle>
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {imports.reduce((acc, i) => acc + i.recordCount, 0).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {imports.length > 0
                                    ? Math.round((imports.filter((i) => i.status === "success").length / imports.length) * 100)
                                    : 0}
                                %
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="upload" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="upload" className="gap-2">
                            <FileUp className="h-4 w-4" />
                            File Upload
                        </TabsTrigger>
                        <TabsTrigger value="manual" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Manual Entry
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                        {/* File Upload Area */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload HRIS Data</CardTitle>
                                <CardDescription>Import employee data from CSV or Excel files</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/25 hover:border-primary/50"
                                        }`}
                                >
                                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Supports CSV, XLSX, and XLS files up to 10MB
                                    </p>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileSelect}
                                    />
                                    <Button asChild>
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            Browse Files
                                        </label>
                                    </Button>
                                </div>

                                {isUploading && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <Progress value={uploadProgress} className="h-2" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Import History */}
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle>Import History</CardTitle>
                                        <CardDescription>Recent file imports and their status</CardDescription>
                                    </div>
                                    <Select
                                        value={categoryFilter}
                                        onValueChange={(value) => setCategoryFilter(value as DocumentCategory | "all")}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="employee_data">Employee Data</SelectItem>
                                            <SelectItem value="performance_review">Performance Review</SelectItem>
                                            <SelectItem value="payroll">Payroll</SelectItem>
                                            <SelectItem value="attendance">Attendance</SelectItem>
                                            <SelectItem value="survey">Survey</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Filename</TableHead>
                                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                                                <TableHead>Records</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Confidence</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {imports
                                                .filter(imp => categoryFilter === "all" || imp.dataCategory === categoryFilter)
                                                .map((importRecord) => (
                                                    <TableRow key={importRecord.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                                                <span className="font-medium">{importRecord.filename}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">
                                                            {new Date(importRecord.importedAt).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>{importRecord.recordCount.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            {getCategoryBadge(importRecord.dataCategory)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {getConfidenceBadge(importRecord.categoryConfidence)}
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(importRecord.status)}</TableCell>
                                                        <TableCell className="text-right">
                                                            {deleteConfirmId === importRecord.id ? (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <span className="text-sm text-muted-foreground">Delete?</span>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteImport(importRecord.id)}
                                                                    >
                                                                        Yes
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setDeleteConfirmId(null)}
                                                                    >
                                                                        No
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => setDeleteConfirmId(importRecord.id)}
                                                                    className="text-muted-foreground hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {imports.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No imports yet. Upload a file to get started.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="manual" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Employee Manually</CardTitle>
                                <CardDescription>Enter employee data directly into the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleManualSubmit} className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
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
                                                placeholder="john.doe@jojacorp.com"
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
                                    <Button type="submit" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Employee
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
