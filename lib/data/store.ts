"use client";

import { Employee, Intervention, ModelMetrics, HRISImport } from "./types";

// Default mock employees
const defaultEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Engineering",
    position: "Senior Developer",
    hireDate: "2020-03-15",
    salary: 95000,
    riskScore: 78,
    riskLevel: "high",
    satisfactionScore: 45,
    overtimeHours: 25,
    lastPromotionDate: "2021-06-01",
    performanceRating: 4.2,
    avatar: "",
    riskFactors: {
      overtime: 85,
      compensation: 65,
      satisfaction: 40,
      growth: 55,
      workLifeBalance: 35,
    },
  },
  {
    id: "EMP002",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    hireDate: "2019-07-22",
    salary: 85000,
    riskScore: 45,
    riskLevel: "medium",
    satisfactionScore: 68,
    overtimeHours: 10,
    lastPromotionDate: "2022-01-15",
    performanceRating: 3.8,
    avatar: "",
    riskFactors: {
      overtime: 40,
      compensation: 55,
      satisfaction: 65,
      growth: 45,
      workLifeBalance: 70,
    },
  },
  {
    id: "EMP003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    department: "Sales",
    position: "Sales Representative",
    hireDate: "2021-11-08",
    salary: 72000,
    riskScore: 25,
    riskLevel: "low",
    satisfactionScore: 82,
    overtimeHours: 5,
    lastPromotionDate: "2023-03-20",
    performanceRating: 4.5,
    avatar: "",
    riskFactors: {
      overtime: 20,
      compensation: 30,
      satisfaction: 85,
      growth: 25,
      workLifeBalance: 90,
    },
  },
  {
    id: "EMP004",
    name: "David Kim",
    email: "david.kim@company.com",
    department: "Engineering",
    position: "DevOps Engineer",
    hireDate: "2018-05-10",
    salary: 110000,
    riskScore: 82,
    riskLevel: "high",
    satisfactionScore: 38,
    overtimeHours: 30,
    lastPromotionDate: "2020-09-01",
    performanceRating: 4.0,
    avatar: "",
    riskFactors: {
      overtime: 90,
      compensation: 45,
      satisfaction: 35,
      growth: 75,
      workLifeBalance: 25,
    },
  },
  {
    id: "EMP005",
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    department: "HR",
    position: "HR Specialist",
    hireDate: "2022-02-14",
    salary: 65000,
    riskScore: 35,
    riskLevel: "low",
    satisfactionScore: 75,
    overtimeHours: 8,
    lastPromotionDate: null,
    performanceRating: 3.9,
    avatar: "",
    riskFactors: {
      overtime: 30,
      compensation: 40,
      satisfaction: 75,
      growth: 35,
      workLifeBalance: 80,
    },
  },
  {
    id: "EMP006",
    name: "James Wilson",
    email: "james.wilson@company.com",
    department: "Finance",
    position: "Financial Analyst",
    hireDate: "2020-08-03",
    salary: 78000,
    riskScore: 58,
    riskLevel: "medium",
    satisfactionScore: 55,
    overtimeHours: 15,
    lastPromotionDate: "2022-08-01",
    performanceRating: 3.7,
    avatar: "",
    riskFactors: {
      overtime: 55,
      compensation: 60,
      satisfaction: 55,
      growth: 60,
      workLifeBalance: 55,
    },
  },
  {
    id: "EMP007",
    name: "Amanda Foster",
    email: "amanda.foster@company.com",
    department: "Engineering",
    position: "QA Engineer",
    hireDate: "2019-12-01",
    salary: 82000,
    riskScore: 72,
    riskLevel: "high",
    satisfactionScore: 42,
    overtimeHours: 22,
    lastPromotionDate: "2021-03-15",
    performanceRating: 4.1,
    avatar: "",
    riskFactors: {
      overtime: 75,
      compensation: 70,
      satisfaction: 40,
      growth: 80,
      workLifeBalance: 40,
    },
  },
  {
    id: "EMP008",
    name: "Robert Martinez",
    email: "robert.martinez@company.com",
    department: "Operations",
    position: "Operations Manager",
    hireDate: "2017-04-18",
    salary: 92000,
    riskScore: 28,
    riskLevel: "low",
    satisfactionScore: 88,
    overtimeHours: 6,
    lastPromotionDate: "2023-01-10",
    performanceRating: 4.6,
    avatar: "",
    riskFactors: {
      overtime: 25,
      compensation: 25,
      satisfaction: 90,
      growth: 20,
      workLifeBalance: 85,
    },
  },
];

const defaultInterventions: Intervention[] = [
  {
    id: "INT001",
    employeeId: "EMP001",
    type: "career_development",
    title: "Career Path Discussion",
    description: "Scheduled meeting to discuss career growth opportunities and potential promotion path",
    status: "completed",
    createdAt: "2024-01-15",
    completedAt: "2024-01-20",
    outcome: "Employee expressed interest in team lead position. Created 6-month development plan.",
  },
  {
    id: "INT002",
    employeeId: "EMP004",
    type: "workload_adjustment",
    title: "Overtime Reduction Plan",
    description: "Implementing workload redistribution to reduce excessive overtime hours",
    status: "in_progress",
    createdAt: "2024-02-01",
    completedAt: null,
    outcome: null,
  },
  {
    id: "INT003",
    employeeId: "EMP007",
    type: "training",
    title: "Leadership Training Program",
    description: "Enrolled in company-sponsored leadership development course",
    status: "planned",
    createdAt: "2024-02-10",
    completedAt: null,
    outcome: null,
  },
];

