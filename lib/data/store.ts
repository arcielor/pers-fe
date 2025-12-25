"use client";

import { Employee, Intervention, ModelMetrics, HRISImport, ResignationRecord, ManagerAssessment, RecommendedIntervention, RiskFactors, InterventionOutcome } from "./types";

// Default mock employees
const defaultEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Engineering",
    position: "Senior Developer",
    jobLevel: "senior",
    hireDate: "2020-03-15",
    salary: 95000,
    riskScore: 78,
    riskLevel: "high",
    satisfactionScore: 45,
    overtimeHours: 25,
    totalWorkingHours: 185,
    previousCompanies: 2,
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
    jobLevel: "manager",
    hireDate: "2019-07-22",
    salary: 85000,
    riskScore: 45,
    riskLevel: "medium",
    satisfactionScore: 68,
    overtimeHours: 10,
    totalWorkingHours: 170,
    previousCompanies: 3,
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
    jobLevel: "junior",
    hireDate: "2021-11-08",
    salary: 72000,
    riskScore: 25,
    riskLevel: "low",
    satisfactionScore: 82,
    overtimeHours: 5,
    totalWorkingHours: 165,
    previousCompanies: 1,
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
    jobLevel: "senior",
    hireDate: "2018-05-10",
    salary: 110000,
    riskScore: 82,
    riskLevel: "high",
    satisfactionScore: 38,
    overtimeHours: 30,
    totalWorkingHours: 200,
    previousCompanies: 4,
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
    jobLevel: "mid",
    hireDate: "2022-02-14",
    salary: 65000,
    riskScore: 35,
    riskLevel: "low",
    satisfactionScore: 75,
    overtimeHours: 8,
    totalWorkingHours: 168,
    previousCompanies: 1,
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
    jobLevel: "mid",
    hireDate: "2020-08-03",
    salary: 78000,
    riskScore: 58,
    riskLevel: "medium",
    satisfactionScore: 55,
    overtimeHours: 15,
    totalWorkingHours: 175,
    previousCompanies: 2,
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
    jobLevel: "mid",
    hireDate: "2019-12-01",
    salary: 82000,
    riskScore: 72,
    riskLevel: "high",
    satisfactionScore: 42,
    overtimeHours: 22,
    totalWorkingHours: 182,
    previousCompanies: 3,
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
    jobLevel: "manager",
    hireDate: "2017-04-18",
    salary: 92000,
    riskScore: 28,
    riskLevel: "low",
    satisfactionScore: 88,
    overtimeHours: 6,
    totalWorkingHours: 166,
    previousCompanies: 2,
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
  {
    id: "EMP009",
    name: "Jennifer Lee",
    email: "jennifer.lee@company.com",
    department: "Engineering",
    position: "Frontend Developer",
    jobLevel: "mid",
    hireDate: "2021-03-22",
    salary: 88000,
    riskScore: 42,
    riskLevel: "medium",
    satisfactionScore: 62,
    overtimeHours: 12,
    totalWorkingHours: 172,
    previousCompanies: 2,
    lastPromotionDate: "2023-06-01",
    performanceRating: 4.0,
    avatar: "",
    riskFactors: {
      overtime: 45,
      compensation: 50,
      satisfaction: 60,
      growth: 40,
      workLifeBalance: 65,
    },
  },
  {
    id: "EMP010",
    name: "Christopher Brown",
    email: "christopher.brown@company.com",
    department: "Sales",
    position: "Sales Manager",
    jobLevel: "manager",
    hireDate: "2018-09-15",
    salary: 98000,
    riskScore: 55,
    riskLevel: "medium",
    satisfactionScore: 58,
    overtimeHours: 18,
    totalWorkingHours: 178,
    previousCompanies: 3,
    lastPromotionDate: "2021-12-01",
    performanceRating: 3.9,
    avatar: "",
    riskFactors: {
      overtime: 60,
      compensation: 55,
      satisfaction: 55,
      growth: 50,
      workLifeBalance: 50,
    },
  },
  {
    id: "EMP011",
    name: "Patricia Garcia",
    email: "patricia.garcia@company.com",
    department: "HR",
    position: "HR Manager",
    jobLevel: "manager",
    hireDate: "2019-01-10",
    salary: 82000,
    riskScore: 22,
    riskLevel: "low",
    satisfactionScore: 85,
    overtimeHours: 4,
    totalWorkingHours: 164,
    previousCompanies: 2,
    lastPromotionDate: "2022-04-15",
    performanceRating: 4.4,
    avatar: "",
    riskFactors: {
      overtime: 15,
      compensation: 30,
      satisfaction: 88,
      growth: 20,
      workLifeBalance: 92,
    },
  },
  {
    id: "EMP012",
    name: "Daniel Taylor",
    email: "daniel.taylor@company.com",
    department: "Engineering",
    position: "Backend Developer",
    jobLevel: "senior",
    hireDate: "2017-06-20",
    salary: 105000,
    riskScore: 68,
    riskLevel: "high",
    satisfactionScore: 48,
    overtimeHours: 20,
    totalWorkingHours: 180,
    previousCompanies: 3,
    lastPromotionDate: "2020-03-01",
    performanceRating: 4.3,
    avatar: "",
    riskFactors: {
      overtime: 70,
      compensation: 60,
      satisfaction: 45,
      growth: 72,
      workLifeBalance: 38,
    },
  },
  {
    id: "EMP013",
    name: "Nancy White",
    email: "nancy.white@company.com",
    department: "Finance",
    position: "Senior Accountant",
    jobLevel: "senior",
    hireDate: "2016-11-05",
    salary: 88000,
    riskScore: 32,
    riskLevel: "low",
    satisfactionScore: 78,
    overtimeHours: 8,
    totalWorkingHours: 168,
    previousCompanies: 2,
    lastPromotionDate: "2023-02-01",
    performanceRating: 4.2,
    avatar: "",
    riskFactors: {
      overtime: 30,
      compensation: 35,
      satisfaction: 80,
      growth: 28,
      workLifeBalance: 82,
    },
  },
  {
    id: "EMP014",
    name: "Kevin Anderson",
    email: "kevin.anderson@company.com",
    department: "Marketing",
    position: "Digital Marketing Specialist",
    jobLevel: "mid",
    hireDate: "2020-05-18",
    salary: 72000,
    riskScore: 48,
    riskLevel: "medium",
    satisfactionScore: 60,
    overtimeHours: 14,
    totalWorkingHours: 174,
    previousCompanies: 2,
    lastPromotionDate: "2022-09-01",
    performanceRating: 3.8,
    avatar: "",
    riskFactors: {
      overtime: 50,
      compensation: 55,
      satisfaction: 58,
      growth: 52,
      workLifeBalance: 55,
    },
  },
  {
    id: "EMP015",
    name: "Michelle Thomas",
    email: "michelle.thomas@company.com",
    department: "Operations",
    position: "Supply Chain Analyst",
    jobLevel: "mid",
    hireDate: "2021-08-12",
    salary: 68000,
    riskScore: 38,
    riskLevel: "low",
    satisfactionScore: 72,
    overtimeHours: 6,
    totalWorkingHours: 166,
    previousCompanies: 1,
    lastPromotionDate: null,
    performanceRating: 4.0,
    avatar: "",
    riskFactors: {
      overtime: 25,
      compensation: 42,
      satisfaction: 72,
      growth: 38,
      workLifeBalance: 78,
    },
  },
  {
    id: "EMP016",
    name: "Steven Harris",
    email: "steven.harris@company.com",
    department: "Engineering",
    position: "Cloud Architect",
    jobLevel: "lead",
    hireDate: "2016-02-28",
    salary: 135000,
    riskScore: 75,
    riskLevel: "high",
    satisfactionScore: 42,
    overtimeHours: 28,
    totalWorkingHours: 188,
    previousCompanies: 4,
    lastPromotionDate: "2019-08-01",
    performanceRating: 4.5,
    avatar: "",
    riskFactors: {
      overtime: 82,
      compensation: 48,
      satisfaction: 40,
      growth: 78,
      workLifeBalance: 30,
    },
  },
  {
    id: "EMP017",
    name: "Elizabeth Clark",
    email: "elizabeth.clark@company.com",
    department: "Legal",
    position: "Corporate Counsel",
    jobLevel: "senior",
    hireDate: "2018-04-10",
    salary: 125000,
    riskScore: 30,
    riskLevel: "low",
    satisfactionScore: 80,
    overtimeHours: 10,
    totalWorkingHours: 170,
    previousCompanies: 2,
    lastPromotionDate: "2022-01-15",
    performanceRating: 4.6,
    avatar: "",
    riskFactors: {
      overtime: 35,
      compensation: 25,
      satisfaction: 82,
      growth: 28,
      workLifeBalance: 75,
    },
  },
  {
    id: "EMP018",
    name: "Brian Lewis",
    email: "brian.lewis@company.com",
    department: "Sales",
    position: "Account Executive",
    jobLevel: "mid",
    hireDate: "2020-10-01",
    salary: 75000,
    riskScore: 52,
    riskLevel: "medium",
    satisfactionScore: 58,
    overtimeHours: 16,
    totalWorkingHours: 176,
    previousCompanies: 2,
    lastPromotionDate: "2023-04-01",
    performanceRating: 3.7,
    avatar: "",
    riskFactors: {
      overtime: 55,
      compensation: 58,
      satisfaction: 55,
      growth: 48,
      workLifeBalance: 52,
    },
  },
  {
    id: "EMP019",
    name: "Rachel Robinson",
    email: "rachel.robinson@company.com",
    department: "Marketing",
    position: "Content Strategist",
    jobLevel: "mid",
    hireDate: "2021-02-15",
    salary: 70000,
    riskScore: 28,
    riskLevel: "low",
    satisfactionScore: 82,
    overtimeHours: 5,
    totalWorkingHours: 165,
    previousCompanies: 1,
    lastPromotionDate: "2023-08-01",
    performanceRating: 4.3,
    avatar: "",
    riskFactors: {
      overtime: 20,
      compensation: 35,
      satisfaction: 85,
      growth: 25,
      workLifeBalance: 88,
    },
  },
  {
    id: "EMP020",
    name: "William Walker",
    email: "william.walker@company.com",
    department: "Engineering",
    position: "Security Engineer",
    jobLevel: "senior",
    hireDate: "2019-05-20",
    salary: 115000,
    riskScore: 62,
    riskLevel: "medium",
    satisfactionScore: 52,
    overtimeHours: 18,
    totalWorkingHours: 178,
    previousCompanies: 3,
    lastPromotionDate: "2021-11-01",
    performanceRating: 4.1,
    avatar: "",
    riskFactors: {
      overtime: 62,
      compensation: 55,
      satisfaction: 50,
      growth: 65,
      workLifeBalance: 45,
    },
  },
  {
    id: "EMP021",
    name: "Jessica Hall",
    email: "jessica.hall@company.com",
    department: "Finance",
    position: "Finance Manager",
    jobLevel: "manager",
    hireDate: "2017-08-14",
    salary: 95000,
    riskScore: 40,
    riskLevel: "medium",
    satisfactionScore: 68,
    overtimeHours: 12,
    totalWorkingHours: 172,
    previousCompanies: 2,
    lastPromotionDate: "2022-06-01",
    performanceRating: 4.2,
    avatar: "",
    riskFactors: {
      overtime: 42,
      compensation: 45,
      satisfaction: 68,
      growth: 38,
      workLifeBalance: 65,
    },
  },
  {
    id: "EMP022",
    name: "Thomas Young",
    email: "thomas.young@company.com",
    department: "Engineering",
    position: "Mobile Developer",
    jobLevel: "mid",
    hireDate: "2020-12-01",
    salary: 90000,
    riskScore: 70,
    riskLevel: "high",
    satisfactionScore: 45,
    overtimeHours: 24,
    totalWorkingHours: 184,
    previousCompanies: 2,
    lastPromotionDate: null,
    performanceRating: 4.0,
    avatar: "",
    riskFactors: {
      overtime: 78,
      compensation: 62,
      satisfaction: 42,
      growth: 75,
      workLifeBalance: 35,
    },
  },
  {
    id: "EMP023",
    name: "Sandra King",
    email: "sandra.king@company.com",
    department: "HR",
    position: "Talent Acquisition Lead",
    jobLevel: "lead",
    hireDate: "2018-03-22",
    salary: 78000,
    riskScore: 35,
    riskLevel: "low",
    satisfactionScore: 75,
    overtimeHours: 8,
    totalWorkingHours: 168,
    previousCompanies: 2,
    lastPromotionDate: "2022-10-01",
    performanceRating: 4.1,
    avatar: "",
    riskFactors: {
      overtime: 30,
      compensation: 40,
      satisfaction: 75,
      growth: 32,
      workLifeBalance: 78,
    },
  },
  {
    id: "EMP024",
    name: "Mark Wright",
    email: "mark.wright@company.com",
    department: "Operations",
    position: "Logistics Coordinator",
    jobLevel: "junior",
    hireDate: "2022-06-10",
    salary: 55000,
    riskScore: 48,
    riskLevel: "medium",
    satisfactionScore: 60,
    overtimeHours: 14,
    totalWorkingHours: 174,
    previousCompanies: 1,
    lastPromotionDate: null,
    performanceRating: 3.6,
    avatar: "",
    riskFactors: {
      overtime: 50,
      compensation: 58,
      satisfaction: 58,
      growth: 45,
      workLifeBalance: 55,
    },
  },
  {
    id: "EMP025",
    name: "Ashley Scott",
    email: "ashley.scott@company.com",
    department: "Marketing",
    position: "Brand Manager",
    jobLevel: "manager",
    hireDate: "2019-09-05",
    salary: 88000,
    riskScore: 25,
    riskLevel: "low",
    satisfactionScore: 85,
    overtimeHours: 6,
    totalWorkingHours: 166,
    previousCompanies: 2,
    lastPromotionDate: "2023-03-01",
    performanceRating: 4.4,
    avatar: "",
    riskFactors: {
      overtime: 22,
      compensation: 28,
      satisfaction: 88,
      growth: 22,
      workLifeBalance: 85,
    },
  },
  {
    id: "EMP026",
    name: "Andrew Green",
    email: "andrew.green@company.com",
    department: "Engineering",
    position: "Data Engineer",
    jobLevel: "senior",
    hireDate: "2018-11-18",
    salary: 108000,
    riskScore: 58,
    riskLevel: "medium",
    satisfactionScore: 55,
    overtimeHours: 16,
    totalWorkingHours: 176,
    previousCompanies: 3,
    lastPromotionDate: "2021-07-01",
    performanceRating: 4.0,
    avatar: "",
    riskFactors: {
      overtime: 58,
      compensation: 52,
      satisfaction: 55,
      growth: 62,
      workLifeBalance: 48,
    },
  },
  {
    id: "EMP027",
    name: "Kimberly Adams",
    email: "kimberly.adams@company.com",
    department: "Sales",
    position: "Business Development Rep",
    jobLevel: "entry",
    hireDate: "2023-01-15",
    salary: 52000,
    riskScore: 20,
    riskLevel: "low",
    satisfactionScore: 88,
    overtimeHours: 3,
    totalWorkingHours: 163,
    previousCompanies: 0,
    lastPromotionDate: null,
    performanceRating: 3.8,
    avatar: "",
    riskFactors: {
      overtime: 12,
      compensation: 25,
      satisfaction: 90,
      growth: 18,
      workLifeBalance: 92,
    },
  },
  {
    id: "EMP028",
    name: "Jason Nelson",
    email: "jason.nelson@company.com",
    department: "Engineering",
    position: "Site Reliability Engineer",
    jobLevel: "senior",
    hireDate: "2017-10-25",
    salary: 118000,
    riskScore: 80,
    riskLevel: "high",
    satisfactionScore: 40,
    overtimeHours: 26,
    totalWorkingHours: 186,
    previousCompanies: 4,
    lastPromotionDate: "2020-05-01",
    performanceRating: 4.2,
    avatar: "",
    riskFactors: {
      overtime: 85,
      compensation: 52,
      satisfaction: 38,
      growth: 80,
      workLifeBalance: 28,
    },
  },
  {
    id: "EMP029",
    name: "Stephanie Carter",
    email: "stephanie.carter@company.com",
    department: "Finance",
    position: "Budget Analyst",
    jobLevel: "mid",
    hireDate: "2021-04-05",
    salary: 72000,
    riskScore: 42,
    riskLevel: "medium",
    satisfactionScore: 65,
    overtimeHours: 10,
    totalWorkingHours: 170,
    previousCompanies: 1,
    lastPromotionDate: "2023-10-01",
    performanceRating: 3.9,
    avatar: "",
    riskFactors: {
      overtime: 40,
      compensation: 48,
      satisfaction: 65,
      growth: 42,
      workLifeBalance: 68,
    },
  },
  {
    id: "EMP030",
    name: "Ryan Mitchell",
    email: "ryan.mitchell@company.com",
    department: "Operations",
    position: "Quality Assurance Lead",
    jobLevel: "lead",
    hireDate: "2019-07-12",
    salary: 85000,
    riskScore: 45,
    riskLevel: "medium",
    satisfactionScore: 62,
    overtimeHours: 12,
    totalWorkingHours: 172,
    previousCompanies: 2,
    lastPromotionDate: "2022-03-01",
    performanceRating: 4.0,
    avatar: "",
    riskFactors: {
      overtime: 45,
      compensation: 48,
      satisfaction: 62,
      growth: 45,
      workLifeBalance: 60,
    },
  },
  {
    id: "EMP031",
    name: "Nicole Perez",
    email: "nicole.perez@company.com",
    department: "Legal",
    position: "Paralegal",
    jobLevel: "junior",
    hireDate: "2022-03-28",
    salary: 58000,
    riskScore: 30,
    riskLevel: "low",
    satisfactionScore: 78,
    overtimeHours: 6,
    totalWorkingHours: 166,
    previousCompanies: 1,
    lastPromotionDate: null,
    performanceRating: 4.1,
    avatar: "",
    riskFactors: {
      overtime: 25,
      compensation: 35,
      satisfaction: 80,
      growth: 28,
      workLifeBalance: 82,
    },
  },
  {
    id: "EMP032",
    name: "Justin Roberts",
    email: "justin.roberts@company.com",
    department: "Engineering",
    position: "Machine Learning Engineer",
    jobLevel: "senior",
    hireDate: "2019-02-14",
    salary: 125000,
    riskScore: 65,
    riskLevel: "high",
    satisfactionScore: 50,
    overtimeHours: 20,
    totalWorkingHours: 180,
    previousCompanies: 2,
    lastPromotionDate: "2021-09-01",
    performanceRating: 4.4,
    avatar: "",
    riskFactors: {
      overtime: 68,
      compensation: 55,
      satisfaction: 48,
      growth: 70,
      workLifeBalance: 40,
    },
  },
  {
    id: "EMP033",
    name: "Megan Turner",
    email: "megan.turner@company.com",
    department: "Marketing",
    position: "Social Media Manager",
    jobLevel: "mid",
    hireDate: "2020-08-20",
    salary: 68000,
    riskScore: 35,
    riskLevel: "low",
    satisfactionScore: 75,
    overtimeHours: 8,
    totalWorkingHours: 168,
    previousCompanies: 1,
    lastPromotionDate: "2023-05-01",
    performanceRating: 4.2,
    avatar: "",
    riskFactors: {
      overtime: 32,
      compensation: 38,
      satisfaction: 78,
      growth: 30,
      workLifeBalance: 80,
    },
  },
];

