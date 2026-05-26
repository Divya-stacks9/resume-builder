export interface AnalysisReport {
  score: number;
  breakdown: {
    contactInfo: number;
    skills: number;
    experience: number;
    education: number;
    keywordMatch: number;
    formatting: number;
    actionVerbs: number;
  };
  detectedSkills: {
    languages: string[];
    frameworks: string[];
    databasesCloud: string[];
    tools: string[];
    softSkills: string[];
  };
  missingKeywords: string[];
  matchedKeywords: string[];
  improvementTips: {
    category: 'contact' | 'skills' | 'experience' | 'education' | 'formatting' | 'impact';
    tip: string;
    action: string;
  }[];
  professionalSummary: string;
}

// Predefined skill lists for rule-based matching
const SKILL_DATABASE = {
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'php', 'html', 'css', 'sql', 'bash', 'shell', 'swift', 'kotlin', 'r', 'dart', 'scala'
  ],
  frameworks: [
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt.js', 'express', 'nestjs',
    'django', 'flask', 'spring boot', 'rails', 'laravel', 'tailwind', 'bootstrap',
    'fastapi', 'remix', 'gatsby', 'flutter', 'react native'
  ],
  databasesCloud: [
    'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'dynamodb', 'cassandra',
    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'firebase', 'supabase',
    'cloudflare', 'heroku', 'terraform', 'elasticsearch'
  ],
  tools: [
    'git', 'github', 'gitlab', 'jira', 'figma', 'webpack', 'vite', 'npm', 'yarn', 'pnpm',
    'vscode', 'postman', 'jenkins', 'circleci', 'github actions', 'trello', 'slack', 'notion'
  ],
  softSkills: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'agile', 'scrum', 'collaboration', 'creativity', 'time management', 'mentoring',
    'adaptability', 'negotiation', 'project management', 'conflict resolution'
  ]
};

// Role-specific keyword mapping
const ROLE_KEYWORDS: Record<string, string[]> = {
  frontend: [
    'react', 'vue', 'angular', 'html', 'css', 'typescript', 'javascript', 'tailwind',
    'webpack', 'next.js', 'responsive design', 'ui/ux', 'sass', 'svelte', 'accessibility',
    'browser developer tools', 'single page applications', 'dom manipulation', 'state management'
  ],
  backend: [
    'node.js', 'express', 'python', 'java', 'postgresql', 'mysql', 'mongodb', 'redis',
    'sql', 'apis', 'rest', 'graphql', 'docker', 'aws', 'microservices', 'scaling',
    'system design', 'django', 'fastapi', 'spring boot', 'serverless', 'caching'
  ],
  fullstack: [
    'react', 'node.js', 'express', 'postgresql', 'tailwind', 'typescript', 'javascript',
    'apis', 'git', 'aws', 'docker', 'database', 'frontend', 'backend', 'system architecture',
    'rest api', 'next.js'
  ],
  data: [
    'python', 'r', 'sql', 'pandas', 'numpy', 'machine learning', 'deep learning',
    'tensorflow', 'pytorch', 'scikit-learn', 'tableau', 'power bi', 'data analysis',
    'spark', 'statistics', 'data visualization', 'nlp', 'big data', 'hadoop'
  ],
  devops: [
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'terraform',
    'ansible', 'linux', 'bash', 'git', 'monitoring', 'prometheus', 'grafana', 'cloud',
    'security', 'infrastructure as code', 'nginx'
  ],
  mobile: [
    'swift', 'kotlin', 'java', 'react native', 'flutter', 'ios', 'android', 'xcode',
    'android studio', 'mobile app development', 'app store', 'play store', 'cocoapods'
  ],
  pm: [
    'product lifecycle', 'product roadmap', 'agile', 'scrum', 'jira', 'wireframes',
    'product analytics', 'strategy', 'stakeholder management', 'user research', 'user stories',
    'prioritization', 'kpis', 'a/b testing', 'market research'
  ]
};

const ACTION_VERBS = [
  'designed', 'developed', 'built', 'led', 'managed', 'implemented', 'optimized',
  'created', 'coordinated', 'executed', 'scaled', 'improved', 'launched', 'directed',
  'established', 'streamlined', 'automated', 'collaborated', 'analyzed', 'delivered'
];

/**
 * Analyzes resume text using heuristics and keyword matching (Fallback Mode).
 */
