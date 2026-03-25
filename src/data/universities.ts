export interface University {
  name: string;
  tier: number;
  labels: string[];
}

// US Universities with tiers and GPA requirements
// Tier 1: Most selective (3.8+)
// Tier 2: Very selective (3.5+)
// Tier 3: Selective (3.2+)
// Tier 4: Moderate (3.0+)
export const universities: University[] = [
  // Tier 1 - Most Selective
  { name: "Harvard University", tier: 1, labels: ["business", "stem", "social", "health"] },
  { name: "Stanford University", tier: 1, labels: ["stem", "business", "arts"] },
  { name: "MIT", tier: 1, labels: ["stem"] },
  { name: "Yale University", tier: 1, labels: ["arts", "humanities", "social"] },
  { name: "Princeton University", tier: 1, labels: ["stem", "humanities"] },
  { name: "Columbia University", tier: 1, labels: ["business", "arts", "stem"] },
  { name: "University of Chicago", tier: 1, labels: ["stem", "business", "humanities"] },
  { name: "University of Pennsylvania", tier: 1, labels: ["business", "stem", "social"] },
  { name: "Caltech", tier: 1, labels: ["stem"] },
  { name: "Brown University", tier: 1, labels: ["humanities", "arts", "social"] },
  { name: "Duke University", tier: 1, labels: ["sports", "health", "business"] },
  { name: "Northwestern University", tier: 1, labels: ["business", "stem", "arts"] },
  { name: "Cornell University", tier: 1, labels: ["stem", "business", "health"] },
  { name: "Johns Hopkins University", tier: 1, labels: ["health", "stem", "social"] },
  { name: "Rice University", tier: 1, labels: ["stem", "arts", "humanities"] },
  { name: "Vanderbilt University", tier: 1, labels: ["social", "health", "business"] },
  { name: "Notre Dame", tier: 1, labels: ["business", "humanities", "social"] },
  { name: "Georgetown University", tier: 1, labels: ["social", "business", "humanities"] },
  { name: "Carnegie Mellon", tier: 1, labels: ["stem", "business", "arts"] },
  { name: "University of California, Berkeley", tier: 1, labels: ["stem", "business"] },
  { name: "University of California, Los Angeles", tier: 1, labels: ["arts", "business", "stem"] },
  { name: "University of Michigan", tier: 1, labels: ["business", "stem", "health"] },
  { name: "University of Southern California", tier: 1, labels: ["arts", "business", "stem"] },
  { name: "NYU", tier: 1, labels: ["arts", "business", "social"] },

  // Tier 2 - Very Selective
  { name: "Emory University", tier: 2, labels: ["health", "business", "social"] },
  { name: "Washington University in St. Louis", tier: 2, labels: ["business", "stem", "health"] },
  { name: "University of Virginia", tier: 2, labels: ["business", "humanities", "social"] },
  { name: "Georgia Tech", tier: 2, labels: ["stem", "business"] },
  { name: "University of Florida", tier: 2, labels: ["business", "stem", "health"] },
  { name: "University of North Carolina at Chapel Hill", tier: 2, labels: ["health", "social", "business"] },
  { name: "University of Texas at Austin", tier: 2, labels: ["business", "stem", "arts"] },
  { name: "Boston College", tier: 2, labels: ["business", "humanities", "social"] },
  { name: "Boston University", tier: 2, labels: ["arts", "business", "health"] },
  { name: "College of William & Mary", tier: 2, labels: ["humanities", "social", "stem"] },
  { name: "Wake Forest University", tier: 2, labels: ["business", "health", "humanities"] },
  { name: "University of Wisconsin-Madison", tier: 2, labels: ["stem", "business", "social"] },
  { name: "University of Washington", tier: 2, labels: ["stem", "health", "business"] },
  { name: "University of Illinois at Urbana-Champaign", tier: 2, labels: ["stem", "business"] },
  { name: "Ohio State University", tier: 2, labels: ["stem", "business", "health"] },
  { name: "University of Maryland", tier: 2, labels: ["stem", "business", "social"] },
  { name: "University of Rochester", tier: 2, labels: ["stem", "arts", "health"] },
  { name: "Case Western Reserve University", tier: 2, labels: ["stem", "health", "business"] },
  { name: "Tulane University", tier: 2, labels: ["business", "health", "social"] },
  { name: "University of Georgia", tier: 2, labels: ["business", "social", "arts"] },

  // Tier 3 - Selective
  { name: "University of Miami", tier: 3, labels: ["business", "arts", "health"] },
  { name: "University of Colorado Boulder", tier: 3, labels: ["stem", "arts", "business"] },
  { name: "University of Minnesota Twin Cities", tier: 3, labels: ["stem", "business", "health"] },
  { name: "University of Pittsburgh", tier: 3, labels: ["health", "business", "stem"] },
  { name: "University of Arizona", tier: 3, labels: ["stem", "arts", "social"] },
  { name: "University of Utah", tier: 3, labels: ["stem", "health", "arts"] },
  { name: "Arizona State University", tier: 3, labels: ["stem", "business", "arts"] },
  { name: "University of California, Davis", tier: 3, labels: ["stem", "health", "arts"] },
  { name: "University of California, San Diego", tier: 3, labels: ["stem", "health", "social"] },
  { name: "University of California, Irvine", tier: 3, labels: ["stem", "business", "arts"] },
  { name: "University of California, Santa Barbara", tier: 3, labels: ["stem", "arts", "social"] },
  { name: "University of California, Santa Cruz", tier: 3, labels: ["stem", "arts", "humanities"] },
  { name: "Penn State University", tier: 3, labels: ["stem", "business", "social"] },
  { name: "Rutgers University", tier: 3, labels: ["stem", "business", "health"] },
  { name: "University of Connecticut", tier: 3, labels: ["business", "health", "stem"] },
  { name: "University of Iowa", tier: 3, labels: ["business", "health", "arts"] },
  { name: "University of Kansas", tier: 3, labels: ["business", "health", "arts"] },
  { name: "University of Nebraska-Lincoln", tier: 3, labels: ["business", "stem", "arts"] },
  { name: "University of Oklahoma", tier: 3, labels: ["business", "social", "arts"] },
  { name: "University of Tennessee", tier: 3, labels: ["business", "health", "social"] },

  // Tier 4 - Moderate
  { name: "University of South Florida", tier: 4, labels: ["business", "health", "arts"] },
  { name: "University of Louisville", tier: 4, labels: ["health", "business", "arts"] },
  { name: "University of Arkansas", tier: 4, labels: ["business", "stem", "social"] },
  { name: "University of Mississippi", tier: 4, labels: ["business", "social", "arts"] },
  { name: "University of Nevada, Las Vegas", tier: 4, labels: ["business", "arts", "social"] },
  { name: "University of New Mexico", tier: 4, labels: ["arts", "social", "health"] },
  { name: "University of Alaska Anchorage", tier: 4, labels: ["stem", "social", "arts"] },
  { name: "University of Hawaii at Manoa", tier: 4, labels: ["arts", "social", "stem"] },
];

