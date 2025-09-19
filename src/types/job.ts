export interface Job {
  title: string
  company: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship'
  experience_level?: string
  salary_range?: string
  description: string
  requirements: string[]
  benefits: string[]
  skills: string[]
  remote: boolean
  featured: boolean
  contact_email?: string
  application_url?: string
  posted_date: string
  updated_date?: string
}