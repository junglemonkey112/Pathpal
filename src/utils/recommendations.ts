import { Counsellor } from "../data/counsellors";

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
  counsellor: Counsellor;
  matchScore: number;
  reasons: string[];
}

// Interest to specialty mapping
const interestToSpecialty: Record<string, string[]> = {
  cs: ["CS", "Computer Science", "STEM", "School Selection"],
  business: ["Business", "Career Planning", "Economics"],
  engineering: ["STEM", "EE", "Mechanical Engineering", "School Selection"],
  arts: ["Art & Design", "Liberal Arts", "Essay Writing"],
  science: ["Research", "Academic", "Natural Sciences"],
  social: ["Liberal Arts", "Public Policy", "Social Sciences"],
  medicine: ["Biology", "Pre-Med", "Research"],
  law: ["Law", "Liberal Arts", "Political Science"],
};

// Major to specialty/school mapping
const majorToKeywords: Record<string, string[]> = {
  "Computer Science (CS)": ["CS", "Computer Science", "STEM", "Computer"],
  "Business Analytics": ["Business", "Career Planning"],
  "Electrical Engineering (EE)": ["EE", "STEM", "Electrical Engineering"],
  "Economics": ["Economics", "Liberal Arts", "Social Sciences"],
  "Psychology": ["Psychology", "Liberal Arts", "Social Sciences"],
  "Biology": ["Biology", "Pre-Med", "Research"],
  "Art & Design": ["Art", "Design", "Liberal Arts"],
  "Political Science": ["Political", "Public Policy", "Liberal Arts"],
  "Mechanical Engineering (ME)": ["STEM", "Mechanical", "Engineering"],
  "Data Science": ["CS", "Data", "Statistics"],
};

// Budget to price range mapping
const budgetToPrice: Record<string, [number, number]> = {
  "Under $30": [0, 30],
  "$30-50": [30, 50],
  "$50-80": [50, 80],
  "$80-100": [80, 100],
  "$100+": [100, 200],
};

export function getRecommendations(
  counsellors: Counsellor[],
  userProfile: UserProfile
): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  const [minBudget, maxBudget] = budgetToPrice[userProfile.budget] || [0, 200];

  for (const counsellor of counsellors) {
    let score = 0;
    const reasons: string[] = [];

    // 1. Price match (30 points)
    const price = counsellor.services[0].price;
    if (price >= minBudget && price <= maxBudget) {
      score += 30;
      reasons.push("Within budget");
    } else if (price <= maxBudget + 20) {
      score += 15; // Partial match
    }

    // 2. Major/Specialty match (40 points)
    const userInterests = userProfile.interests.flatMap(
      (i) => interestToSpecialty[i] || []
    );
    const userMajorKeywords = majorToKeywords[userProfile.targetMajor] || [];

    const allKeywords = [...userInterests, ...userMajorKeywords];

    const matchedSpecialties = counsellor.specialties.filter((s) =>
      allKeywords.some(
        (k) => s.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(s.toLowerCase())
      )
    );

    if (matchedSpecialties.length > 0) {
      score += Math.min(40, matchedSpecialties.length * 15);
      reasons.push(`Specializes in ${matchedSpecialties.slice(0, 2).join(", ")}`);
    }

    // 3. Target school match (20 points)
    const matchedSchools = counsellor.school
      ? userProfile.targetSchools.some((s) =>
          counsellor.school.toLowerCase().includes(s.toLowerCase().replace(" University", ""))
        )
      : false;

    if (matchedSchools) {
      score += 20;
      reasons.push("From target school");
    }

    // 4. Rating bonus (10 points)
    if (counsellor.rating >= 4.8) {
      score += 10;
    } else if (counsellor.rating >= 4.5) {
      score += 5;
    }

    // Only include counsellors with some relevance
    if (score > 0) {
      results.push({
        counsellor,
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
    "Below 3.0": 2.5,
    "3.0-3.5": 3.25,
    "3.5-3.8": 3.65,
    "3.8-4.0": 3.9,
    "4.0+": 4.0,
  };
  return gpaMap[gpa] || 3.0;
}