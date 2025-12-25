export type RiskLevel = "high" | "medium" | "low";

export interface RiskFactors {
    overtime: number;
    compensation: number;
    satisfaction: number;
    growth: number;
    workLifeBalance: number;
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    hireDate: string;
    salary: number;
    riskScore: number;
    riskLevel: RiskLevel;
    satisfactionScore: number;
    overtimeHours: number;
    lastPromotionDate: string | null;
    performanceRating: number;
    avatar: string;
    riskFactors: RiskFactors;
}

export type InterventionType = "training" | "workload_adjustment" | "career_development" | "compensation" | "other";
export type InterventionStatus = "planned" | "in_progress" | "completed" | "cancelled";

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
}

export interface MetricHistory {
    date: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
}

export interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
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
}
