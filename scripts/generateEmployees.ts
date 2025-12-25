import { faker } from "@faker-js/faker";
import * as fs from "fs";
import * as path from "path";

// Malaysian Malay Names
const malayFirstNames = [
    "Ahmad", "Muhammad", "Mohd", "Abdul", "Ibrahim", "Ismail", "Hassan", "Hussain",
    "Razak", "Aziz", "Karim", "Rahman", "Osman", "Yusof", "Zulkifli", "Hakim",
    "Farid", "Hafiz", "Syafiq", "Amir", "Firdaus", "Nizar", "Haziq", "Izzat",
    "Nur", "Siti", "Fatimah", "Aisyah", "Zarina", "Rashidah", "Noraini", "Haslinda",
    "Suraya", "Aminah", "Mariam", "Fauziah", "Shahira", "Izzati", "Nadia", "Syahira"
];

const malayLastNames = [
    "Abdullah", "Rahman", "Hassan", "Ibrahim", "Ismail", "Osman", "Yusof",
    "Ahmad", "Mohamed", "Hamid", "Karim", "Wahab", "Razak", "Aziz", "Bakar",
    "Latif", "Majid", "Ghani", "Halim", "Jamil", "Salleh", "Zainuddin"
];

// Malaysian Chinese Names
const chineseFirstNames = [
    "Wei", "Ming", "Jun", "Chen", "Hui", "Kai", "Jie", "Xuan", "Yi", "Hao",
    "Liang", "Feng", "Lin", "Yan", "Mei", "Xin", "Ying", "Fang", "Li", "Yu",
    "Cheng", "Hong", "Zhi", "Wen", "Bao", "Shu", "Ting", "Qian", "Jing", "Yun"
];

const chineseSurnames = [
    "Tan", "Lim", "Lee", "Ong", "Wong", "Chan", "Ng", "Koh", "Goh", "Teo",
    "Chua", "Yap", "Chong", "Cheong", "Chin", "Ho", "Foo", "Low", "Teh", "Soh",
    "Leong", "Teoh", "Ooi", "Yeo", "Chia", "Pua", "Saw", "Khoo", "Sim", "Lau"
];

// Malaysian Indian Names
const indianMaleFirstNames = [
    "Raj", "Kumar", "Suresh", "Ramesh", "Ganesh", "Anand", "Vijay", "Ravi",
    "Prakash", "Arun", "Vikram", "Surya", "Mohan", "Gopal", "Krishna", "Shankar",
    "Naveen", "Karthik", "Dinesh", "Mahesh", "Rajesh", "Deepak", "Ashok", "Arjun"
];

const indianFemaleFirstNames = [
    "Priya", "Lakshmi", "Devi", "Meena", "Kavitha", "Shalini", "Rani", "Geetha",
    "Malathi", "Pushpa", "Revathi", "Saraswathi", "Vijaya", "Sumathi", "Anitha",
    "Nirmala", "Usha", "Radha", "Kamala", "Vimala", "Indra", "Shanti", "Padma", "Uma"
];

const indianLastNames = [
    "Krishnan", "Rajan", "Nathan", "Murugan", "Subramanian", "Ramasamy",
    "Govindasamy", "Shanmugam", "Arumugam", "Thirunavukarasu", "Velayutham",
    "Perumal", "Nagarajan", "Muthusamy", "Selvaraj", "Palaniappan", "Muniandy",
    "Balakrishnan", "Chandran", "Pandiyan", "Maniam", "Pillai", "Nair", "Menon"
];

