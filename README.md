# HyperGuest Full-Stack Application

## Technologies

- Backend: Node.js, TypeScript, NestJS, TypeORM
- Frontend: Vue.js, Vuex,
- Database: SQLite

## Getting Started


### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Run database migrations:
   ```bash
   cd backend
   npm run migration:run
   ```

### Running the Application

1. Start backend server:
   ```bash
   cd backend
   npm run start:dev
   ```
2. Start frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Implementation

### User Role Management
- Changed from single role to multiple roles per user
- Database column changed from `role` to `roles`
- Created migration to convert data
- Updated entity for roles array
- Added Vuex getters for role checking

### User Status Enhancement
- Replaced boolean status with enum
- Created migration for conversion
- Added `UserStatus` enum in backend entity

### Authorization
- Added check in login endpoint for deleted users
- Returns HTTP 401 with `UnauthorizedException` for deleted accounts
- Frontend catches errors and displays appropriate message

### State Management
- Moved all HTTP requests to Vuex actions
- Created centralized login action with error handling
- Added loading and error state mutations
- Implemented getters for permission checking

### Route Protection
- Added `beforeEach` guard in Vue Router
- Checks authentication roles before navigation
- Redirects unauthorized users to login or home page

### User Interface
- Change navbar style 
- Shows all page titles but disables unauthorized ones in gray
- Displays username from vuex store on all pages
- delete no needed duplicated button

## Suggested Improvements

### Security
- Should use JWT authentication
- Add password hashing

### Frontend
- Should use TypeScript support
- Implement form validation
- Add sign in option 

### Architecture
- Add testing
- Add documentation for debugging
