/**
 * Naive Bayes Document Classifier
 * 
 * Implements a simple Naive Bayes classifier for categorizing uploaded documents
 * based on filename patterns and keywords. This is a common Collective Intelligence
 * algorithm for text/document classification.
 */

export type DocumentCategory =
    | "employee_data"
    | "performance_review"
    | "payroll"
    | "attendance"
    | "survey"
    | "other";

export interface ClassificationResult {
    category: DocumentCategory;
    confidence: number;
    probabilities: Record<DocumentCategory, number>;
}

// Training data: keyword patterns associated with each category
const TRAINING_DATA: Record<DocumentCategory, string[]> = {
    employee_data: [
        "employee", "employees", "staff", "personnel", "workforce", "worker", "workers",
        "hire", "hiring", "onboarding", "headcount", "roster", "directory", "contact",
        "department", "position", "role", "job", "title", "salary", "compensation",
       "hr", "hris", "attrition", "turnover", "retention"
    ],
    performance_review: [
        "performance", "review", "evaluation", "assessment", "appraisal", "rating",
        "feedback", "goals", "objectives", "kpi", "metrics", "achievement", "competency",
        "360", "annual", "quarterly", "score", "grade"
    ],
    payroll: [
        "payroll", "salary", "wages", "wage", "pay", "compensation", "earnings",
        "deductions", "tax", "taxes", "bonus", "bonuses", "overtime", "ot",
        "timesheet", "hours", "payment", "income", "net", "gross"
    ],
    attendance: [
        "attendance", "leave", "leaves", "absent", "absence", "vacation", "holiday",
        "sick", "pto", "time-off", "timeoff", "clock", "checkin", "checkout",
        "present", "late", "tardy", "shift", "schedule"
    ],
    survey: [
        "survey", "feedback", "satisfaction", "engagement", "pulse", "questionnaire",
        "response", "responses", "opinion", "sentiment", "nps", "score", "rating",
        "culture", "climate", "wellness", "happiness"
    ],
    other: []
};

// Category display names
export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
    employee_data: "Employee Data",
    performance_review: "Performance Review",
    payroll: "Payroll",
    attendance: "Attendance",
    survey: "Survey",
    other: "Other"
};

// Category colors for badges
export const CATEGORY_COLORS: Record<DocumentCategory, string> = {
    employee_data: "bg-blue-500",
    performance_review: "bg-purple-500",
    payroll: "bg-green-500",
    attendance: "bg-amber-500",
    survey: "bg-pink-500",
    other: "bg-gray-500"
};

/**
 * Naive Bayes Classifier Class
 * 
 * Uses Bayes' theorem: P(category|features) ∝ P(category) × ∏P(feature|category)
 */
class NaiveBayesClassifier {
    private categoryPriors: Record<DocumentCategory, number>;
    private wordLikelihoods: Record<DocumentCategory, Record<string, number>>;
    private vocabulary: Set<string>;
    private smoothingFactor: number = 1; // Laplace smoothing
    private temperature: number = 0.5; // Lower = sharper confidence (more decisive)


    constructor() {
        this.categoryPriors = {} as Record<DocumentCategory, number>;
        this.wordLikelihoods = {} as Record<DocumentCategory, Record<string, number>>;
        this.vocabulary = new Set();
        this.train();
    }

