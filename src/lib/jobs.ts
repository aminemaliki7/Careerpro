// src/lib/jobs.ts
import { Job, JobFilters, JobSearchParams } from '@/types/job';

// Sample job data - you'll replace this with your manually curated jobs
const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    description: 'Join our team to build the next generation of web applications. You will work with cutting-edge technologies and collaborate with talented engineers to create amazing user experiences.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong understanding of web performance optimization',
      'Experience with modern build tools and CI/CD pipelines',
      'Bachelor\'s degree in Computer Science or equivalent'
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    salary: {
      min: 150000,
      max: 200000,
      currency: 'USD',
      period: 'year'
    },
    benefits: ['Health Insurance', 'Stock Options', 'Remote Work', '401k Matching'],
    applyUrl: 'https://careers.google.com/jobs/results/123456789',
    companyUrl: 'https://google.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    postedDate: '2025-09-10',
    isRemote: false,
    experienceLevel: 'Senior Level',
    department: 'Engineering',
    featured: true,
    sponsored: false,
    companySize: 'Enterprise',
    industry: 'Technology',
    tags: ['frontend', 'react', 'javascript', 'web-development']
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Build and scale payment infrastructure that powers millions of businesses worldwide. Work on complex distributed systems and help shape the future of online commerce.',
    requirements: [
      '3+ years of full-stack development experience',
      'Experience with Ruby, Python, or Go',
      'Strong database design and optimization skills',
      'Experience with microservices architecture'
    ],
    skills: ['Ruby', 'Python', 'PostgreSQL', 'Redis', 'Kubernetes'],
    salary: {
      min: 140000,
      max: 180000,
      currency: 'USD',
      period: 'year'
    },
    benefits: ['Equity', 'Health Insurance', 'Unlimited PTO', 'Learning Budget'],
    applyUrl: 'https://stripe.com/jobs/listing/full-stack-engineer',
    companyUrl: 'https://stripe.com',
    logo: 'https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg',
    postedDate: '2025-09-12',
    isRemote: true,
    experienceLevel: 'Mid Level',
    department: 'Engineering',
    featured: true,
    sponsored: false,
    companySize: 'Large',
    industry: 'FinTech',
    tags: ['fullstack', 'backend', 'api', 'payments']
  },
  {
    id: '3',
    title: 'Product Designer',
    company: 'Figma',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help design the future of design tools. Work closely with product and engineering teams to create intuitive and powerful experiences for millions of designers worldwide.',
    requirements: [
      '4+ years of product design experience',
      'Strong portfolio showcasing UX/UI design skills',
      'Experience with design systems and component libraries',
      'Proficiency in Figma, Sketch, or similar tools'
    ],
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Interaction Design'],
    salary: {
      min: 120000,
      max: 160000,
      currency: 'USD',
      period: 'year'
    },
    benefits: ['Stock Options', 'Health Insurance', 'Remote Work', 'Design Equipment'],
    applyUrl: 'https://www.figma.com/careers/job/5678901234',
    companyUrl: 'https://figma.com',
    logo: 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png',
    postedDate: '2025-09-08',
    isRemote: true,
    experienceLevel: 'Mid Level',
    department: 'Design',
    featured: true,
    sponsored: false,
    companySize: 'Medium',
    industry: 'Design Tools',
    tags: ['design', 'ux', 'ui', 'product-design', 'figma']
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Full-time',
    description: 'Scale the infrastructure that delivers entertainment to 200M+ subscribers worldwide. Work with cutting-edge cloud technologies and help maintain 99.9% uptime.',
    requirements: [
      '5+ years of DevOps/SRE experience',
      'Experience with AWS, Docker, and Kubernetes',
      'Strong scripting skills (Python, Bash)',
      'Experience with monitoring and observability tools'
    ],
    skills: ['AWS', 'Kubernetes', 'Docker', 'Python', 'Terraform', 'Grafana'],
    salary: {
      min: 160000,
      max: 220000,
      currency: 'USD',
      period: 'year'
    },
    benefits: ['Stock Options', 'Health Insurance', 'Flexible Hours', 'Netflix Content'],
    applyUrl: 'https://jobs.netflix.com/jobs/devops-engineer-123',
    companyUrl: 'https://netflix.com',
    logo: 'https://assets.nflxext.com/ffe/siteui/common/icons/nficon2023.svg',
    postedDate: '2025-09-14',
    isRemote: false,
    experienceLevel: 'Senior Level',
    department: 'Engineering',
    featured: true,
    sponsored: false,
    companySize: 'Enterprise',
    industry: 'Streaming',
    tags: ['devops', 'cloud', 'infrastructure', 'aws', 'kubernetes']
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Use data to improve the travel experience for millions of guests and hosts. Build machine learning models, conduct experiments, and drive data-informed product decisions.',
    requirements: [
      '3+ years of data science experience',
      'Strong statistics and machine learning background',
      'Proficiency in Python and SQL',
      'Experience with A/B testing and experimentation'
    ],
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Spark', 'Tableau'],
    salary: {
      min: 130000,
      max: 170000,
      currency: 'USD',
      period: 'year'
    },
    benefits: ['Equity', 'Health Insurance', 'Travel Credits', 'Learning Budget'],
    applyUrl: 'https://careers.airbnb.com/positions/data-scientist-456',
    companyUrl: 'https://airbnb.com',
    logo: 'https://a0.muscache.com/airbnb/static/logos/belo-200.png',
    postedDate: '2025-09-11',
    isRemote: true,
    experienceLevel: 'Mid Level',
    department: 'Data',
    featured: true,
    sponsored: false,
    companySize: 'Large',
    industry: 'Travel',
    tags: ['data-science', 'machine-learning', 'python', 'analytics']
  },
  {
    id: '6',
    title: 'Marketing Manager',
    company: 'HubSpot',
    location: 'Boston, MA',
    type: 'Full-time',
    description: 'Lead marketing campaigns for our growing SaaS platform. Drive customer acquisition, engagement, and retention through data-driven marketing strategies.',
    requirements: [
      '4+ years of B2B marketing experience',
      'Experience with marketing automation platforms',
      'Strong analytical and project management skills',
      'Content marketing and SEO expertise'
    ],
    skills: ['Marketing Automation', 'SEO', 'Content Marketing', 'Analytics', 'A/B Testing'],
    salary: {
      min: 90000,
      max: 120000,
      currency: 'USD',
      period: 'year'
    },
    benefits: ['Health Insurance', 'Stock Options', 'Flexible PTO', 'Professional Development'],
    applyUrl: 'https://www.hubspot.com/careers/marketing-manager-789',
    companyUrl: 'https://hubspot.com',
    logo: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
    postedDate: '2025-09-13',
    isRemote: true,
    experienceLevel: 'Mid Level',
    department: 'Marketing',
    featured: true,
    sponsored: false,
    companySize: 'Large',
    industry: 'SaaS',
    tags: ['marketing', 'b2b', 'saas', 'growth', 'automation']
  }
];

