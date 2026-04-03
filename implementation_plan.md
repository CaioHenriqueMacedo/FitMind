# FitMind Security and Functionality Implementation Plan

This plan aims to make the FitMind application 100% functional, secure, and production-ready, without altering any UI, components, styles, or layouts.

## User Review Required

> [!IMPORTANT]
> The database requires you to run a SQL script in your Supabase SQL Editor to enable Row-Level Security (RLS). Please confirm if you would like me to generate this SQL script as part of the execution. I will place it in the root folder for you to run manually.
> You will also need to add your `OPENAI_API_KEY` to your `.env` or `.env.local` to enable the AI coach functionalities.

## Proposed Changes

### Database Security
- I will create a `database_rls_setup.sql` script containing PostgreSQL statements to enable RLS on `profiles`, `workouts`, `meals`, `weight_history`, and `daily_goals` to ensure users can only access their own data.

---

### Backend API Routes

I will migrate direct database mutations from the frontend to secure backend API routes. Each route will implement strict request validation (using Zod) and authentication checks (via Supabase auth).

#### [NEW] [app/api/workouts/route.ts](file:///c:/Users/Windows%2010/Downloads/FitMind/app/api/workouts/route.ts)
- Implement `POST` (create workout) and `DELETE` (remove workout).
- Server-side validation of duration, calories, type, and name.

#### [NEW] [app/api/meals/route.ts](file:///c:/Users/Windows%2010/Downloads/FitMind/app/api/meals/route.ts)
- Implement `POST` (create meal) and `DELETE` (remove meal).
- Validate required fields (name, calories, protein, etc.).

#### [NEW] [app/api/progress/route.ts](file:///c:/Users/Windows%2010/Downloads/FitMind/app/api/progress/route.ts)
- Implement `POST` (add weight history).

#### [NEW] [app/api/profile/route.ts](file:///c:/Users/Windows%2010/Downloads/FitMind/app/api/profile/route.ts)
- Implement `PUT` (update profile goals and info).

---

### AI Integration

#### [MODIFY] [app/api/coach/route.ts](file:///c:/Users/Windows%2010/Downloads/FitMind/app/api/coach/route.ts)
- Transition from arbitrary model string to the `@ai-sdk/openai` provider.
- Verify user authentication before processing the stream to prevent unauthorized usage.
- Secure the System Prompt against prompt injections.
- Add error handling to prevent API key leakage.

---

### Frontend Integration

I will update frontend components to connect to the new secure API routes instead of direct Supabase interactions.

#### [MODIFY] Client Actions
- `components/workouts/create-workout-dialog.tsx`
- `components/workouts/workout-actions.tsx`
- `components/nutrition/add-meal-dialog.tsx`
- `components/nutrition/meals-list.tsx`
- `components/progress/add-weight-dialog.tsx`
- `components/profile/profile-form.tsx`

Each of these will be modified to use `fetch('/api/...')` with appropriate error handling and state management.

---

### Application Security & Environment
#### [MODIFY] [package.json](file:///c:/Users/Windows%2010/Downloads/FitMind/package.json)
- Add `@ai-sdk/openai` for secure AI integration.
- Ensure strict versions for security libraries like `zod`.

#### [MODIFY] [.env.example](file:///c:/Users/Windows%2010/Downloads/FitMind/.env.example)
- Document the `OPENAI_API_KEY` requirement.

## Verification Plan

### Automated/Manual Verification
- Check all frontend forms to ensure they save to the database correctly.
- Try accessing API routes directly without an active session to test 401 Unauthorized responses.
- Verify the AI chat properly uses the OpenAI provider and refuses malicious instructions.
- Ensure the app builds (`npm run build`) with no TypeScript or linting errors.
