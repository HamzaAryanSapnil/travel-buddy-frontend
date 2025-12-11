# Travel Buddy

**Category:** Travel Planning & Collaboration Platform

## 📖 Description

Travel Buddy is a comprehensive full-stack web application designed to revolutionize how people plan, organize, and collaborate on their travel adventures. The platform combines AI-powered planning capabilities with robust collaboration features, making it easy for travelers to create detailed itineraries, manage expenses, coordinate meetups, and share memories with friends and fellow travelers.

### Key Highlights

- **AI-Powered Planning**: Generate personalized travel itineraries using advanced AI technology
- **Real-time Collaboration**: Invite friends, share ideas, and plan trips together with seamless communication
- **Smart Expense Management**: Track and split expenses effortlessly among travel companions
- **Comprehensive Organization**: Manage itineraries, meetups, media galleries, and reviews all in one place
- **Subscription-Based Model**: Flexible monthly and yearly subscription plans with Stripe integration
- **Admin Dashboard**: Complete administrative panel for managing users, plans, subscriptions, and payments

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16.0.7** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn UI** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **next-themes** - Dark mode support

### State Management & Forms
- **Zod 4.1.13** - Schema validation
- **React Hook Form** - Form state management
- **useActionState** - Server actions state management

### Payment Integration
- **Stripe** - Payment processing
  - `@stripe/stripe-js`
  - `@stripe/react-stripe-js`

### Data Visualization
- **Recharts 3.5.1** - Chart library for analytics

### Utilities
- **date-fns 4.1.0** - Date manipulation
- **jsonwebtoken 9.0.3** - JWT authentication
- **cookie 1.1.1** - Cookie handling
- **sonner 2.0.7** - Toast notifications

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Babel React Compiler** - React optimization

## 📁 Folder Structure

```
travel-buddy-next-frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (commonLayout)/           # Public pages layout
│   │   │   ├── (auth)/              # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── about/               # About page
│   │   │   ├── contact/             # Contact page
│   │   │   ├── travel-plans/        # Public travel plans
│   │   │   └── page.tsx             # Home page
│   │   ├── (dashboardLayout)/       # Dashboard pages layout
│   │   │   ├── admin/               # Admin dashboard
│   │   │   │   └── dashboard/
│   │   │   │       ├── users/       # User management
│   │   │   │       ├── travel-plans/# All travel plans
│   │   │   │       ├── subscriptions/# Subscription management
│   │   │   │       └── payments/    # Payment statistics
│   │   │   └── dashboard/           # User dashboard
│   │   │       ├── travel-plans/    # Travel plans management
│   │   │       ├── meetups/         # Meetups management
│   │   │       ├── my-requests/     # Join requests
│   │   │       ├── notifications/   # Notifications
│   │   │       ├── planner/         # AI planner
│   │   │       ├── profile/         # User profile
│   │   │       ├── subscriptions/   # Subscriptions
│   │   │       ├── payments/        # Payment history
│   │   │       └── media/           # Media gallery
│   │   ├── subscription/            # Stripe success page
│   │   └── globals.css              # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── modules/                 # Feature modules
│   │   │   ├── Admin/               # Admin components
│   │   │   ├── Collaboration/       # Media gallery
│   │   │   ├── Dashboard/           # Dashboard components
│   │   │   ├── Home/                # Home page components
│   │   │   ├── Meetups/             # Meetup components
│   │   │   ├── Notifications/       # Notification components
│   │   │   ├── Planner/              # AI planner components
│   │   │   ├── Profile/             # Profile components
│   │   │   ├── Subscriptions/       # Subscription components
│   │   │   └── TravelPlans/         # Travel plan components
│   │   ├── shared/                  # Shared components
│   │   └── ui/                      # Shadcn UI components
│   │
│   ├── services/                     # API service layer
│   │   ├── admin/                   # Admin services
│   │   ├── auth/                    # Authentication services
│   │   ├── dashboard/               # Dashboard services
│   │   ├── expenses/                # Expense services
│   │   ├── itinerary/               # Itinerary services
│   │   ├── media/                   # Media services
│   │   ├── meetups/                 # Meetup services
│   │   ├── notifications/           # Notification services
│   │   ├── payments/                # Payment services
│   │   ├── planner/                 # AI planner services
│   │   ├── profile/                 # Profile services
│   │   ├── subscriptions/           # Subscription services
│   │   ├── travelPlans/             # Travel plan services
│   │   ├── tripBookings/            # Booking services
│   │   └── tripMembers/             # Member services
│   │
│   ├── types/                        # TypeScript interfaces
│   │   ├── admin.interface.ts
│   │   ├── dashboard.interface.ts
│   │   ├── expense.interface.ts
│   │   ├── itinerary.interface.ts
│   │   ├── meetup.interface.ts
│   │   ├── notification.interface.ts
│   │   ├── payment.interface.ts
│   │   ├── subscription.interface.ts
│   │   ├── travelPlan.interface.ts
│   │   └── user.interface.ts
│   │
│   ├── zod/                          # Zod validation schemas
│   │   ├── auth.validation.ts
│   │   ├── expense.validation.ts
│   │   ├── travelPlan.validation.ts
│   │   └── ...
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── auth-utils.ts            # Authentication utilities
│   │   ├── server-fetch.ts          # Server-side fetch wrapper
│   │   ├── public-fetch.ts          # Public API fetch wrapper
│   │   ├── formatters.ts            # Data formatting utilities
│   │   ├── navItems.config.ts       # Navigation configuration
│   │   └── ...
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useDebounce.ts
│   │
│   ├── assets/                      # Static assets
│   │   └── images/
│   │
│   └── proxy.ts                      # Next.js middleware
│
├── public/                           # Static files
├── package.json                      # Dependencies
└── README.md                         # This file
```

