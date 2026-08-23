// src/lib/ats.ts
// Shared ATS scoring engine. Used by both the applicant-facing
// /api/jobs/ats-check route and the /api/applications/save route so the
// score a candidate sees and the score stored on their application always
// come from the same logic.

// --- EXTENDED SKILL DATABASE ---
const skillCategories: Record<string, Record<string, string[]>> = {
  frontend: {
    react: ['react', 'reactjs', 'react.js'],
    vue: ['vue', 'vuejs', 'vue.js'],
    angular: ['angular', 'angularjs', 'angular.js'],
    svelte: ['svelte'],
    html: ['html', 'html5'],
    css: ['css', 'css3', 'sass', 'scss', 'less'],
    tailwind: ['tailwind', 'tailwindcss'],
    bootstrap: ['bootstrap'],
  },
  backend: {
    nodejs: ['node', 'nodejs', 'node.js'],
    python: ['python', 'python3', 'python 3'],
    java: ['java'],
    csharp: ['c#', 'csharp', 'c sharp', 'dotnet', '.net'],
    php: ['php', 'laravel', 'symfony'],
    golang: ['go', 'golang'],
    rust: ['rust'],
    ruby: ['ruby', 'rails', 'ruby on rails'],
  },
  language: {
    javascript: ['javascript', 'js'],
    typescript: ['typescript', 'ts'],
  },
  database: {
    sql: ['sql'],
    mysql: ['mysql'],
    postgresql: ['postgresql', 'postgres'],
    mongodb: ['mongodb', 'mongo'],
    firebase: ['firebase'],
    redis: ['redis'],
  },
  devops: {
    docker: ['docker'],
    kubernetes: ['kubernetes', 'k8s'],
    aws: ['aws', 'amazon'],
    gcp: ['gcp', 'google cloud', 'google'],
    azure: ['azure', 'microsoft azure'],
    git: ['git', 'github', 'gitlab', 'bitbucket'],
    'ci/cd': ['ci/cd', 'cicd', 'jenkins', 'github actions'],
  },
  tools: {
    linux: ['linux', 'ubuntu', 'centos'],
    postman: ['postman'],
    figma: ['figma'],
    jira: ['jira'],
    slack: ['slack'],
  },
  soft: {
    communication: ['communication', 'communication skills', 'interpersonal'],
    teamwork: ['teamwork', 'collaboration', 'team work', 'collaborative'],
    leadership: ['leadership', 'leader', 'leading'],
    'problem-solving': ['problem solving', 'problem-solving', 'analytical'],
    'time-management': ['time management', 'time-management'],
  },
};

function flattenSkillAliases(): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const category of Object.values(skillCategories)) {
    for (const [mainSkill, aliases] of Object.entries(category)) {
      for (const alias of aliases) {
        flat[alias.toLowerCase()] = mainSkill;
      }
    }
  }
  return flat;
}

const skillAliasMap = flattenSkillAliases();

function extractSkillsFromText(text: string): { skills: Set<string>; byCategory: Record<string, string[]> } {
  const lowerText = text.toLowerCase();
  const foundSkills = new Set<string>();
  const byCategory: Record<string, string[]> = {};

  for (const [alias, mainSkill] of Object.entries(skillAliasMap)) {
    const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(lowerText)) {
      foundSkills.add(mainSkill);
      for (const [category, skills] of Object.entries(skillCategories)) {
        for (const [skillName] of Object.entries(skills)) {
          if (skillName === mainSkill) {
            if (!byCategory[category]) byCategory[category] = [];
            byCategory[category].push(mainSkill);
          }
        }
      }
    }
  }

  return { skills: foundSkills, byCategory };
}

