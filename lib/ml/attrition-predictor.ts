/**
 * Attrition Prediction Models
 * 
 * Implements Random Forest and Extra Trees classifiers for predicting
 * employee attrition risk based on risk factor features.
 */

import { Employee, RiskFactors } from "@/lib/data/types";

// Types for the ML models
export interface TrainingData {
    features: number[][];
    labels: number[];
}

export interface ModelPrediction {
    prediction: number; // 0 = stay, 1 = leave
    probability: number; // probability of leaving
    riskLevel: "low" | "medium" | "high";
}

export interface FeatureImportances {
    overtime: number;
    compensation: number;
    satisfaction: number;
    growth: number;
    workLifeBalance: number;
}

export interface ModelMetricsResult {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    featureImportances: FeatureImportances;
}

export interface AttritionModelInfo {
    name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    nEstimators: number;
    maxDepth: number;
    featureImportances: FeatureImportances;
}

// Feature names for interpretability
const FEATURE_NAMES: (keyof RiskFactors)[] = [
    "overtime",
    "compensation",
    "satisfaction",
    "growth",
    "workLifeBalance"
];

/**
 * Decision Tree Node
 */
interface TreeNode {
    featureIndex?: number;
    threshold?: number;
    left?: TreeNode;
    right?: TreeNode;
    prediction?: number;
    samples?: number;
}

/**
 * Calculate Gini impurity for a set of labels
 */
function giniImpurity(labels: number[]): number {
    if (labels.length === 0) return 0;

    const counts: Record<number, number> = {};
    for (const label of labels) {
        counts[label] = (counts[label] || 0) + 1;
    }

    let impurity = 1;
    for (const count of Object.values(counts)) {
        const prob = count / labels.length;
        impurity -= prob * prob;
    }

    return impurity;
}

/**
 * Calculate information gain for a split
 */
function informationGain(
    parentLabels: number[],
    leftLabels: number[],
    rightLabels: number[]
): number {
    const parentImpurity = giniImpurity(parentLabels);
    const leftWeight = leftLabels.length / parentLabels.length;
    const rightWeight = rightLabels.length / parentLabels.length;

    const weightedChildImpurity =
        leftWeight * giniImpurity(leftLabels) +
        rightWeight * giniImpurity(rightLabels);

    return parentImpurity - weightedChildImpurity;
}

/**
 * Decision Tree Classifier
 */
class DecisionTree {
    private root: TreeNode | null = null;
    private maxDepth: number;
    private minSamplesSplit: number;
    private featureSubsetSize: number | null;
    private randomSplits: boolean;
    public featureImportances: number[] = [];

    constructor(
        maxDepth: number = 10,
        minSamplesSplit: number = 2,
        featureSubsetSize: number | null = null,
        randomSplits: boolean = false
    ) {
        this.maxDepth = maxDepth;
        this.minSamplesSplit = minSamplesSplit;
        this.featureSubsetSize = featureSubsetSize;
        this.randomSplits = randomSplits;
    }