// Import generated Malaysian employees
import { generatedMalaysianEmployees } from "./generatedEmployees";

// Combine default and Malaysian employees
const allDefaultEmployees = [...defaultEmployees, ...generatedMalaysianEmployees];

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
  rocAuc: 91.2,
  lastUpdated: "2024-02-15",
  version: "2.1.0",
  trainingDataSize: 15420,
  history: [
    { date: "2024-01-01", accuracy: 82.3, precision: 79.5, recall: 85.2, f1Score: 82.2, rocAuc: 86.5 },
    { date: "2024-01-15", accuracy: 84.1, precision: 81.0, recall: 86.8, f1Score: 83.8, rocAuc: 88.2 },
    { date: "2024-02-01", accuracy: 86.0, precision: 83.5, recall: 88.2, f1Score: 85.8, rocAuc: 89.8 },
    { date: "2024-02-15", accuracy: 87.5, precision: 84.2, recall: 89.1, f1Score: 86.6, rocAuc: 91.2 },
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

// Data version - increment this to force localStorage reset when defaults change
const DATA_VERSION = "3.1";
const DATA_VERSION_KEY = "pers_data_version";

// Storage keys
const STORAGE_KEYS = {
  employees: "pers_employees",
  interventions: "pers_interventions",
  modelMetrics: "pers_model_metrics",
  imports: "pers_imports",
  resignations: "pers_resignations",
  managerAssessments: "pers_manager_assessments",
};

// Helper to check if we're in browser
const isBrowser = typeof window !== "undefined";

// Initialize data version check - reset all data if version changed
function checkAndResetDataVersion(): void {
  if (!isBrowser) return;
  const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
  if (storedVersion !== DATA_VERSION) {
    // Clear all PERS data to force reload of defaults
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
  }
}

// Run version check on module load
if (isBrowser) {
  checkAndResetDataVersion();
}

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
  return getFromStorage(STORAGE_KEYS.employees, allDefaultEmployees);
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

export function updateEmployee(employee: Employee): void {
  const employees = getEmployees();
  const index = employees.findIndex((emp) => emp.id === employee.id);
  if (index >= 0) {
    employees[index] = employee;
    saveToStorage(STORAGE_KEYS.employees, employees);
  }
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

export function deleteImport(importId: string): boolean {
  const imports = getImports();
  const index = imports.findIndex((imp) => imp.id === importId);
  if (index >= 0) {
    imports.splice(index, 1);
    saveToStorage(STORAGE_KEYS.imports, imports);
    return true;
  }
  return false;
}

export function updateImportCategory(
  importId: string,
  category: HRISImport["dataCategory"],
  confidence?: number
): boolean {
  const imports = getImports();
  const index = imports.findIndex((imp) => imp.id === importId);
  if (index >= 0) {
    imports[index].dataCategory = category;
    imports[index].categoryConfidence = confidence ?? 100;
    saveToStorage(STORAGE_KEYS.imports, imports);
    return true;
  }
  return false;
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

// Get top contributing factors across all employees (count of employees with high risk for each factor)
export function getTopContributingFactors(): { name: string; value: number; label: string; total: number }[] {
  const employees = getEmployees();
  if (employees.length === 0) return [];

  const factorLabels: Record<string, string> = {
    overtime: "Overtime Hours",
    compensation: "Compensation",
    satisfaction: "Job Satisfaction",
    growth: "Career Growth",
    workLifeBalance: "Work-Life Balance",
  };

  // Count employees with concerning levels (score >= 50) for each factor
  const factorCounts = {
    overtime: 0,
    compensation: 0,
    satisfaction: 0,
    growth: 0,
    workLifeBalance: 0,
  };

  employees.forEach((emp) => {
    if (emp.riskFactors.overtime >= 50) factorCounts.overtime++;
    if (emp.riskFactors.compensation >= 50) factorCounts.compensation++;
    if (emp.riskFactors.satisfaction >= 50) factorCounts.satisfaction++;
    if (emp.riskFactors.growth >= 50) factorCounts.growth++;
    if (emp.riskFactors.workLifeBalance >= 50) factorCounts.workLifeBalance++;
  });

  const factors = Object.entries(factorCounts).map(([key, count]) => ({
    name: key,
    value: count,
    label: factorLabels[key],
    total: employees.length,
  }));

  // Sort by value descending and return top 5
  return factors.sort((a, b) => b.value - a.value).slice(0, 5);
}

// Get top 5 employees with highest attrition risk
export function getTopRiskEmployees(count: number = 5): Employee[] {
  const employees = getEmployees();
  return employees
    .filter(e => !e.hasResigned) // Exclude resigned employees
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, count);
}

// ============ RESIGNATION TRACKING ============

const defaultResignations: ResignationRecord[] = [];

export function getResignations(): ResignationRecord[] {
  return getFromStorage(STORAGE_KEYS.resignations, defaultResignations);
}

export function getResignationByEmployee(employeeId: string): ResignationRecord | undefined {
  const resignations = getResignations();
  return resignations.find(r => r.employeeId === employeeId);
}

export function addResignation(resignation: Omit<ResignationRecord, "id">): ResignationRecord {
  const resignations = getResignations();
  const newId = `RES${String(resignations.length + 1).padStart(3, "0")}`;
  const newResignation = { ...resignation, id: newId } as ResignationRecord;
  resignations.push(newResignation);
  saveToStorage(STORAGE_KEYS.resignations, resignations);

  // Update employee record
  const employee = getEmployeeById(resignation.employeeId);
  if (employee) {
    updateEmployee({
      ...employee,
      hasResigned: true,
      resignationId: newId,
    });
  }

  return newResignation;
}

// ============ MANAGER ASSESSMENTS ============

const defaultManagerAssessments: ManagerAssessment[] = [];

export function getManagerAssessments(): ManagerAssessment[] {
  return getFromStorage(STORAGE_KEYS.managerAssessments, defaultManagerAssessments);
}

export function getAssessmentsByEmployee(employeeId: string): ManagerAssessment[] {
  const assessments = getManagerAssessments();
  return assessments
    .filter(a => a.employeeId === employeeId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function addManagerAssessment(assessment: Omit<ManagerAssessment, "id">): ManagerAssessment {
  const assessments = getManagerAssessments();
  const newId = `ASS${String(assessments.length + 1).padStart(3, "0")}`;
  const newAssessment = { ...assessment, id: newId } as ManagerAssessment;
  assessments.push(newAssessment);
  saveToStorage(STORAGE_KEYS.managerAssessments, assessments);
  return newAssessment;
}

// ============ INTERVENTION OUTCOMES ============

export function updateInterventionOutcome(interventionId: string, outcome: InterventionOutcome): void {
  const interventions = getInterventions();
  const index = interventions.findIndex(int => int.id === interventionId);
  if (index >= 0) {
    interventions[index].interventionOutcome = outcome;
    saveToStorage(STORAGE_KEYS.interventions, interventions);
  }
}

export function getInterventionOutcomeStats(): {
  total: number;
  stayed: number;
  left: number;
  pending: number;
  successRate: number;
} {
  const interventions = getInterventions();
  const completed = interventions.filter(i => i.status === "completed");
  const stayed = completed.filter(i => i.interventionOutcome === "stayed").length;
  const left = completed.filter(i => i.interventionOutcome === "left").length;
  const pending = completed.filter(i => !i.interventionOutcome || i.interventionOutcome === "pending").length;

  const decided = stayed + left;
  const successRate = decided > 0 ? Math.round((stayed / decided) * 100) : 0;

  return {
    total: completed.length,
    stayed,
    left,
    pending,
    successRate,
  };
}

// ============ RECOMMENDED INTERVENTIONS ============

export function getRecommendedInterventions(employee: Employee): RecommendedIntervention[] {
  const recommendations: RecommendedIntervention[] = [];
  const { riskFactors } = employee;

  // Overtime-based recommendation
  if (riskFactors.overtime >= 70) {
    recommendations.push({
      type: "workload_adjustment",
      title: "Workload Redistribution",
      description: "Implement workload balancing to reduce excessive overtime hours. Consider hiring additional team members or redistributing tasks.",
      priority: "high",
      basedOnFactor: "overtime",
    });
  } else if (riskFactors.overtime >= 50) {
    recommendations.push({
      type: "workload_adjustment",
      title: "Overtime Monitoring",
      description: "Set up overtime tracking and establish limits. Review project timelines and resource allocation.",
      priority: "medium",
      basedOnFactor: "overtime",
    });
  }

  // Compensation-based recommendation
  if (riskFactors.compensation >= 70) {
    recommendations.push({
      type: "compensation",
      title: "Compensation Review",
      description: "Conduct a market salary analysis and consider immediate compensation adjustment to match industry standards.",
      priority: "high",
      basedOnFactor: "compensation",
    });
  } else if (riskFactors.compensation >= 50) {
    recommendations.push({
      type: "compensation",
      title: "Benefits Enhancement",
      description: "Review total compensation package including bonuses, benefits, and non-monetary perks.",
      priority: "medium",
      basedOnFactor: "compensation",
    });
  }

  // Satisfaction-based recommendation
  if (riskFactors.satisfaction >= 70) {
    recommendations.push({
      type: "other",
      title: "Employee Engagement Initiative",
      description: "Schedule one-on-one meetings to understand concerns. Consider role adjustments or team transfers based on feedback.",
      priority: "high",
      basedOnFactor: "satisfaction",
    });
  } else if (riskFactors.satisfaction >= 50) {
    recommendations.push({
      type: "other",
      title: "Satisfaction Survey Follow-up",
      description: "Conduct personal check-in to discuss job satisfaction factors and identify improvement areas.",
      priority: "medium",
      basedOnFactor: "satisfaction",
    });
  }

  // Growth-based recommendation
  if (riskFactors.growth >= 70) {
    recommendations.push({
      type: "career_development",
      title: "Career Path Planning",
      description: "Develop a clear career progression plan with timeline. Consider promotion opportunities or lateral moves for skill expansion.",
      priority: "high",
      basedOnFactor: "growth",
    });
  } else if (riskFactors.growth >= 50) {
    recommendations.push({
      type: "training",
      title: "Skills Development Program",
      description: "Enroll in relevant training programs or certifications. Assign stretch projects for career growth.",
      priority: "medium",
      basedOnFactor: "growth",
    });
  }

  // Work-life balance recommendation
  if (riskFactors.workLifeBalance >= 70) {
    recommendations.push({
      type: "workload_adjustment",
      title: "Flexible Work Arrangement",
      description: "Implement remote work options or flexible hours. Review workload and deadlines to improve work-life balance.",
      priority: "high",
      basedOnFactor: "workLifeBalance",
    });
  } else if (riskFactors.workLifeBalance >= 50) {
    recommendations.push({
      type: "other",
      title: "Work-Life Balance Assessment",
      description: "Review current work patterns and identify areas for improvement. Consider wellness programs.",
      priority: "medium",
      basedOnFactor: "workLifeBalance",
    });
  }

  // Sort by priority (high first)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// Get all high-risk employees with their recommendations
export function getHighRiskEmployeesWithRecommendations(): Array<{
  employee: Employee;
  recommendations: RecommendedIntervention[];
}> {
  const employees = getEmployees();
  const highRiskEmployees = employees
    .filter(e => e.riskLevel === "high" && !e.hasResigned)
    .sort((a, b) => b.riskScore - a.riskScore);

  return highRiskEmployees.map(employee => ({
    employee,
    recommendations: getRecommendedInterventions(employee),
  }));
}