## 🎯 Modules Overview

### 1. **Authentication & Authorization**
- User registration and login
- JWT-based authentication
- Role-based access control (USER, ADMIN)
- Protected routes with middleware
- Token refresh mechanism

### 2. **Travel Plans Management**
- Create, edit, and delete travel plans
- Set destination, dates, budget, and travel type
- Public, private, and unlisted visibility options
- Filter and search functionality
- Grid and list view options

### 3. **AI Planner**
- Interactive chat-based AI assistant
- Generate personalized travel itineraries
- Save and export AI-generated plans
- Session management

### 4. **Itinerary Management**
- Day-by-day itinerary creation
- Add activities with time, location, and description
- Drag-and-drop reordering
- Activity categories and icons

### 5. **Expense Tracking**
- Add, edit, and delete expenses
- Categorize expenses
- Track who paid what
- Expense summary and charts
- Split expenses among members

### 6. **Media Gallery**
- Upload multiple images
- View media in grid format
- Delete media items
- Media gallery for all travel plans

### 7. **Meetups**
- Schedule meetups for travel plans
- RSVP functionality
- Google Meet integration
- Filter by date and status
- Meetup details and management

### 8. **Trip Members & Requests**
- Invite members to travel plans
- Join request system
- Member role management (OWNER, ADMIN, MEMBER, VIEWER)
- Approve/reject join requests
- Remove members

### 9. **Subscriptions & Payments**
- Monthly and yearly subscription plans
- Stripe payment integration
- Subscription status management
- Payment history
- Cancel/resume subscriptions
- Payment summary and statistics

### 10. **Notifications**
- Real-time notification system
- Notification dropdown in navbar
- Mark as read functionality
- Filter by read/unread status
- Notification types for various events

### 11. **Profile Management**
- View and edit user profile
- Upload profile image
- Update bio, location, interests
- Track visited countries

### 12. **Admin Dashboard**
- User management (view, suspend, activate, delete)
- View all travel plans
- Subscription management
- Payment statistics and analytics
- Charts and visualizations

### 13. **Dashboard Overview**
- User dashboard with statistics
- Recent activity feed
- Upcoming meetups
- Top travel plans
- Charts and analytics

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user info

### Travel Plans
- `GET /api/v1/travel-plans` - Get user's travel plans (with filters)
- `GET /api/v1/travel-plans/public` - Get public travel plans
- `GET /api/v1/travel-plans/:id` - Get travel plan details
- `POST /api/v1/travel-plans` - Create travel plan
- `PATCH /api/v1/travel-plans/:id` - Update travel plan
- `DELETE /api/v1/travel-plans/:id` - Delete travel plan

### Itinerary
- `GET /api/v1/travel-plans/:id/itinerary` - Get itinerary
- `GET /api/v1/travel-plans/:id/itinerary/items` - Get itinerary items
- `POST /api/v1/travel-plans/:id/itinerary/items` - Create itinerary item
- `PATCH /api/v1/travel-plans/:id/itinerary/items/:itemId` - Update itinerary item
- `DELETE /api/v1/travel-plans/:id/itinerary/items/:itemId` - Delete itinerary item
- `PATCH /api/v1/travel-plans/:id/itinerary/reorder` - Reorder itinerary items

### Expenses
- `GET /api/v1/travel-plans/:id/expenses` - Get expenses
- `POST /api/v1/travel-plans/:id/expenses` - Create expense
- `PATCH /api/v1/travel-plans/:id/expenses/:expenseId` - Update expense
- `DELETE /api/v1/travel-plans/:id/expenses/:expenseId` - Delete expense