export function analyzeResumeRuleBased(text: string, targetRole: string): AnalysisReport {
  const normalizedText = text.toLowerCase();
  const normalizedRole = targetRole.toLowerCase();

  // 1. Evaluate Contact Info (Score out of 100)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d{1,4}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/.test(normalizedText);
  const hasGithub = /github\.com\/[a-zA-Z0-9_-]+/.test(normalizedText);
  const hasPortfolio = /(portfolio|website|myweb|\.me|\.io)/.test(normalizedText);

  let contactScore = 0;
  if (hasEmail) contactScore += 30;
  if (hasPhone) contactScore += 30;
  if (hasLinkedIn) contactScore += 15;
  if (hasGithub) contactScore += 15;
  if (hasPortfolio) contactScore += 10;

  // 2. Evaluate Skills Section (Score out of 100)
  const detectedSkills = {
    languages: [] as string[],
    frameworks: [] as string[],
    databasesCloud: [] as string[],
    tools: [] as string[],
    softSkills: [] as string[]
  };

  // Helper for boundary matching
  const findSkills = (skillsList: string[]): string[] => {
    return skillsList.filter(skill => {
      // Escape regex special chars except dots and hashes
      const safeSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // Look for skill boundaries
      const regex = new RegExp(`(?:\\b|\\s)${safeSkill}(?:\\b|\\s|\\,|\\.)`, 'i');
      return regex.test(normalizedText);
    });
  };

  detectedSkills.languages = findSkills(SKILL_DATABASE.languages);
  detectedSkills.frameworks = findSkills(SKILL_DATABASE.frameworks);
  detectedSkills.databasesCloud = findSkills(SKILL_DATABASE.databasesCloud);
  detectedSkills.tools = findSkills(SKILL_DATABASE.tools);
  detectedSkills.softSkills = findSkills(SKILL_DATABASE.softSkills);

  const totalSkillsCount = Object.values(detectedSkills).reduce((acc, curr) => acc + curr.length, 0);
  // Cap skills score: 5 skills = 50 pts, 10 skills = 80 pts, 15+ skills = 100 pts
  let skillsScore = Math.min(100, Math.round(totalSkillsCount * 6.5));
  if (totalSkillsCount >= 15) skillsScore = 100;

  // 3. Evaluate Experience Section
  const hasExperienceHeader = /(experience|employment|work history|career|professional background)/i.test(text);
  const experienceKeywords = ['job', 'company', 'position', 'role', 'team', 'project', 'responsible', 'achieved'];
  const matchedExpKeywords = experienceKeywords.filter(kw => normalizedText.includes(kw));
  
  let experienceScore = 0;
  if (hasExperienceHeader) experienceScore += 50;
  experienceScore += Math.min(50, matchedExpKeywords.length * 6);
  // Check text length: experience should be substantial
  if (text.length < 500) {
    experienceScore = Math.max(10, experienceScore - 30);
  }

  // 4. Evaluate Education Section
  const hasEducationHeader = /(education|academic|university|college|degree)/i.test(text);
  const educationKeywords = ['degree', 'gpa', 'major', 'minor', 'graduate', 'science', 'bachelor', 'master', 'phd', 'school'];
  const matchedEduKeywords = educationKeywords.filter(kw => normalizedText.includes(kw));

  let educationScore = 0;
  if (hasEducationHeader) educationScore += 60;
  educationScore += Math.min(40, matchedEduKeywords.length * 5);

  // 5. Keyword Match & Job Comparison
  let expectedKeywords: string[] = [];
  
  // Find matching role
  let matchedRoleKey = 'fullstack'; // Default fallback
  for (const key of Object.keys(ROLE_KEYWORDS)) {
    if (normalizedRole.includes(key) || key.includes(normalizedRole)) {
      matchedRoleKey = key;
      break;
    }
  }
  expectedKeywords = ROLE_KEYWORDS[matchedRoleKey];

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  expectedKeywords.forEach(kw => {
    if (normalizedText.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordMatchScore = expectedKeywords.length > 0 
    ? Math.round((matchedKeywords.length / expectedKeywords.length) * 100)
    : 70;

  // 6. Formatting & Readability
  // Simple check for document length and structure
  let formattingScore = 80; // Start with a baseline
  if (text.length < 300) formattingScore -= 30; // Too short
  if (text.length > 8000) formattingScore -= 15; // Too wordy
  if (!hasEmail || !hasPhone) formattingScore -= 10;
  if (!hasExperienceHeader && !hasEducationHeader) formattingScore -= 30;
  formattingScore = Math.max(20, formattingScore);

  // 7. Action Verbs & Measurable Achievements
  const detectedVerbs = ACTION_VERBS.filter(verb => normalizedText.includes(verb));
  const hasMetrics = /(\d+%\s*|\$\s*\d+|\d+\s*percent|\b(increased|reduced|saved|grew|managed)\s*by\s*\d+)/gi.test(text);

  let actionScore = Math.min(70, detectedVerbs.length * 6);
  if (hasMetrics) actionScore += 30;

  // 8. Overall ATS Score Calculation (Weighted)
  // Breakdown Weights:
  // - Contact Info: 10%
  // - Skills: 25%
  // - Work Experience: 25%
  // - Education: 10%
  // - Keyword Match: 15%
  // - Formatting: 5%
  // - Action Verbs: 10%
  const score = Math.round(
    (contactScore * 0.10) +
    (skillsScore * 0.25) +
    (experienceScore * 0.25) +
    (educationScore * 0.10) +
    (keywordMatchScore * 0.15) +
    (formattingScore * 0.05) +
    (actionScore * 0.10)
  );

  // 9. Generate Tips
  const improvementTips: AnalysisReport['improvementTips'] = [];

  if (!hasEmail || !hasPhone) {
    improvementTips.push({
      category: 'contact',
      tip: 'Contact Information is missing or incomplete.',
      action: 'Ensure your email and phone number are clearly visible at the top of the resume.'
    });
  }
  if (!hasLinkedIn) {
    improvementTips.push({
      category: 'contact',
      tip: 'LinkedIn Profile link is missing.',
      action: 'Add a hyperlink to your updated LinkedIn profile in the header.'
    });
  }
  if (totalSkillsCount < 6) {
    improvementTips.push({
      category: 'skills',
      tip: 'Limited number of technical skills identified.',
      action: 'Create a dedicated "Skills" section and add relevant programming languages, tools, and frameworks.'
    });
  }
  if (!hasExperienceHeader) {
    improvementTips.push({
      category: 'experience',
      tip: 'Work experience section could not be identified.',
      action: 'Structure your work experience with a clear "Professional Experience" header, list jobs in reverse chronological order.'
    });
  }
  if (!hasMetrics) {
    improvementTips.push({
      category: 'impact',
      tip: 'Lack of measurable achievements or key performance metrics.',
      action: 'Quantify your impact (e.g., "Improved load times by 30%", "Led a team of 4 developers", "Increased user retention by 15%").'
    });
  }
  if (detectedVerbs.length < 4) {
    improvementTips.push({
      category: 'impact',
      tip: 'Low frequency of action verbs in job descriptions.',
      action: 'Start your bullet points with strong action verbs like "Designed", "Spearheaded", "Optimized", "Engineered".'
    });
  }
  if (!hasEducationHeader) {
    improvementTips.push({
      category: 'education',
      tip: 'Education section is missing or poorly formatted.',
      action: 'Add an "Education" section specifying your degree, major, university name, and graduation year.'
    });
  }
  if (missingKeywords.length > 3) {
    improvementTips.push({
      category: 'formatting',
      tip: `Resume lacks critical keywords for the ${targetRole} role.`,
      action: `Integrate missing keywords such as ${missingKeywords.slice(0, 3).join(', ')} naturally into your experience and skills sections.`
    });
  }

  // 10. Generate Fallback Professional Summary
  const candidateSkills = [...detectedSkills.languages, ...detectedSkills.frameworks].slice(0, 4).join(', ');
  const capitalizedRole = targetRole.charAt(0).toUpperCase() + targetRole.slice(1);
  const professionalSummary = `Experienced professional specializing in ${targetRole} development with core competencies in ${candidateSkills || 'software engineering and problem solving'}. Demonstrated track record of delivering technical solutions and collaborating in team settings. Seeking to leverage skills in ${detectedSkills.frameworks[0] || 'modern software technologies'} to drive high-impact outcomes as a ${capitalizedRole}.`;

  return {
    score,
    breakdown: {
      contactInfo: contactScore,
      skills: skillsScore,
      experience: experienceScore,
      education: educationScore,
      keywordMatch: keywordMatchScore,
      formatting: formattingScore,
      actionVerbs: actionScore
    },
    detectedSkills,
    missingKeywords: missingKeywords.slice(0, 10), // Limit to top 10 missing
    matchedKeywords: matchedKeywords.slice(0, 10),
    improvementTips: improvementTips.length > 0 ? improvementTips : [
      {
        category: 'formatting',
        tip: 'Resume layout is generally solid.',
        action: 'Ensure your formatting remains consistent when converting and sharing your resume.'
      }
    ],
    professionalSummary
  };
}