    /**
     * Find the best split for a node
     */
    private findBestSplit(
        features: number[][],
        labels: number[],
        featureIndices: number[]
    ): { featureIndex: number; threshold: number; gain: number } | null {
        let bestGain = 0;
        let bestFeatureIndex = -1;
        let bestThreshold = 0;

        for (const featureIndex of featureIndices) {
            const featureValues = features.map(f => f[featureIndex]);
            const uniqueValues = [...new Set(featureValues)].sort((a, b) => a - b);

            if (this.randomSplits && uniqueValues.length > 1) {
                // Extra Trees: random threshold between min and max
                const min = Math.min(...featureValues);
                const max = Math.max(...featureValues);
                const threshold = min + Math.random() * (max - min);

                const leftIndices = features.map((f, i) => f[featureIndex] <= threshold ? i : -1).filter(i => i >= 0);
                const rightIndices = features.map((f, i) => f[featureIndex] > threshold ? i : -1).filter(i => i >= 0);

                if (leftIndices.length > 0 && rightIndices.length > 0) {
                    const leftLabels = leftIndices.map(i => labels[i]);
                    const rightLabels = rightIndices.map(i => labels[i]);
                    const gain = informationGain(labels, leftLabels, rightLabels);

                    if (gain > bestGain) {
                        bestGain = gain;
                        bestFeatureIndex = featureIndex;
                        bestThreshold = threshold;
                    }
                }
            } else {
                // Random Forest: find optimal threshold
                for (let i = 0; i < uniqueValues.length - 1; i++) {
                    const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;

                    const leftIndices = features.map((f, i) => f[featureIndex] <= threshold ? i : -1).filter(i => i >= 0);
                    const rightIndices = features.map((f, i) => f[featureIndex] > threshold ? i : -1).filter(i => i >= 0);

                    if (leftIndices.length > 0 && rightIndices.length > 0) {
                        const leftLabels = leftIndices.map(i => labels[i]);
                        const rightLabels = rightIndices.map(i => labels[i]);
                        const gain = informationGain(labels, leftLabels, rightLabels);

                        if (gain > bestGain) {
                            bestGain = gain;
                            bestFeatureIndex = featureIndex;
                            bestThreshold = threshold;
                        }
                    }
                }
            }
        }

        if (bestFeatureIndex === -1) return null;
        return { featureIndex: bestFeatureIndex, threshold: bestThreshold, gain: bestGain };
    }

    /**
     * Build the tree recursively
     */
    private buildTree(
        features: number[][],
        labels: number[],
        depth: number
    ): TreeNode {
        const samples = labels.length;

        // Check stopping conditions
        if (
            depth >= this.maxDepth ||
            samples < this.minSamplesSplit ||
            new Set(labels).size === 1
        ) {
            // Leaf node: predict majority class
            const counts: Record<number, number> = {};
            for (const label of labels) {
                counts[label] = (counts[label] || 0) + 1;
            }
            const prediction = Number(Object.entries(counts).reduce((a, b) =>
                a[1] > b[1] ? a : b
            )[0]);

            return { prediction, samples };
        }

        // Select features to consider
        let featureIndices = Array.from({ length: features[0].length }, (_, i) => i);
        if (this.featureSubsetSize !== null) {
            // Random feature selection for ensemble methods
            featureIndices = this.shuffleArray(featureIndices).slice(0, this.featureSubsetSize);
        }

        // Find best split
        const split = this.findBestSplit(features, labels, featureIndices);

        if (!split) {
            // No valid split found, create leaf
            const counts: Record<number, number> = {};
            for (const label of labels) {
                counts[label] = (counts[label] || 0) + 1;
            }
            const prediction = Number(Object.entries(counts).reduce((a, b) =>
                a[1] > b[1] ? a : b
            )[0]);

            return { prediction, samples };
        }

        // Track feature importances
        this.featureImportances[split.featureIndex] =
            (this.featureImportances[split.featureIndex] || 0) + split.gain * samples;

        // Split data
        const leftFeatures: number[][] = [];
        const leftLabels: number[] = [];
        const rightFeatures: number[][] = [];
        const rightLabels: number[] = [];

        for (let i = 0; i < features.length; i++) {
            if (features[i][split.featureIndex] <= split.threshold) {
                leftFeatures.push(features[i]);
                leftLabels.push(labels[i]);
            } else {
                rightFeatures.push(features[i]);
                rightLabels.push(labels[i]);
            }
        }

        return {
            featureIndex: split.featureIndex,
            threshold: split.threshold,
            left: this.buildTree(leftFeatures, leftLabels, depth + 1),
            right: this.buildTree(rightFeatures, rightLabels, depth + 1),
            samples
        };
    }

    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Train the decision tree
     */
    fit(features: number[][], labels: number[]): void {
        this.featureImportances = new Array(features[0].length).fill(0);
        this.root = this.buildTree(features, labels, 0);

        // Normalize feature importances
        const total = this.featureImportances.reduce((a, b) => a + b, 0);
        if (total > 0) {
            this.featureImportances = this.featureImportances.map(v => v / total);
        }
    }