function extractWorkExperience(cvText: string): {
  hasWorkExperience: boolean;
  yearsOfExperience: number;
  jobTitles: string[];
  companies: string[];
} {
  const lowerText = cvText.toLowerCase();

  const yearsMatch = lowerText.match(/(\d+)\s*\+?\s*(years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/gi);
  const yearsOfExperience = yearsMatch
    ? Math.max(...yearsMatch.map((m) => parseInt(m.match(/\d+/)?.[0] || '0')))
    : 0;

  const jobTitlePatterns = [
    'developer', 'engineer', 'architect', 'manager', 'lead', 'senior', 'junior',
    'analyst', 'designer', 'coordinator', 'specialist', 'consultant', 'director',
  ];

  const jobTitles: string[] = [];
  for (const title of jobTitlePatterns) {
    if (lowerText.includes(title)) jobTitles.push(title);
  }

  const companies: string[] = [];
  const lines = cvText.split('\n');
  for (const line of lines) {
    if (line.match(/^[A-Z][a-zA-Z\s&,.-]*$/)) companies.push(line.trim());
  }

  return {
    hasWorkExperience: yearsOfExperience > 0 || jobTitles.length > 0,
    yearsOfExperience,
    jobTitles: [...new Set(jobTitles)],
    companies: [...new Set(companies)].slice(0, 5),
  };
}

function extractEducation(cvText: string): {
  hasEducation: boolean;
  degrees: string[];
  certifications: string[];
} {
  const lowerText = cvText.toLowerCase();

  const degreePatterns = ['bachelor', 'master', 'phd', 'associate', 'diploma', 'b.s', 'm.s', 'b.a', 'm.a'];
  const degrees = degreePatterns.filter((pattern) => lowerText.includes(pattern));

  const certificationPatterns = [
    'certified', 'certification', 'certificate', 'aws certified', 'google certified',
    'microsoft certified', 'oracle certified', 'comptia',
  ];
  const certifications = certificationPatterns.filter((pattern) => lowerText.includes(pattern));

  return {
    hasEducation: degrees.length > 0 || certifications.length > 0,
    degrees: [...new Set(degrees)],
    certifications: [...new Set(certifications)],
  };
}

function analyzeKeywordDensity(cvText: string, jobDescription: string): {
  matchedKeywords: string[];
  keywordScore: number;
} {
  if (!jobDescription) return { matchedKeywords: [], keywordScore: 0 };

  const lowerCv = cvText.toLowerCase();
  const lowerDesc = jobDescription.toLowerCase();

  const keywords = lowerDesc.match(/\b[a-z]{4,}\b/g) || [];
  const uniqueKeywords = [...new Set(keywords)];

  const matchedKeywords = uniqueKeywords.filter((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    return regex.test(lowerCv);
  });

  const keywordScore = uniqueKeywords.length > 0
    ? Math.round((matchedKeywords.length / uniqueKeywords.length) * 100)
    : 0;

  return { matchedKeywords: matchedKeywords.slice(0, 10), keywordScore };
}

function analyzeSkillsMatch(cvText: string, requiredSkills: string[]): {
  matchedSkills: string[];
  missingSkills: string[];
  skillMatchPercentage: number;
  skillsByCategory: Record<string, string[]>;
} {
  const { skills: cvSkills, byCategory } = extractSkillsFromText(cvText);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of requiredSkills) {
    const normalized = skill.toLowerCase().trim();
    if (cvSkills.has(normalized) || skillAliasMap[normalized]) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const matchPercentage = requiredSkills.length > 0
    ? Math.round((matched.length / requiredSkills.length) * 100)
    : 0;

  return {
    matchedSkills: matched,
    missingSkills: missing,
    skillMatchPercentage: matchPercentage,
    skillsByCategory: byCategory,
  };
}

function generateStrengths(
  cvText: string,
  matchedSkills: string[],
  experience: ReturnType<typeof extractWorkExperience>,
  education: ReturnType<typeof extractEducation>
): string[] {
  const strengths: string[] = [];

  if (matchedSkills.length >= 5) {
    strengths.push(`Excellent technical foundation with ${matchedSkills.length} relevant skills`);
  } else if (matchedSkills.length > 0) {
    strengths.push(`Solid technical foundation with ${matchedSkills.length} key skills`);
  }

  if (experience.yearsOfExperience >= 5) {
    strengths.push(`${experience.yearsOfExperience}+ years of professional experience`);
  } else if (experience.yearsOfExperience >= 1) {
    strengths.push(`${experience.yearsOfExperience} years of hands-on experience`);
  }

  if (experience.companies.length > 0) {
    strengths.push(`Proven experience at established companies and organizations`);
  }

  if (education.hasEducation && education.degrees.length > 0) {
    strengths.push(`Strong educational background with formal degrees`);
  }

  if (cvText.toLowerCase().includes('project') || cvText.toLowerCase().includes('built')) {
    strengths.push(`Track record of delivering successful projects`);
  }

  if (cvText.toLowerCase().match(/\d+%|improved|increased|reduced|optimized/i)) {
    strengths.push(`Quantifiable achievements and measurable impact`);
  }

  return strengths.slice(0, 6);
}

function generateRecommendations(
  cvText: string,
  missingSkills: string[],
  experience: ReturnType<typeof extractWorkExperience>,
  keywordScore: number
): string[] {
  const recommendations: string[] = [];

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 2).join(' or ');
    recommendations.push(`Highlight or develop experience with: ${topMissing}`);
  }

  if (experience.yearsOfExperience === 0) {
    recommendations.push(`Add clear work experience section with dates and job titles`);
  } else if (experience.yearsOfExperience < 2) {
    recommendations.push(`Expand work experience section with more detailed project descriptions`);
  }

  if (!cvText.toLowerCase().includes('achievement') && !cvText.toLowerCase().match(/\d+%/)) {
    recommendations.push(`Quantify your accomplishments with metrics and measurable results`);
  }

  if (keywordScore < 50) {
    recommendations.push(`Incorporate more relevant keywords from the job description`);
  }

  if (!cvText.toLowerCase().includes('summary') && !cvText.toLowerCase().includes('objective')) {
    recommendations.push(`Add a professional summary at the top of your CV`);
  }

  if (missingSkills.length >= 5) {
    recommendations.push(`Consider taking online courses to bridge skill gaps`);
  }

  return recommendations.slice(0, 5);
}

