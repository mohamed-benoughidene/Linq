## Form UX Features

### Overview
Authentication forms (login and signup) implement comprehensive UX improvements including real-time validation, loading states, and micro-interactions for a professional user experience.

### Error Handling

#### Field-Level Validation
- **Real-time validation**: Validates on blur (when user leaves field)
- **Progressive validation**: Errors only show after field is touched
- **User-friendly messages**: Technical errors converted to actionable guidance
  - Example: "Invalid login credentials" → "The email or password you entered is incorrect. Please try again."
- **Visual indicators**: 
  - Red border on invalid fields
  - AlertCircle icons next to error messages
  - Color-coded text (red for errors, green for success)

#### Validation Rules
**Email:**
- Required field
- Must match format: `example@domain.com`
- Validates on blur and updates on change if touched

**Password:**
- Required field
- Minimum 6 characters
- Must contain both letters AND numbers
- Pattern: `/(?=.*[a-zA-Z])(?=.*[0-9])/`

#### Error Message Placement
- Field errors: Directly below the problematic input
- Global errors: At top of form (e.g., auth failures, network errors)
- Rate limit errors: Include countdown timer showing retry availability

### Loading States

#### Button States
- **Login/Signup buttons**: Text changes to "Logging in..." / "Creating Account..." with spinner
- **Google OAuth button**: Shows "Signing in..." with spinner
- **Disabled states**: All interactive elements disabled during async operations
- **Visual loading indicators**: Loader2 icon from lucide-react with spin animation

#### State Management
```tsx
const [loading, setLoading] = useState(false);
const [googleLoading, setGoogleLoading] = useState(false);
```
- Separate loading states for email and OAuth flows
- Form inputs disabled when any loading state is active
- Prevents duplicate submissions

### Micro-interactions

#### Animations (Tailwind v4)
Defined in `src/app/globals.css` using Tailwind v4 syntax:

```css
@theme {
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-shake: shake 0.5s ease-in-out;
}

@keyframes fade-in {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}
```

Usage: `className="animate-shake"` or `className="animate-fade-in"`

#### Interaction Effects
- **Shake animation**: Form card shakes on validation errors (0.5s)
- **Fade-in effects**: Error/success messages smoothly appear (0.3s)
- **Button hover**: Scale up to 1.02x (`hover:scale-[1.02]`)
- **Button press**: Scale down to 0.98x (`active:scale-[0.98]`)
- **Focus rings**: Enhanced 2px ring with offset for keyboard navigation
- **Smooth transitions**: 200ms duration on all state changes (`transition-all duration-200`)

### Password Strength Indicator (Signup Only)

#### Strength Levels
- **Weak** (red): Less than 6 chars OR missing letters/numbers
- **Medium** (yellow): 6-9 chars with both letters and numbers
- **Strong** (green): 10+ chars with both letters and numbers

#### Visual Feedback
- 3-bar progress indicator with color transitions
- Real-time updates as user types
- Contextual hint text based on strength level
- Uses `watch('password')` from react-hook-form for reactivity

```tsx
useEffect(() => {
  if (password) {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasBoth = hasLetters && hasNumbers;
    
    if (password.length < 6 || !hasBoth) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }
}, [password]);
```

### React Hook Form Integration

#### Registration Pattern
Event handlers integrated with `register()` to avoid conflicts:

```tsx
<Input
  {...register('email', {
    onBlur: handleEmailBlur,
    onChange: handleEmailChange
  })}
/>
```

#### Value Retrieval
Use `getValues()` instead of event targets to avoid timing issues:

```tsx
const handleEmailBlur = () => {
  const email = getValues('email');
  const emailError = validateEmail(email);
  // ...
};
```

#### Touched State Tracking
```tsx
const [touched, setTouched] = useState({email: false, password: false});
```
- Tracks which fields user has interacted with
- Errors only show after field is touched (blur event)
- Progressive validation: updates on change after first blur

### Accessibility Features

- **ARIA labels**: Password visibility toggle buttons have descriptive labels
  ```tsx
  aria-label={showPassword ? "Hide password" : "Show password"}
  ```
- **Keyboard navigation**: All interactive elements accessible via Tab
- **Focus management**: Enhanced focus rings for visibility
- **Screen reader support**: Error messages announced when they appear
- **Disabled state styling**: Visual feedback when form is submitting

### Rate Limiting Handling

For signup form with Upstash rate limiting:

```tsx
const [retryAfter, setRetryAfter] = useState<number | null>(null);

useEffect(() => {
  if (retryAfter && retryAfter > 0) {
    const timer = setTimeout(() => {
      setRetryAfter(retryAfter - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [retryAfter]);
```

- Shows countdown timer when rate limited
- Disables submit button during countdown
- Error message includes "Retry in X seconds"
- Clears error when countdown reaches 0

### File Locations

- **Login Form**: `src/components/ui/login-form.tsx`
- **Signup Form**: `src/components/ui/signup-form.tsx`
- **Animations**: `src/app/globals.css` (Tailwind v4 `@theme` and `@keyframes`)
- **Form Actions**: `src/app/actions/auth.ts` (Google OAuth)
- **API Routes**: `src/app/api/auth/signup/route.ts` (Email signup with rate limiting)

### Dependencies

- `react-hook-form`: Form state management and validation
- `lucide-react`: Icons (Loader2, AlertCircle, CheckCircle2, Eye, EyeOff)
- `@supabase/supabase-js`: Authentication
- Tailwind CSS v4: Styling and animations

### Testing Checklist

- [ ] Type invalid email → blur → see error + shake
- [ ] Type valid email → error disappears immediately
- [ ] Type password without numbers → blur → see error
- [ ] Type password with letters and numbers → strength indicator updates
- [ ] Submit form with valid data → see loading state
- [ ] Submit form with invalid data → see shake animation
- [ ] Click Google sign in → see separate loading state
- [ ] Tab through form → focus states visible
- [ ] Hover over buttons → see scale effect
- [ ] Click buttons → see press effect
- [ ] Trigger rate limit → see countdown timer