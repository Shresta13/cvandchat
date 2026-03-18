export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  title?: string;
  website?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string; 
}

export interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
  linkedin?: string;
}

export interface ResumeData {
  id?: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  certificates: Certificate[];
  projects: Project[];
  references: Reference[];
  selectedTemplate: string;
}
