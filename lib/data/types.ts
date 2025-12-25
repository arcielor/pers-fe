export type RiskLevel = "high" | "medium" | "low";

export interface RiskFactors {
    overtime: number;
    compensation: number;
    satisfaction: number;
    growth: number;
    workLifeBalance: number;
}

export type JobLevel = "entry" | "junior" | "mid" | "senior" | "lead" | "manager" | "director" | "executive";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed" | "prefer_not_to_say";

export interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    jobLevel: JobLevel;
    hireDate: string;
    salary: number;
    riskScore: number;
    riskLevel: RiskLevel;
    satisfactionScore: number;
    overtimeHours: number;
    totalWorkingHours: number;
    previousCompanies: number;
    lastPromotionDate: string | null;
    performanceRating: number;
    avatar: string;
    riskFactors: RiskFactors;
    // Demographic fields (optional)
    age?: number;
    gender?: Gender;
    maritalStatus?: MaritalStatus;
    // Resignation tracking
    hasResigned?: boolean;
    resignationId?: string;
}

export type InterventionType = "training" | "workload_adjustment" | "career_development" | "compensation" | "other";
export type InterventionStatus = "planned" | "in_progress" | "completed" | "cancelled";
export type InterventionOutcome = "stayed" | "left" | "pending";

export interface Intervention {
    id: string;
    employeeId: string;
    type: InterventionType;
    title: string;
    description: string;
    status: InterventionStatus;
    createdAt: string;
    completedAt: string | null;
    outcome: string | null;
    interventionOutcome?: InterventionOutcome;
}

export interface MetricHistory {
    date: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
}

export interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    lastUpdated: string;
    version: string;
    trainingDataSize: number;
    history: MetricHistory[];
}

export interface HRISImport {
    id: string;
    filename: string;
    importedAt: string;
    recordCount: number;
    status: "success" | "failed" | "processing";
    dataCategory?: "employee_data" | "performance_review" | "payroll" | "attendance" | "survey" | "other";
    categoryConfidence?: number;
}

// Resignation tracking
export type ResignationReason =
    | "better_opportunity"
    | "compensation"
    | "work_life_balance"
    | "career_growth"
    | "management"
    | "relocation"
    | "personal"
    | "retirement"
    | "health"
    | "other";

export interface ResignationRecord {
    id: string;
    employeeId: string;
    resignationDate: string;
    lastWorkingDate: string;
    reasons: ResignationReason[];
    feedback: string;
    exitInterviewNotes?: string;
    wasHighRisk: boolean;
    hadIntervention: boolean;
}

// Manager assessments for CI integration
export interface ManagerAssessment {
    id: string;
    employeeId: string;
    assessorName: string;
    assessorRole: string;
    date: string;
    overallRating: number; // 1-5
    riskConcerns: string;
    strengths: string;
    areasForImprovement: string;
    retentionRisk: RiskLevel;
    recommendedActions: string;
}

// Recommended intervention based on risk factors
export interface RecommendedIntervention {
    type: InterventionType;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    basedOnFactor: keyof RiskFactors;
}
