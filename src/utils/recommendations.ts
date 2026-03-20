import { Consultant } from "../data/consultants";

interface UserProfile {
  grade: string;
  gpa: string;
  interests: string[];
  targetMajor: string;
  targetSchools: string[];
  budget: string;
  hasSAT: boolean;
  satScore?: string;
}

interface RecommendationResult {
  consultant: Consultant;
  matchScore: number;
  reasons: string[];
}

// Interest to specialty mapping
const interestToSpecialty: Record<string, string[]> = {
  cs: ["CS申请", "计算机科学", "理工科", "选校"],
  business: ["商科申请", "职业规划", "Business"],
  engineering: ["理工科", "EE", "机械工程", "选校"],
  arts: ["艺术设计", "文科申请", "文书"],
  science: ["科研", "学术", "自然科学"],
  social: ["文科申请", "公共政策", "社会科学"],
  medicine: ["生物", "医学预科", "科研"],
  law: ["法律", "文科申请", "政治科学"],
};

// Major to specialty/school mapping
const majorToKeywords: Record<string, string[]> = {
  "计算机科学 (CS)": ["CS申请", "计算机科学", "理工科", "Computer"],
  "商业分析 (Business Analytics)": ["商科", "Business", "职业规划"],
  "电子工程 (EE)": ["EE", "理工科", "电子工程"],
  "经济学 (Economics)": ["经济", "文科", "社科"],
  "心理学 (Psychology)": ["心理", "文科", "社科"],
  "生物科学 (Biology)": ["生物", "医学", "科研"],
  "艺术设计 (Art & Design)": ["艺术", "设计", "文科"],
  "政治科学 (Political Science)": ["政治", "公共政策", "文科"],
  "机械工程 (ME)": ["理工科", "机械", "工程"],
  "数据科学 (Data Science)": ["CS", "数据", "统计"],
};

// Budget to price range mapping
const budgetToPrice: Record<string, [number, number]> = {
  "$30以下": [0, 30],
  "$30-50": [30, 50],
  "$50-80": [50, 80],
  "$80-100": [80, 100],
  "$100+": [100, 200],
};

export function getRecommendations(
  consultants: Consultant[],
  userProfile: UserProfile
): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  const [minBudget, maxBudget] = budgetToPrice[userProfile.budget] || [0, 200];

  for (const consultant of consultants) {
    let score = 0;
    const reasons: string[] = [];

    // 1. Price match (30 points)
    const consultantPrice = consultant.services[0].price;
    if (consultantPrice >= minBudget && consultantPrice <= maxBudget) {
      score += 30;
      reasons.push("符合预算");
    } else if (consultantPrice <= maxBudget + 20) {
      score += 15; // Partial match
    }

    // 2. Major/Specialty match (40 points)
    const userInterests = userProfile.interests.flatMap(
      (i) => interestToSpecialty[i] || []
    );
    const userMajorKeywords = majorToKeywords[userProfile.targetMajor] || [];

    const allKeywords = [...userInterests, ...userMajorKeywords];

    const matchedSpecialties = consultant.specialties.filter((s) =>
      allKeywords.some(
        (k) => s.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(s.toLowerCase())
      )
    );

    if (matchedSpecialties.length > 0) {
      score += Math.min(40, matchedSpecialties.length * 15);
      reasons.push(`擅长${matchedSpecialties.slice(0, 2).join("、")}`);
    }

    // 3. Target school match (20 points)
    const matchedSchools = consultant.school
      ? userProfile.targetSchools.some((s) =>
          consultant.school.toLowerCase().includes(s.toLowerCase().replace(" University", ""))
        )
      : false;

    if (matchedSchools) {
      score += 20;
      reasons.push(`来自目标院校`);
    }

    // 4. Rating bonus (10 points)
    if (consultant.rating >= 4.8) {
      score += 10;
    } else if (consultant.rating >= 4.5) {
      score += 5;
    }

    // Only include consultants with some relevance
    if (score > 0) {
      results.push({
        consultant,
        matchScore: Math.min(100, score),
        reasons,
      });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function getRecommendedSchools(userProfile: UserProfile): string[] {
  const recommendations: string[] = [];
  
  // Simple recommendation based on GPA and interests
  const gpaScore = formGpaToNumber(userProfile.gpa);
  
  if (gpaScore >= 3.8) {
    recommendations.push("Harvard University", "Stanford University", "MIT", "Yale University");
  } else if (gpaScore >= 3.5) {
    recommendations.push("Columbia University", "University of Pennsylvania", "Cornell University");
  } else if (gpaScore >= 3.0) {
    recommendations.push("UC Berkeley", "UCLA", "University of Michigan");
  } else {
    recommendations.push("University of Washington", "Boston University", "NYU");
  }

  return recommendations;
}

function formGpaToNumber(gpa: string): number {
  const gpaMap: Record<string, number> = {
    "3.0以下": 2.5,
    "3.0-3.5": 3.25,
    "3.5-3.8": 3.65,
    "3.8-4.0": 3.9,
    "4.0+": 4.0,
  };
  return gpaMap[gpa] || 3.0;
}