    /**
     * Predict for a single sample
     */
    predict(features: number[]): number {
        if (!this.root) return 0;

        let node = this.root;
        while (node.prediction === undefined) {
            if (features[node.featureIndex!] <= node.threshold!) {
                node = node.left!;
            } else {
                node = node.right!;
            }
        }

        return node.prediction;
    }

    /**
     * Get probability prediction (simplified - based on leaf sample distribution)
     */
    predictProba(features: number[]): number {
        // For simplicity, return prediction as probability
        return this.predict(features);
    }
}

/**
 * Random Forest Classifier
 */
export class RandomForestClassifier {
    private trees: DecisionTree[] = [];
    private nEstimators: number;
    private maxDepth: number;
    private minSamplesSplit: number;
    private maxFeatures: number | "sqrt" | "log2";
    public featureImportances: number[] = [];
    public name = "Random Forest";

    constructor(
        nEstimators: number = 10,
        maxDepth: number = 8,
        minSamplesSplit: number = 2,
        maxFeatures: number | "sqrt" | "log2" = "sqrt"
    ) {
        this.nEstimators = nEstimators;
        this.maxDepth = maxDepth;
        this.minSamplesSplit = minSamplesSplit;
        this.maxFeatures = maxFeatures;
    }

    private getMaxFeatures(nFeatures: number): number {
        if (typeof this.maxFeatures === "number") {
            return this.maxFeatures;
        }
        if (this.maxFeatures === "sqrt") {
            return Math.ceil(Math.sqrt(nFeatures));
        }
        if (this.maxFeatures === "log2") {
            return Math.ceil(Math.log2(nFeatures));
        }
        return nFeatures;
    }

    /**
     * Bootstrap sample (sample with replacement)
     */
    private bootstrapSample(
        features: number[][],
        labels: number[]
    ): { features: number[][]; labels: number[] } {
        const n = features.length;
        const sampledFeatures: number[][] = [];
        const sampledLabels: number[] = [];

        for (let i = 0; i < n; i++) {
            const idx = Math.floor(Math.random() * n);
            sampledFeatures.push(features[idx]);
            sampledLabels.push(labels[idx]);
        }

        return { features: sampledFeatures, labels: sampledLabels };
    }

    /**
     * Train the random forest
     */
    fit(features: number[][], labels: number[]): void {
        this.trees = [];
        this.featureImportances = new Array(features[0].length).fill(0);

        const maxFeatures = this.getMaxFeatures(features[0].length);

        for (let i = 0; i < this.nEstimators; i++) {
            const tree = new DecisionTree(
                this.maxDepth,
                this.minSamplesSplit,
                maxFeatures,
                false // Random Forest uses optimal splits
            );

            const sample = this.bootstrapSample(features, labels);
            tree.fit(sample.features, sample.labels);
            this.trees.push(tree);

            // Aggregate feature importances
            for (let j = 0; j < tree.featureImportances.length; j++) {
                this.featureImportances[j] += tree.featureImportances[j];
            }
        }

        // Average feature importances
        this.featureImportances = this.featureImportances.map(
            v => v / this.nEstimators
        );
    }

    /**
     * Predict using majority voting
     */
    predict(features: number[]): number {
        const votes = this.trees.map(tree => tree.predict(features));
        const sum = votes.reduce((a, b) => a + b, 0);
        return sum >= votes.length / 2 ? 1 : 0;
    }

    /**
     * Get probability of positive class (attrition)
     */
    predictProba(features: number[]): number {
        const votes = this.trees.map(tree => tree.predict(features));
        return votes.reduce((a, b) => a + b, 0) / votes.length;
    }

    getParams() {
        return {
            nEstimators: this.nEstimators,
            maxDepth: this.maxDepth
        };
    }
}

/**
 * Extra Trees Classifier
 * Extremely Randomized Trees - uses random splits instead of optimal
 */