function calculateATSScore(
  skillMatchPercentage: number,
  experience: ReturnType<typeof extractWorkExperience>,
  education: ReturnType<typeof extractEducation>,
  keywordScore: number,
  cvLength: number
): { score: number; breakdown: Record<string, number> } {
  let experienceScore = 0;
  if (experience.yearsOfExperience >= 5) experienceScore = 90;
  else if (experience.yearsOfExperience >= 3) experienceScore = 70;
  else if (experience.yearsOfExperience >= 1) experienceScore = 50;
  else if (experience.hasWorkExperience) experienceScore = 30;

  const educationScore = education.hasEducation ? 30 : 0;
  const contentScore = Math.min(100, (cvLength / 1500) * 100);

  const weights = {
    skillMatch: 0.35,
    experience: 0.25,
    keywords: 0.2,
    education: 0.1,
    content: 0.1,
  };

  const totalScore =
    skillMatchPercentage * weights.skillMatch +
    experienceScore * weights.experience +
    keywordScore * weights.keywords +
    educationScore * weights.education +
    contentScore * weights.content;

  return {
    score: Math.round(totalScore),
    breakdown: {
      skillMatch: Math.round(skillMatchPercentage * weights.skillMatch),
      experience: Math.round(experienceScore * weights.experience),
      keywords: Math.round(keywordScore * weights.keywords),
      education: Math.round(educationScore * weights.education),
      content: Math.round(contentScore * weights.content),
    },
  };
}

function generateDetailedSummary(
  score: number,
  matchedSkills: string[],
  missingSkills: string[],
  experience: ReturnType<typeof extractWorkExperience>,
  jobTitle: string,
  company: string
): string {
  let verdict = '';
  let recommendation = '';

  if (score >= 85) {
    verdict = 'Excellent match';
    recommendation = 'You should strongly consider applying.';
  } else if (score >= 70) {
    verdict = 'Good match';
    recommendation = 'You are well-qualified for this position.';
  } else if (score >= 55) {
    verdict = 'Moderate match';
    recommendation = 'You have relevant skills but may face competition.';
  } else if (score >= 40) {
    verdict = 'Potential fit';
    recommendation = 'You could succeed but should strengthen key areas.';
  } else {
    verdict = 'Limited match';
    recommendation = 'Consider developing more relevant skills first.';
  }

  return `${verdict} for ${jobTitle} at ${company} (Score: ${score}/100). ${recommendation} You have ${matchedSkills.length} of the required skills${experience.yearsOfExperience > 0 ? ` and ${experience.yearsOfExperience}+ years of experience` : ''}.`;
}

export interface ATSAnalysis {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  recommendations: string[];
  summary: string;
  detailed: {
    scoreBreakdown: Record<string, number>;
    experience: {
      yearsOfExperience: number;
      jobTitles: string[];
      companies: string[];
    };
    education: {
      degrees: string[];
      certifications: string[];
    };
    keywords: {
      matched: string[];
      score: number;
    };
    skillsByCategory: Record<string, string[]>;
  };
}

/**
 * Runs the full ATS analysis for a CV against a job. Requires at least 50
 * characters of CV text; requirements/skills/description are all optional
 * but improve accuracy when supplied.
 */
export function runATSAnalysis(params: {
  cvText: string;
  jobTitle: string;
  company: string;
  requirements?: string[];
  description?: string;
  skills?: string[];
}): ATSAnalysis {
  const { cvText, jobTitle, company, requirements, description, skills } = params;

  const allRequiredSkills = [
    ...(Array.isArray(skills) ? skills : []),
    ...(Array.isArray(requirements) ? requirements : []),
  ].filter((s) => s && s.trim());

  const skillsAnalysis = analyzeSkillsMatch(cvText, allRequiredSkills);
  const experience = extractWorkExperience(cvText);
  const education = extractEducation(cvText);
  const keywordAnalysis = analyzeKeywordDensity(cvText, description || '');

  const atsScore = calculateATSScore(
    skillsAnalysis.skillMatchPercentage,
    experience,
    education,
    keywordAnalysis.keywordScore,
    cvText.length
  );

  const strengths = generateStrengths(cvText, skillsAnalysis.matchedSkills, experience, education);
  const recommendations = generateRecommendations(cvText, skillsAnalysis.missingSkills, experience, keywordAnalysis.keywordScore);
  const summary = generateDetailedSummary(atsScore.score, skillsAnalysis.matchedSkills, skillsAnalysis.missingSkills, experience, jobTitle, company);

  return {
    matchScore: atsScore.score,
    matchedSkills: skillsAnalysis.matchedSkills,
    missingSkills: skillsAnalysis.missingSkills,
    strengths,
    recommendations,
    summary,
    detailed: {
      scoreBreakdown: atsScore.breakdown,
      experience: {
        yearsOfExperience: experience.yearsOfExperience,
        jobTitles: experience.jobTitles,
        companies: experience.companies,
      },
      education: {
        degrees: education.degrees,
        certifications: education.certifications,
      },
      keywords: {
        matched: keywordAnalysis.matchedKeywords,
        score: keywordAnalysis.keywordScore,
      },
      skillsByCategory: skillsAnalysis.skillsByCategory,
    },
  };
}