export function getRecommendedSchools(selectedInterests: string[], userGPA?: string): string[] {
  let filtered = universities;

  if (userGPA) {
    const gpaThreshold = parseFloat(userGPA);
    filtered = universities.filter(u => u.tier <= 4 - Math.floor(gpaThreshold - 2.5));
  }

  if (selectedInterests.length === 0) return filtered.slice(0, 3).map(s => s.name);

  const scored = filtered.map(school => {
    const matchCount = school.labels.filter(label => selectedInterests.includes(label)).length;
    return { ...school, matchCount };
  }).sort((a, b) => b.matchCount - a.matchCount);

  return scored.slice(0, 3).map(s => s.name);
}

export function getRecommendedMajors(selectedInterests: string[]): string[] {
  if (selectedInterests.length === 0) {
    return ["Explore majors →"];
  }

  const interestToMajors: Record<string, string[]> = {
    stem: ["Computer Science", "Electrical Engineering", "Data Science", "Mathematics"],
    business: ["Business Analytics", "Economics", "Finance", "Marketing"],
    arts: ["Visual Arts", "Film & Media", "Music", "Design"],
    social: ["International Relations", "Political Science", "Sociology", "Psychology"],
    health: ["Biology", "Neuroscience", "Pre-Medicine", "Public Health"],
    humanities: ["Literature", "History", "Philosophy", "Comparative Literature"],
  };

  const majors: string[] = [];
  selectedInterests.forEach(interest => {
    if (interestToMajors[interest]) {
      majors.push(...interestToMajors[interest]);
    }
  });

  return [...new Set(majors)].slice(0, 3);
}