// Utility functions
export function getAllJobs(): Job[] {
  return sampleJobs;
}

export function getFeaturedJobs(limit: number = 6): Job[] {
  return sampleJobs
    .filter(job => job.featured)
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, limit);
}

export function getRecentJobs(limit: number = 10): Job[] {
  return sampleJobs
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, limit);
}

export function getJobById(id: string): Job | undefined {
  return sampleJobs.find(job => job.id === id);
}

export function searchJobs(params: JobSearchParams): { jobs: Job[], total: number } {
  let filteredJobs = [...sampleJobs];

  // Text search
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.skills.some(skill => skill.toLowerCase().includes(query))
    );
  }

  // Apply filters
  if (params.filters) {
    const { location, type, experienceLevel, department, salary, remote, company, skills } = params.filters;

    if (location && location.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        location.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()))
      );
    }

    if (type && type.length > 0) {
      filteredJobs = filteredJobs.filter(job => type.includes(job.type));
    }

    if (experienceLevel && experienceLevel.length > 0) {
      filteredJobs = filteredJobs.filter(job => experienceLevel.includes(job.experienceLevel));
    }

    if (department && department.length > 0) {
      filteredJobs = filteredJobs.filter(job => department.includes(job.department));
    }

    if (remote !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.isRemote === remote);
    }

    if (company && company.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        company.some(comp => job.company.toLowerCase().includes(comp.toLowerCase()))
      );
    }

    if (skills && skills.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        skills.some(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (salary) {
      if (salary.min) {
        filteredJobs = filteredJobs.filter(job => 
          job.salary && job.salary.min >= salary.min!
        );
      }
      if (salary.max) {
        filteredJobs = filteredJobs.filter(job => 
          job.salary && job.salary.max <= salary.max!
        );
      }
    }
  }

  // Sorting
  if (params.sortBy) {
    filteredJobs.sort((a, b) => {
      let comparison = 0;
      
      switch (params.sortBy) {
        case 'date':
          comparison = new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
          break;
        case 'salary':
          const aSalary = a.salary?.max || 0;
          const bSalary = b.salary?.max || 0;
          comparison = bSalary - aSalary;
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
        default: // relevance
          // For relevance, prioritize featured jobs and recent posts
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          comparison = new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
      
      return params.sortOrder === 'asc' ? -comparison : comparison;
    });
  }

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const startIndex = (page - 1) * limit;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + limit);

  return {
    jobs: paginatedJobs,
    total: filteredJobs.length
  };
}

export function getJobsByCompany(company: string, limit: number = 10): Job[] {
  return sampleJobs
    .filter(job => job.company.toLowerCase().includes(company.toLowerCase()))
    .slice(0, limit);
}

export function getJobsBySkill(skill: string, limit: number = 10): Job[] {
  return sampleJobs
    .filter(job => 
      job.skills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase())
      )
    )
    .slice(0, limit);
}

export function getJobsByDepartment(department: string, limit: number = 10): Job[] {
  return sampleJobs
    .filter(job => job.department.toLowerCase() === department.toLowerCase())
    .slice(0, limit);
}

export function getUniqueValues() {
  const companies = [...new Set(sampleJobs.map(job => job.company))].sort();
  const locations = [...new Set(sampleJobs.map(job => job.location))].sort();
  const skills = [...new Set(sampleJobs.flatMap(job => job.skills))].sort();
  const departments = [...new Set(sampleJobs.map(job => job.department))].sort();
  const types = [...new Set(sampleJobs.map(job => job.type))].sort();
  const experienceLevels = [...new Set(sampleJobs.map(job => job.experienceLevel))].sort();

  return {
    companies,
    locations,
    skills,
    departments,
    types,
    experienceLevels
  };
}

// Function to add new job (for when you manually curate jobs)
export function addJob(job: Omit<Job, 'id'>): Job {
  const newJob: Job = {
    ...job,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  };
  
  sampleJobs.unshift(newJob);
  return newJob;
}

// Helper function to format job posting for easy manual entry
export function createJobTemplate(): Partial<Job> {
  return {
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: [],
    skills: [],
    salary: {
      min: 0,
      max: 0,
      currency: 'USD',
      period: 'year'
    },
    benefits: [],
    applyUrl: '',
    companyUrl: '',
    logo: '',
    postedDate: new Date().toISOString().split('T')[0],
    isRemote: false,
    experienceLevel: 'Mid Level',
    department: 'Engineering',
    featured: false,
    sponsored: false,
    companySize: 'Medium',
    industry: '',
    tags: []
  };
}