    /**
     * Train the classifier using the predefined training data
     */
    private train(): void {
        const categories = Object.keys(TRAINING_DATA) as DocumentCategory[];
        const totalDocuments = categories.length;

        // Calculate prior probabilities (uniform for simplicity)
        categories.forEach(category => {
            this.categoryPriors[category] = 1 / totalDocuments;
            this.wordLikelihoods[category] = {};
        });

        // Build vocabulary and calculate word likelihoods
        categories.forEach(category => {
            const words = TRAINING_DATA[category];
            words.forEach(word => {
                this.vocabulary.add(word.toLowerCase());
                const normalizedWord = word.toLowerCase();
                this.wordLikelihoods[category][normalizedWord] =
                    (this.wordLikelihoods[category][normalizedWord] || 0) + 1;
            });
        });

        // Normalize likelihoods with Laplace smoothing
        const vocabSize = this.vocabulary.size;
        categories.forEach(category => {
            const totalWords = TRAINING_DATA[category].length;
            Object.keys(this.wordLikelihoods[category]).forEach(word => {
                this.wordLikelihoods[category][word] =
                    (this.wordLikelihoods[category][word] + this.smoothingFactor) /
                    (totalWords + this.smoothingFactor * vocabSize);
            });
        });
    }

    /**
     * Extract features from a filename
     */
    private extractFeatures(filename: string): string[] {
        // Remove file extension and split by common separators
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
        const words = nameWithoutExt
            .toLowerCase()
            .split(/[-_\s.]+/)
            .filter(word => word.length > 1);

        return words;
    }

    /**
     * Calculate the probability of a category given the features
     */
    private calculateCategoryProbability(
        features: string[],
        category: DocumentCategory
    ): number {
        let logProbability = Math.log(this.categoryPriors[category]);
        const vocabSize = this.vocabulary.size;
        const totalWords = TRAINING_DATA[category].length;

        features.forEach(feature => {
            const likelihood = this.wordLikelihoods[category][feature] ||
                (this.smoothingFactor / (totalWords + this.smoothingFactor * vocabSize));
            logProbability += Math.log(likelihood);
        });

        return logProbability;
    }

    /**
     * Classify a document based on its filename
     */
    classify(filename: string): ClassificationResult {
        const features = this.extractFeatures(filename);
        const categories = Object.keys(TRAINING_DATA) as DocumentCategory[];

        const logProbabilities: Record<DocumentCategory, number> = {} as Record<DocumentCategory, number>;

        // Calculate log probabilities for each category
        categories.forEach(category => {
            logProbabilities[category] = this.calculateCategoryProbability(features, category);
        });

        // Convert log probabilities to probabilities using softmax
        const maxLogProb = Math.max(...Object.values(logProbabilities));
        const expProbs: Record<DocumentCategory, number> = {} as Record<DocumentCategory, number>;
        let sumExpProbs = 0;

        categories.forEach(category => {
              // Divide by temperature: lower temp = sharper distribution
            expProbs[category] = Math.exp((logProbabilities[category] - maxLogProb) / this.temperature);
            sumExpProbs += expProbs[category];
        });

        const probabilities: Record<DocumentCategory, number> = {} as Record<DocumentCategory, number>;
        categories.forEach(category => {
            probabilities[category] = expProbs[category] / sumExpProbs;
        });

        // Find the category with highest probability
        let bestCategory: DocumentCategory = "other";
        let bestProbability = 0;

        categories.forEach(category => {
            if (probabilities[category] > bestProbability) {
                bestProbability = probabilities[category];
                bestCategory = category;
            }
        });

        // If best probability is too low or features are empty, classify as "other"
        if (features.length === 0 || bestProbability < 0.2) {
            bestCategory = "other";
            bestProbability = 0.25;
            categories.forEach(cat => {
                probabilities[cat] = cat === "other" ? 0.25 : 0;
            });
        }

        return {
            category: bestCategory,
            confidence: Math.round(bestProbability * 100),
            probabilities
        };
    }
}

// Singleton instance
let classifierInstance: NaiveBayesClassifier | null = null;

/**
 * Get the classifier instance (lazy initialization)
 */
export function getClassifier(): NaiveBayesClassifier {
    if (!classifierInstance) {
        classifierInstance = new NaiveBayesClassifier();
    }
    return classifierInstance;
}

/**
 * Classify a document by its filename
 */
export function classifyDocument(filename: string): ClassificationResult {
    const classifier = getClassifier();
    return classifier.classify(filename);
}