### Media
- `GET /api/v1/travel-plans/:id/media` - Get media
- `POST /api/v1/travel-plans/:id/media` - Upload media
- `DELETE /api/v1/travel-plans/:id/media/:mediaId` - Delete media

### Meetups
- `GET /api/v1/meetups` - Get meetups
- `GET /api/v1/travel-plans/:id/meetups` - Get plan meetups
- `GET /api/v1/meetups/:id` - Get meetup details
- `POST /api/v1/travel-plans/:id/meetups` - Create meetup
- `PATCH /api/v1/meetups/:id` - Update meetup
- `DELETE /api/v1/meetups/:id` - Delete meetup
- `POST /api/v1/meetups/:id/rsvp` - RSVP to meetup

### Trip Members
- `GET /api/v1/travel-plans/:id/members` - Get members
- `POST /api/v1/travel-plans/:id/members` - Add member
- `PATCH /api/v1/travel-plans/:id/members/:memberId` - Update member role
- `DELETE /api/v1/travel-plans/:id/members/:memberId` - Remove member

### Trip Bookings (Join Requests)
- `GET /api/v1/trip-bookings/my-requests` - Get user's requests
- `GET /api/v1/travel-plans/:id/bookings` - Get plan bookings
- `POST /api/v1/travel-plans/:id/bookings` - Send join request
- `PATCH /api/v1/trip-bookings/:id/respond` - Respond to request
- `DELETE /api/v1/trip-bookings/:id` - Cancel request

### Subscriptions
- `GET /api/v1/subscriptions/status` - Get subscription status
- `POST /api/v1/subscriptions` - Create subscription
- `PATCH /api/v1/subscriptions` - Update subscription
- `DELETE /api/v1/subscriptions` - Cancel subscription

### Payments
- `GET /api/v1/payments/my-payments` - Get user payments
- `GET /api/v1/payments/summary` - Get payment summary

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `GET /api/v1/notifications/unread-count` - Get unread count
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification

### Profile
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update user profile

### Admin
- `GET /api/v1/admin/users` - Get all users
- `PATCH /api/v1/admin/users/:id/status` - Update user status
- `GET /api/v1/admin/subscriptions` - Get all subscriptions
- `GET /api/v1/admin/payments` - Get payment statistics
- `GET /api/v1/admin/payments/history` - Get all payments

### Dashboard
- `GET /api/v1/dashboard/overview` - Get user dashboard overview
- `GET /api/v1/admin/dashboard/overview` - Get admin dashboard overview

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api/v1
# or for production:
# NEXT_PUBLIC_BASE_API_URL=https://your-api-domain.com/api/v1

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters

# Stripe Configuration (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Application Configuration
NODE_ENV=development
# or for production:
# NODE_ENV=production
```

### Environment Variables Explanation

- `NEXT_PUBLIC_BASE_API_URL`: Base URL for the backend API
- `JWT_SECRET`: Secret key for JWT token verification (must be at least 32 characters)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for client-side payments
- `STRIPE_SECRET_KEY`: Stripe secret key for server-side operations
- `NODE_ENV`: Environment mode (development/production)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **Bun** (recommended) or **npm**/**yarn**
- Backend API server running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-buddy-next-frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## 📱 Features in Detail

### User Features
- ✅ Create and manage travel plans
- ✅ AI-powered travel planning
- ✅ Collaborative itinerary building
- ✅ Expense tracking and splitting
- ✅ Media gallery for trip photos
- ✅ Meetup scheduling with Google Meet
- ✅ Join request system
- ✅ Real-time notifications
- ✅ Subscription management
- ✅ Payment history

### Admin Features
- ✅ User management (view, suspend, activate, delete)
- ✅ View all travel plans
- ✅ Subscription management
- ✅ Payment statistics and analytics
- ✅ Dashboard with charts and visualizations

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Mode**: Full dark mode support
- **Accessibility**: WCAG compliant components
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Graceful error messages and fallbacks
- **Toast Notifications**: User-friendly feedback system

## 🔒 Security Features

- JWT-based authentication
- Protected routes with middleware
- Server-side validation with Zod
- Secure cookie handling
- Role-based access control
- CSRF protection

## 📊 Performance Optimizations

- Server-side rendering (SSR)
- Static page generation where applicable
- Image optimization
- Code splitting
- Lazy loading
- Cache revalidation strategies

## 🤝 Contributing

This is an educational project. Contributions are welcome for learning purposes.

## 📫 Author

**Hamza Aryan Sapnil**  
📍 Bangladesh  
🌐 [LinkedIn](https://www.linkedin.com/in/hamza-aryan-sapnil)  
💻 Full Stack Developer

## 📄 License

This project is licensed for educational purposes under MIT.

---

Made with ❤️ for travelers around the world