export class ExtraTreesClassifier {
    private trees: DecisionTree[] = [];
    private nEstimators: number;
    private maxDepth: number;
    private minSamplesSplit: number;
    private maxFeatures: number | "sqrt" | "log2";
    public featureImportances: number[] = [];
    public name = "Extra Trees";

    constructor(
        nEstimators: number = 10,
        maxDepth: number = 8,
        minSamplesSplit: number = 2,
        maxFeatures: number | "sqrt" | "log2" = "sqrt"
    ) {
        this.nEstimators = nEstimators;
        this.maxDepth = maxDepth;
        this.minSamplesSplit = minSamplesSplit;
        this.maxFeatures = maxFeatures;
    }

    private getMaxFeatures(nFeatures: number): number {
        if (typeof this.maxFeatures === "number") {
            return this.maxFeatures;
        }
        if (this.maxFeatures === "sqrt") {
            return Math.ceil(Math.sqrt(nFeatures));
        }
        if (this.maxFeatures === "log2") {
            return Math.ceil(Math.log2(nFeatures));
        }
        return nFeatures;
    }

    /**
     * Train the extra trees forest
     * Note: Extra Trees does NOT use bootstrap sampling - uses all data
     */
    fit(features: number[][], labels: number[]): void {
        this.trees = [];
        this.featureImportances = new Array(features[0].length).fill(0);

        const maxFeatures = this.getMaxFeatures(features[0].length);

        for (let i = 0; i < this.nEstimators; i++) {
            const tree = new DecisionTree(
                this.maxDepth,
                this.minSamplesSplit,
                maxFeatures,
                true // Extra Trees uses random splits
            );

            // Extra Trees uses ALL training data (no bootstrapping)
            tree.fit(features, labels);
            this.trees.push(tree);

            // Aggregate feature importances
            for (let j = 0; j < tree.featureImportances.length; j++) {
                this.featureImportances[j] += tree.featureImportances[j];
            }
        }

        // Average feature importances
        this.featureImportances = this.featureImportances.map(
            v => v / this.nEstimators
        );
    }

    /**
     * Predict using majority voting
     */
    predict(features: number[]): number {
        const votes = this.trees.map(tree => tree.predict(features));
        const sum = votes.reduce((a, b) => a + b, 0);
        return sum >= votes.length / 2 ? 1 : 0;
    }

    /**
     * Get probability of positive class (attrition)
     */
    predictProba(features: number[]): number {
        const votes = this.trees.map(tree => tree.predict(features));
        return votes.reduce((a, b) => a + b, 0) / votes.length;
    }

    getParams() {
        return {
            nEstimators: this.nEstimators,
            maxDepth: this.maxDepth
        };
    }
}

/**
 * Extract features from an employee for prediction
 */
export function extractFeatures(employee: Employee): number[] {
    return FEATURE_NAMES.map(name => employee.riskFactors[name]);
}

/**
 * Convert feature importances array to named object
 */
function toFeatureImportancesObject(importances: number[]): FeatureImportances {
    return {
        overtime: importances[0] || 0,
        compensation: importances[1] || 0,
        satisfaction: importances[2] || 0,
        growth: importances[3] || 0,
        workLifeBalance: importances[4] || 0
    };
}

/**
 * Calculate model metrics on test data
 */