const defaultModelMetrics: ModelMetrics = {
  accuracy: 87.5,
  precision: 84.2,
  recall: 89.1,
  f1Score: 86.6,
  lastUpdated: "2024-02-15",
  version: "2.1.0",
  trainingDataSize: 15420,
  history: [
    { date: "2024-01-01", accuracy: 82.3, precision: 79.5, recall: 85.2, f1Score: 82.2 },
    { date: "2024-01-15", accuracy: 84.1, precision: 81.0, recall: 86.8, f1Score: 83.8 },
    { date: "2024-02-01", accuracy: 86.0, precision: 83.5, recall: 88.2, f1Score: 85.8 },
    { date: "2024-02-15", accuracy: 87.5, precision: 84.2, recall: 89.1, f1Score: 86.6 },
  ],
};

const defaultImports: HRISImport[] = [
  {
    id: "IMP001",
    filename: "employees_q4_2023.csv",
    importedAt: "2024-01-05",
    recordCount: 245,
    status: "success",
  },
  {
    id: "IMP002",
    filename: "performance_reviews_2023.xlsx",
    importedAt: "2024-01-20",
    recordCount: 238,
    status: "success",
  },
];

// Storage keys
const STORAGE_KEYS = {
  employees: "pers_employees",
  interventions: "pers_interventions",
  modelMetrics: "pers_model_metrics",
  imports: "pers_imports",
};

// Helper to check if we're in browser
const isBrowser = typeof window !== "undefined";

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(stored);
}

function saveToStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Employees
export function getEmployees(): Employee[] {
  return getFromStorage(STORAGE_KEYS.employees, defaultEmployees);
}

export function getEmployeeById(id: string): Employee | undefined {
  const employees = getEmployees();
  return employees.find((emp) => emp.id === id);
}

export function saveEmployee(employee: Employee): void {
  const employees = getEmployees();
  const index = employees.findIndex((emp) => emp.id === employee.id);
  if (index >= 0) {
    employees[index] = employee;
  } else {
    employees.push(employee);
  }
  saveToStorage(STORAGE_KEYS.employees, employees);
}

export function addEmployee(employee: Omit<Employee, "id">): Employee {
  const employees = getEmployees();
  const newId = `EMP${String(employees.length + 1).padStart(3, "0")}`;
  const newEmployee = { ...employee, id: newId } as Employee;
  employees.push(newEmployee);
  saveToStorage(STORAGE_KEYS.employees, employees);
  return newEmployee;
}

// Interventions
export function getInterventions(): Intervention[] {
  return getFromStorage(STORAGE_KEYS.interventions, defaultInterventions);
}

export function getInterventionsByEmployeeId(employeeId: string): Intervention[] {
  const interventions = getInterventions();
  return interventions.filter((int) => int.employeeId === employeeId);
}

export function addIntervention(intervention: Omit<Intervention, "id">): Intervention {
  const interventions = getInterventions();
  const newId = `INT${String(interventions.length + 1).padStart(3, "0")}`;
  const newIntervention = { ...intervention, id: newId } as Intervention;
  interventions.push(newIntervention);
  saveToStorage(STORAGE_KEYS.interventions, interventions);
  return newIntervention;
}

export function updateIntervention(intervention: Intervention): void {
  const interventions = getInterventions();
  const index = interventions.findIndex((int) => int.id === intervention.id);
  if (index >= 0) {
    interventions[index] = intervention;
    saveToStorage(STORAGE_KEYS.interventions, interventions);
  }
}

// Model Metrics
export function getModelMetrics(): ModelMetrics {
  return getFromStorage(STORAGE_KEYS.modelMetrics, defaultModelMetrics);
}

export function saveModelMetrics(metrics: ModelMetrics): void {
  saveToStorage(STORAGE_KEYS.modelMetrics, metrics);
}

// HRIS Imports
export function getImports(): HRISImport[] {
  return getFromStorage(STORAGE_KEYS.imports, defaultImports);
}

export function addImport(importData: Omit<HRISImport, "id">): HRISImport {
  const imports = getImports();
  const newId = `IMP${String(imports.length + 1).padStart(3, "0")}`;
  const newImport = { ...importData, id: newId } as HRISImport;
  imports.push(newImport);
  saveToStorage(STORAGE_KEYS.imports, imports);
  return newImport;
}

// Risk distribution stats
export function getRiskDistribution(): { high: number; medium: number; low: number } {
  const employees = getEmployees();
  return {
    high: employees.filter((e) => e.riskLevel === "high").length,
    medium: employees.filter((e) => e.riskLevel === "medium").length,
    low: employees.filter((e) => e.riskLevel === "low").length,
  };
}

// Dashboard stats
export function getDashboardStats() {
  const employees = getEmployees();
  const avgSatisfaction = employees.reduce((acc, e) => acc + e.satisfactionScore, 0) / employees.length;
  const distribution = getRiskDistribution();
  
  return {
    totalEmployees: employees.length,
    highRiskCount: distribution.high,
    avgSatisfaction: Math.round(avgSatisfaction),
    turnoverRate: 12.5, // Mock value
  };
}