// Departments and positions
const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Legal"];
const positionsByDept: Record<string, string[]> = {
    Engineering: ["Software Engineer", "Senior Developer", "DevOps Engineer", "QA Engineer", "Data Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "System Administrator", "Cloud Engineer"],
    Marketing: ["Marketing Executive", "Digital Marketing Specialist", "Content Strategist", "Social Media Manager", "Brand Manager", "Marketing Analyst"],
    Sales: ["Sales Executive", "Account Manager", "Business Development Rep", "Sales Coordinator", "Client Relations Manager"],
    HR: ["HR Executive", "Talent Acquisition Specialist", "HR Coordinator", "Compensation Analyst", "Training Specialist"],
    Finance: ["Accountant", "Financial Analyst", "Budget Analyst", "Accounts Executive", "Finance Coordinator"],
    Operations: ["Operations Executive", "Supply Chain Analyst", "Logistics Coordinator", "Quality Assurance Specialist", "Operations Analyst"],
    Legal: ["Legal Executive", "Compliance Officer", "Contract Specialist", "Paralegal", "Legal Counsel"]
};

const jobLevels = ["entry", "junior", "mid", "senior", "lead", "manager"];

type EthnicGroup = "malay" | "chinese" | "indian";

function generateMalaysianName(ethnicity: EthnicGroup, isFemale: boolean): string {
    switch (ethnicity) {
        case "malay":
            if (isFemale) {
                const femaleNames = malayFirstNames.filter(n =>
                    ["Nur", "Siti", "Fatimah", "Aisyah", "Zarina", "Rashidah", "Noraini", "Haslinda",
                        "Suraya", "Aminah", "Mariam", "Fauziah", "Shahira", "Izzati", "Nadia", "Syahira"].includes(n)
                );
                const firstName = faker.helpers.arrayElement(femaleNames);
                const lastName = faker.helpers.arrayElement(malayLastNames);
                return `${firstName} binti ${lastName}`;
            } else {
                const maleNames = malayFirstNames.filter(n =>
                    ["Ahmad", "Muhammad", "Mohd", "Abdul", "Ibrahim", "Ismail", "Hassan", "Hussain",
                        "Razak", "Aziz", "Karim", "Rahman", "Osman", "Yusof", "Zulkifli", "Hakim",
                        "Farid", "Hafiz", "Syafiq", "Amir", "Firdaus", "Nizar", "Haziq", "Izzat"].includes(n)
                );
                const firstName = faker.helpers.arrayElement(maleNames);
                const lastName = faker.helpers.arrayElement(malayLastNames);
                return `${firstName} bin ${lastName}`;
            }
        case "chinese":
            const surname = faker.helpers.arrayElement(chineseSurnames);
            const firstName = faker.helpers.arrayElement(chineseFirstNames);
            const secondName = faker.helpers.arrayElement(chineseFirstNames);
            return `${surname} ${firstName} ${secondName}`;
        case "indian":
            if (isFemale) {
                const firstName = faker.helpers.arrayElement(indianFemaleFirstNames);
                const lastName = faker.helpers.arrayElement(indianLastNames);
                return `${firstName} a/p ${lastName}`;
            } else {
                const firstName = faker.helpers.arrayElement(indianMaleFirstNames);
                const lastName = faker.helpers.arrayElement(indianLastNames);
                return `${firstName} a/l ${lastName}`;
            }
    }
}

function generateEmail(name: string): string {
    const cleanName = name
        .replace(/ binti | bin | a\/p | a\/l /g, " ")
        .toLowerCase()
        .split(" ")
        .slice(0, 2)
        .join(".");
    return `${cleanName}@company.com`;
}

function generateRandomDate(startYear: number, endYear: number): string {
    const year = faker.number.int({ min: startYear, max: endYear });
    const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0");
    const day = String(faker.number.int({ min: 1, max: 28 })).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    jobLevel: string;
    hireDate: string;
    salary: number;
    riskScore: number;
    riskLevel: string;
    satisfactionScore: number;
    overtimeHours: number;
    totalWorkingHours: number;
    previousCompanies: number;
    lastPromotionDate: string | null;
    performanceRating: number;
    avatar: string;
    riskFactors: {
        overtime: number;
        compensation: number;
        satisfaction: number;
        growth: number;
        workLifeBalance: number;
    };
}

function generateEmployee(id: number): Employee {
    // Distribute ethnicities somewhat evenly
    const ethnicities: EthnicGroup[] = ["malay", "chinese", "indian"];
    const ethnicity = ethnicities[id % 3];
    const isFemale = faker.datatype.boolean();

    const name = generateMalaysianName(ethnicity, isFemale);
    const department = faker.helpers.arrayElement(departments);
    const position = faker.helpers.arrayElement(positionsByDept[department]);
    const jobLevel = faker.helpers.arrayElement(jobLevels);

    // Generate risk-related data
    const riskScore = faker.number.int({ min: 15, max: 90 });
    const riskLevel = riskScore >= 65 ? "high" : riskScore >= 40 ? "medium" : "low";
    const satisfactionScore = faker.number.int({ min: 30, max: 95 });
    const overtimeHours = faker.number.int({ min: 0, max: 35 });

    // Calculate salary based on job level
    const baseSalaries: Record<string, { min: number; max: number }> = {
        entry: { min: 36000, max: 48000 },
        junior: { min: 48000, max: 65000 },
        mid: { min: 65000, max: 85000 },
        senior: { min: 85000, max: 120000 },
        lead: { min: 100000, max: 140000 },
        manager: { min: 90000, max: 130000 }
    };
    const salaryRange = baseSalaries[jobLevel];
    const salary = faker.number.int({ min: salaryRange.min, max: salaryRange.max });

    const hireDate = generateRandomDate(2015, 2023);
    const hasPromotion = faker.datatype.boolean();
    const lastPromotionDate = hasPromotion ? generateRandomDate(2020, 2024) : null;

    // Generate correlated risk factors
    const overtimeRisk = faker.number.int({ min: Math.max(10, overtimeHours * 2), max: Math.min(95, overtimeHours * 3 + 20) });
    const compensationRisk = faker.number.int({ min: 20, max: 80 });
    const satisfactionRisk = 100 - satisfactionScore + faker.number.int({ min: -10, max: 10 });
    const growthRisk = hasPromotion ? faker.number.int({ min: 15, max: 50 }) : faker.number.int({ min: 40, max: 85 });
    const workLifeBalanceRisk = faker.number.int({ min: Math.max(10, 100 - satisfactionScore - 10), max: Math.min(95, 100 - satisfactionScore + 20) });

    const employeeId = `EMP${String(id).padStart(3, "0")}`;

    return {
        id: employeeId,
        name,
        email: generateEmail(name),
        department,
        position,
        jobLevel,
        hireDate,
        salary,
        riskScore,
        riskLevel,
        satisfactionScore,
        overtimeHours,
        totalWorkingHours: 160 + overtimeHours,
        previousCompanies: faker.number.int({ min: 0, max: 5 }),
        lastPromotionDate,
        performanceRating: Math.round(faker.number.float({ min: 2.5, max: 5.0 }) * 10) / 10,
        avatar: "",
        riskFactors: {
            overtime: Math.max(10, Math.min(95, overtimeRisk)),
            compensation: Math.max(10, Math.min(95, compensationRisk)),
            satisfaction: Math.max(10, Math.min(95, satisfactionRisk)),
            growth: Math.max(10, Math.min(95, growthRisk)),
            workLifeBalance: Math.max(10, Math.min(95, workLifeBalanceRisk)),
        },
    };
}

// Generate 100 new employees starting from ID 34
const newEmployees: Employee[] = [];
for (let i = 34; i <= 133; i++) {
    newEmployees.push(generateEmployee(i));
}

// Generate the TypeScript code string
const employeesCode = newEmployees.map(emp => `  {
    id: "${emp.id}",
    name: "${emp.name}",
    email: "${emp.email}",
    department: "${emp.department}",
    position: "${emp.position}",
    jobLevel: "${emp.jobLevel}",
    hireDate: "${emp.hireDate}",
    salary: ${emp.salary},
    riskScore: ${emp.riskScore},
    riskLevel: "${emp.riskLevel}",
    satisfactionScore: ${emp.satisfactionScore},
    overtimeHours: ${emp.overtimeHours},
    totalWorkingHours: ${emp.totalWorkingHours},
    previousCompanies: ${emp.previousCompanies},
    lastPromotionDate: ${emp.lastPromotionDate ? `"${emp.lastPromotionDate}"` : 'null'},
    performanceRating: ${emp.performanceRating},
    avatar: "",
    riskFactors: {
      overtime: ${emp.riskFactors.overtime},
      compensation: ${emp.riskFactors.compensation},
      satisfaction: ${emp.riskFactors.satisfaction},
      growth: ${emp.riskFactors.growth},
      workLifeBalance: ${emp.riskFactors.workLifeBalance},
    },
  }`).join(",\n");

console.log("Generated 100 Malaysian employees:");
console.log("Malay names: " + newEmployees.filter((_, i) => i % 3 === 0).length);
console.log("Chinese names: " + newEmployees.filter((_, i) => i % 3 === 1).length);
console.log("Indian names: " + newEmployees.filter((_, i) => i % 3 === 2).length);

// Write to a file for easy copying
const outputPath = path.join(__dirname, "generatedEmployees.txt");
fs.writeFileSync(outputPath, employeesCode);
console.log(`\nGenerated employee data written to: ${outputPath}`);