function calculateMetrics(
    model: RandomForestClassifier | ExtraTreesClassifier,
    testFeatures: number[][],
    testLabels: number[]
): ModelMetricsResult {
    let tp = 0, fp = 0, tn = 0, fn = 0;
    const predictions: number[] = [];
    const probabilities: number[] = [];

    for (let i = 0; i < testFeatures.length; i++) {
        const pred = model.predict(testFeatures[i]);
        const prob = model.predictProba(testFeatures[i]);
        predictions.push(pred);
        probabilities.push(prob);

        if (pred === 1 && testLabels[i] === 1) tp++;
        else if (pred === 1 && testLabels[i] === 0) fp++;
        else if (pred === 0 && testLabels[i] === 0) tn++;
        else fn++;
    }

    const accuracy = (tp + tn) / (tp + tn + fp + fn) || 0;
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1Score = 2 * precision * recall / (precision + recall) || 0;

    // Simplified ROC-AUC calculation
    // Sort by probability and calculate area under curve
    const sorted = probabilities
        .map((p, i) => ({ prob: p, label: testLabels[i] }))
        .sort((a, b) => b.prob - a.prob);

    let rocAuc = 0;
    let tpCount = 0;
    let fpCount = 0;
    const totalPositives = testLabels.filter(l => l === 1).length;
    const totalNegatives = testLabels.filter(l => l === 0).length;

    if (totalPositives > 0 && totalNegatives > 0) {
        for (const item of sorted) {
            if (item.label === 1) {
                tpCount++;
            } else {
                fpCount++;
                rocAuc += tpCount;
            }
        }
        rocAuc = rocAuc / (totalPositives * totalNegatives);
    } else {
        rocAuc = 0.5; // Default when no positive or negative samples
    }

    return {
        accuracy: accuracy * 100,
        precision: precision * 100,
        recall: recall * 100,
        f1Score: f1Score * 100,
        rocAuc: rocAuc * 100,
        featureImportances: toFeatureImportancesObject(model.featureImportances)
    };
}

/**
 * Train-test split
 */
function trainTestSplit(
    features: number[][],
    labels: number[],
    testSize: number = 0.2
): {
    trainFeatures: number[][];
    trainLabels: number[];
    testFeatures: number[][];
    testLabels: number[];
} {
    const indices = Array.from({ length: features.length }, (_, i) => i);

    // Shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const splitIdx = Math.floor(features.length * (1 - testSize));
    const trainIndices = indices.slice(0, splitIdx);
    const testIndices = indices.slice(splitIdx);

    return {
        trainFeatures: trainIndices.map(i => features[i]),
        trainLabels: trainIndices.map(i => labels[i]),
        testFeatures: testIndices.map(i => features[i]),
        testLabels: testIndices.map(i => labels[i])
    };
}

/**
 * Create training data from employees
 * Uses hasResigned as label, simulates some resigned employees if none exist
 */
export function createTrainingData(employees: Employee[]): TrainingData {
    const features: number[][] = [];
    const labels: number[] = [];

    for (const emp of employees) {
        features.push(extractFeatures(emp));

        // Use hasResigned if available, otherwise derive from risk score
        // High risk (>70) employees are more likely to have left
        if (emp.hasResigned !== undefined) {
            labels.push(emp.hasResigned ? 1 : 0);
        } else {
            // Simulate: employees with very high risk factors are considered "left"
            // This creates synthetic training labels for demonstration
            const avgRiskFactor = (
                emp.riskFactors.overtime +
                emp.riskFactors.compensation +
                (100 - emp.riskFactors.satisfaction) + // Invert satisfaction
                emp.riskFactors.growth +
                (100 - emp.riskFactors.workLifeBalance) // Invert work-life balance
            ) / 5;

            // Higher average risk factor = more likely to leave
            labels.push(avgRiskFactor > 55 ? 1 : 0);
        }
    }

    return { features, labels };
}

/**
 * Train both models and return their metrics
 */
export function trainModels(employees: Employee[]): {
    randomForest: AttritionModelInfo;
    extraTrees: AttritionModelInfo;
    rfModel: RandomForestClassifier;
    etcModel: ExtraTreesClassifier;
} {
    const { features, labels } = createTrainingData(employees);

    // Split data
    const { trainFeatures, trainLabels, testFeatures, testLabels } =
        trainTestSplit(features, labels, 0.2);

    // Train Random Forest
    const rfModel = new RandomForestClassifier(15, 8, 2, "sqrt");
    rfModel.fit(trainFeatures, trainLabels);
    const rfMetrics = calculateMetrics(rfModel, testFeatures, testLabels);

    // Train Extra Trees
    const etcModel = new ExtraTreesClassifier(15, 8, 2, "sqrt");
    etcModel.fit(trainFeatures, trainLabels);
    const etcMetrics = calculateMetrics(etcModel, testFeatures, testLabels);

    return {
        randomForest: {
            name: "Random Forest",
            ...rfMetrics,
            nEstimators: rfModel.getParams().nEstimators,
            maxDepth: rfModel.getParams().maxDepth
        },
        extraTrees: {
            name: "Extra Trees",
            ...etcMetrics,
            nEstimators: etcModel.getParams().nEstimators,
            maxDepth: etcModel.getParams().maxDepth
        },
        rfModel,
        etcModel
    };
}

