/**
 * PROJECT CONFIGURATION INTERFACE
 * 
 * TypeScript interface for project configuration.
 * এই file সব প্রোজেক্টে একই থাকবে।
 * 
 * File Location: src/types/project.interface.ts
 */

export interface ProjectConfig {
  // Basic Info
  projectName: string;
  projectTagline: string;
  projectDescription: string;
  
  // Mission & Vision
  mission: {
    title: string;
    description: string;
    problemsSolved: Array<{
      title: string;
      description: string;
    }>;
  };
  
  // Overview
  overview: {
    paragraphs: string[];
  };
  
  // Features (Role-based)
  features: {
    admin?: Array<{
      title: string;
      description: string;
      icon: string; // Lucide icon name
    }>;
    user?: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    // Add more roles as needed
    [key: string]: Array<{
      title: string;
      description: string;
      icon: string;
    }> | undefined;
  };
  
  // Technology Stack
  techStack: {
    frontend: string[];
    backend: string[];
    services: string[];
  };
  
  // GitHub Repositories (Project-specific)
  repositories: {
    frontend?: {
      name: string;
      description: string;
      url: string;
    };
    backend?: {
      name: string;
      description: string;
      url: string;
    };
    // Add more repos as needed
    [key: string]: {
      name: string;
      description: string;
      url: string;
    } | undefined;
  };
  
  // Homepage About Section
  homepageAbout: {
    smallHeading: string;
    mainHeading: string;
    subDescription: string;
    bulletPoints: string[];
    sinceYear: string;
    sinceDescription: string;
    aboutImage: string;
    learnMoreLink: string;
  };
}


