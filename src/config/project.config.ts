/**
 * PROJECT CONFIGURATION
 * 
 * Travel Buddy Project Configuration
 * 
 * File Location: src/config/project.config.ts
 */

import { ProjectConfig } from '@/types/project.interface';

export const projectConfig: ProjectConfig = {
  // ============================================
  // BASIC PROJECT INFORMATION
  // ============================================
  projectName: "Travel Buddy",
  projectTagline: "Plan, Collaborate, and Explore Together",
  projectDescription: "Travel Buddy is a comprehensive full-stack travel planning and collaboration platform that combines AI-powered planning capabilities with robust collaboration features. The platform makes it easy for travelers to create detailed itineraries, manage expenses, coordinate meetups, and share memories with friends and fellow travelers.",

  // ============================================
  // MISSION & VISION
  // ============================================
  mission: {
    title: "Our Mission",
    description: "Travel Buddy is designed to solve critical real-world challenges in travel planning and collaboration. Our mission is to empower travelers to create unforgettable experiences by providing intelligent tools for planning, collaboration, and organization. We combine the power of AI with human creativity to help you discover new destinations, plan perfect itineraries, and travel with confidence.",
    problemsSolved: [
      {
        title: "Complex Travel Planning",
        description: "Planning trips, especially group trips, is often complicated and time-consuming. Travel Buddy simplifies this process with AI-powered itinerary generation and collaborative planning tools that make trip planning as enjoyable as the trip itself."
      },
      {
        title: "Expense Management Challenges",
        description: "Tracking and splitting expenses among travel companions can be confusing and lead to disputes. Our platform provides smart expense tracking with automatic splitting capabilities, ensuring transparency and fairness in financial management."
      },
      {
        title: "Coordination Difficulties",
        description: "Coordinating meetups and activities with multiple travelers across different locations is challenging. Travel Buddy offers meetup scheduling with Google Meet integration and real-time notifications to keep everyone connected."
      },
      {
        title: "Disconnected Travel Experience",
        description: "Travel memories and plans are often scattered across different apps and platforms. Travel Buddy brings everything together - itineraries, expenses, media galleries, meetups, and reviews - all in one comprehensive platform."
      }
    ]
  },

  // ============================================
  // OVERVIEW
  // ============================================
  overview: {
    paragraphs: [
      "Travel Buddy is a comprehensive full-stack web application designed to revolutionize how people plan, organize, and collaborate on their travel adventures. Built as a portfolio project, Travel Buddy demonstrates expertise in modern web development technologies including Next.js 16, React 19, TypeScript, and Tailwind CSS.",
      "The platform leverages advanced AI technology to generate personalized travel itineraries, making trip planning effortless and enjoyable. With robust collaboration features, travelers can invite friends, share ideas, and plan trips together with seamless real-time communication.",
      "The application integrates multiple third-party services including Stripe for subscription management, Google Meet for virtual meetups, and imgBB for image storage. Built with scalability and performance in mind, Travel Buddy uses server-side rendering, static page generation, and optimized caching strategies to deliver a fast and responsive user experience."
    ]
  },

  // ============================================
  // FEATURES (Role-based)
  // ============================================
  features: {
    admin: [
      {
        title: "User Management",
        description: "Comprehensive user management system with the ability to view, suspend, activate, verify, change roles, and delete users. Advanced filtering and pagination for efficient user administration.",
        icon: "Users"
      },
      {
        title: "Travel Plans Oversight",
        description: "View all travel plans across the platform with advanced filtering options. Feature or unfeature plans, edit plan details, and delete inappropriate content. Complete administrative control over platform content.",
        icon: "Map"
      },
      {
        title: "Subscription Management",
        description: "Monitor subscription history with detailed filters and pagination. Track subscription statuses, payment history, and subscription lifecycle across all users.",
        icon: "CreditCard"
      },
      {
        title: "Payment Analytics",
        description: "Advanced payment statistics and analytics dashboard with comprehensive charts and visualizations. Track revenue, payment trends, and financial metrics with debounced search and filtering capabilities.",
        icon: "BarChart3"
      },
      {
        title: "Dashboard Overview",
        description: "Complete administrative dashboard with system-wide statistics, charts, and quick insights. Monitor platform health, user activity, and key performance indicators.",
        icon: "LayoutDashboard"
      }
    ],
    user: [
      {
        title: "AI-Powered Planning",
        description: "Generate personalized travel itineraries using advanced AI technology. Interactive chat-based assistant helps create detailed day-by-day plans tailored to your preferences and budget.",
        icon: "Sparkles"
      },
      {
        title: "Collaborative Itinerary",
        description: "Build detailed day-by-day itineraries with activities, times, locations, and descriptions. Drag-and-drop reordering, activity categories, and seamless collaboration with travel companions.",
        icon: "Calendar"
      },
      {
        title: "Smart Expense Tracking",
        description: "Track and split expenses effortlessly among travel companions. Categorize expenses, track who paid what, view expense summaries with charts, and ensure transparent financial management.",
        icon: "Wallet"
      },
      {
        title: "Media Gallery",
        description: "Upload and organize multiple images for your travel plans. Create beautiful media galleries to share trip memories with friends and fellow travelers.",
        icon: "Image"
      },
      {
        title: "Meetup Coordination",
        description: "Schedule meetups for travel plans with RSVP functionality. Integrated Google Meet links for virtual coordination and real-time status updates.",
        icon: "Video"
      },
      {
        title: "Join Request System",
        description: "Request to join public travel plans or invite members to your own plans. Flexible member role management (OWNER, ADMIN, MEMBER, VIEWER) with approval workflow.",
        icon: "UserPlus"
      },
      {
        title: "Real-time Notifications",
        description: "Stay updated with real-time notifications for trip invitations, join requests, meetup RSVPs, and other important travel-related events.",
        icon: "Bell"
      },
      {
        title: "Subscription Management",
        description: "Flexible monthly and yearly subscription plans with Stripe integration. Manage subscription status, view payment history, and cancel or resume subscriptions as needed.",
        icon: "CreditCard"
      },
      {
        title: "Profile Management",
        description: "Create a comprehensive profile with bio, location, interests, and visited countries. Upload profile images and showcase your travel experiences.",
        icon: "User"
      },
      {
        title: "Dashboard Overview",
        description: "Personal dashboard with travel statistics, recent activity, upcoming meetups, top travel plans, and visual analytics to track your travel journey.",
        icon: "LayoutDashboard"
      }
    ]
  },

  // ============================================
  // TECHNOLOGY STACK
  // ============================================
  techStack: {
    frontend: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Shadcn UI",
      "Radix UI",
      "Lucide React Icons",
      "Recharts"
    ],
    backend: [
      "RESTful API",
      "JWT Authentication",
      "Server Actions",
      "Zod Validation",
      "React Hook Form"
    ],
    services: [
      "Stripe Payment Integration",
      "AI Integration (Travel Planning)",
      "Google Meet Integration",
      "imgBB (Image Storage)",
      "JWT Token Management"
    ]
  },

  // ============================================
  // GITHUB REPOSITORIES (Project-specific)
  // ============================================
  repositories: {
    frontend: {
      name: "Frontend",
      description: "Next.js Application",
      url: "https://github.com/HamzaAryanSapnil/travel-buddy-frontend"
    },
    backend: {
      name: "Backend",
      description: "Express.js API",
      url: "https://github.com/HamzaAryanSapnil/travel-buddy-backend"
    }
  },

  // ============================================
  // HOMEPAGE ABOUT SECTION
  // ============================================
  homepageAbout: {
    smallHeading: "Get To Know",
    mainHeading: "Welcome to Travel Buddy",
    subDescription: "Plan, Collaborate, and Explore Together!",
    bulletPoints: [
      "AI-powered travel itinerary generation for personalized trip planning.",
      "Seamless collaboration tools to plan trips with friends and fellow travelers.",
      "Smart expense tracking and splitting for transparent financial management.",
      "Comprehensive platform bringing together itineraries, expenses, media, and meetups."
    ],
    sinceYear: "2024",
    sinceDescription: "Travel Buddy was born from a simple frustration: planning group trips was complicated and time-consuming. We set out to create a platform that makes travel planning as enjoyable as the trip itself. Founded in 2024, Travel Buddy has grown into a comprehensive platform trusted by travelers worldwide.",
    aboutImage: "/assets/images/travel-buddy-about.jpg",
    learnMoreLink: "/about"
  }
};