/**
 * Predict attrition risk for a single employee
 */
export function predictAttrition(
    employee: Employee,
    model: RandomForestClassifier | ExtraTreesClassifier
): ModelPrediction {
    const features = extractFeatures(employee);
    const prediction = model.predict(features);
    const probability = model.predictProba(features);

    let riskLevel: "low" | "medium" | "high";
    if (probability >= 0.7) riskLevel = "high";
    else if (probability >= 0.4) riskLevel = "medium";
    else riskLevel = "low";

    return {
        prediction,
        probability,
        riskLevel
    };
}

// Singleton models for use across the app
let trainedRFModel: RandomForestClassifier | null = null;
let trainedETCModel: ExtraTreesClassifier | null = null;
let rfF1Score: number = 0;
let etcF1Score: number = 0;
let bestModelName: "Random Forest" | "Extra Trees" = "Random Forest";

export function getTrainedModels(): {
    rf: RandomForestClassifier | null;
    etc: ExtraTreesClassifier | null;
} {
    return { rf: trainedRFModel, etc: trainedETCModel };
}

export function setTrainedModels(
    rf: RandomForestClassifier,
    etc: ExtraTreesClassifier,
    rfMetrics?: { f1Score: number },
    etcMetrics?: { f1Score: number }
): void {
    trainedRFModel = rf;
    trainedETCModel = etc;

    // Track F1 scores to determine best model
    if (rfMetrics) rfF1Score = rfMetrics.f1Score;
    if (etcMetrics) etcF1Score = etcMetrics.f1Score;

    // Determine winning model based on F1 score
    bestModelName = rfF1Score >= etcF1Score ? "Random Forest" : "Extra Trees";
}

/**
 * Get the best performing model based on F1 score
 * This is the model that should be used for predictions
 */
export function getBestModel(): {
    model: RandomForestClassifier | ExtraTreesClassifier | null;
    name: "Random Forest" | "Extra Trees";
    f1Score: number;
} {
    if (rfF1Score >= etcF1Score) {
        return {
            model: trainedRFModel,
            name: "Random Forest",
            f1Score: rfF1Score
        };
    } else {
        return {
            model: trainedETCModel,
            name: "Extra Trees",
            f1Score: etcF1Score
        };
    }
}

/**
 * Get the name of the best model
 */
export function getBestModelName(): "Random Forest" | "Extra Trees" {
    return bestModelName;
}

/**
 * Predict attrition using the best model (highest F1 score)
 * This is the main prediction function to use throughout the app
 */
export function predictAttritionWithBestModel(employee: Employee): ModelPrediction & { modelUsed: string } {
    const { model, name } = getBestModel();

    if (!model) {
        // Return default/fallback if no model is trained
        return {
            prediction: 0,
            probability: employee.riskScore / 100, // Use existing risk score as fallback
            riskLevel: employee.riskLevel,
            modelUsed: "fallback (no model trained)"
        };
    }

    const features = extractFeatures(employee);
    const prediction = model.predict(features);
    const probability = model.predictProba(features);

    let riskLevel: "low" | "medium" | "high";
    if (probability >= 0.7) riskLevel = "high";
    else if (probability >= 0.4) riskLevel = "medium";
    else riskLevel = "low";

    return {
        prediction,
        probability,
        riskLevel,
        modelUsed: name
    };
}

